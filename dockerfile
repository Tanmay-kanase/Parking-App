# --- Stage 1: Build the React/Vite Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Copy package files first to leverage Docker layer caching
COPY client/package*.json ./
RUN npm install

# Copy the rest of the client code and build
COPY client/ ./
RUN npm run build
# The built files are now inside /app/client/dist


# --- Stage 2: Build the Spring Boot Application ---
FROM maven:3.9.6-eclipse-temurin-21 AS backend-builder
WORKDIR /app

# Copy the pom.xml and backend source code
COPY pom.xml .
COPY src ./src

# Create the static directory (just in case it doesn't exist) and 
# copy the compiled frontend directly into Spring Boot's static resources folder
RUN mkdir -p ./src/main/resources/static
COPY --from=frontend-builder /app/client/dist/ ./src/main/resources/static/

# Package the Spring Boot application
# The resulting JAR will now have the React frontend bundled inside it
RUN mvn clean package -DskipTests


# --- Stage 3: Production Runtime Image ---
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy ONLY the final JAR file from the backend-builder stage
COPY --from=backend-builder /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]