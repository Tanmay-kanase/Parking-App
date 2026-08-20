# Stage 1: Fetch pre-built frontend dist from GitHub
FROM alpine/git AS frontend-fetcher

WORKDIR /app

# Shallow clone only the repo containing the ready-made dist folder
RUN git clone --depth 1 https://github.com/Tanmay-kanase/Parking-Backend-NodeJs.git repo

# Stage 2: Build Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-21 AS backend-builder

WORKDIR /app

# Copy Maven files
COPY pom.xml ./

# Copy backend source
COPY src ./src

# Create static resources folder
RUN mkdir -p ./src/main/resources/static

# Copy the pre-built frontend dist into Spring Boot static folder
COPY --from=frontend-fetcher /app/repo/src/client/dist/ ./src/main/resources/static/

# Build Spring Boot JAR
RUN mvn clean package -DskipTests

# Stage 3: Production Runtime
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy built JAR from backend stage
COPY --from=backend-builder /app/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
