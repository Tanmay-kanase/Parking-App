# ================================
# Stage 1: Build React/Vite Frontend
# ================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# 1. Accept the specific build arguments from Render
ARG VITE_BACKEND_URL
ARG VITE_GOOGLE_API_KEY
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_FIREBASE_API_KEY
ARG VITE_RAZORPAY_KEYID

# 2. Map them to ENV so Vite can bake them into the build
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_RAZORPAY_KEYID=$VITE_RAZORPAY_KEYID

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
