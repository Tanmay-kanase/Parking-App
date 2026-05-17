# ================================
# Stage 1: Build React/Vite Frontend
# ================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# Copy package files first (better caching)
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy remaining frontend files
COPY client/ ./

# Build frontend
RUN npm run build


# ================================
# Stage 2: Build Spring Boot Backend
# ================================
FROM maven:3.9.6-eclipse-temurin-21 AS backend-builder

WORKDIR /app

# Copy Maven files
COPY pom.xml ./

# Copy backend source
COPY src ./src

# Create static resources folder
RUN mkdir -p ./src/main/resources/static

# Copy frontend build into Spring Boot static folder
COPY --from=frontend-builder /app/client/dist/ ./src/main/resources/static/

# Build Spring Boot JAR
RUN mvn clean package -DskipTests


# ================================
# Stage 3: Production Runtime
# ================================
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy built JAR from backend stage
COPY --from=backend-builder /app/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]