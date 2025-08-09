# ===== Stage 1: Build Frontend =====
FROM node:20 AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# ===== Stage 2: Build Backend =====
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Copy frontend build into backend static folder
COPY --from=frontend-build /app/client/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# ===== Stage 3: Production =====
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
