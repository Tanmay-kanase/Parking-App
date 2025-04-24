#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Updating system ==="
sudo apt update && sudo apt upgrade -y

echo "=== Installing Git ==="
sudo apt install git -y

echo "=== Installing Node.js 18.3.1 ==="
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v

echo "=== Installing Java 21 ==="
sudo apt install -y openjdk-21-jdk
java -version

echo "=== Installing Maven ==="
sudo apt install -y maven
mvn -v

echo "=== Cloning your GitHub project ==="
git clone https://github.com/Tanmay-kanase/Parking-App.git
cd Parking-App

# Get EC2 public IP dynamically
echo "=== Fetching EC2 Public IP ==="
EC2_IP=$(curl -s http://checkip.amazonaws.com)
echo "Your EC2 Public IP is: $EC2_IP"

echo "=== Setting up .env for React Vite frontend ==="
cd client
cat <<EOF > .env
VITE_GOOGLE_API_KEY=your_api_key_here
VITE_BACKEND_URL=http://$EC2_IP:8088
GOOGLE_CLIENT_ID=your_google_client_id_here
EOF

echo ".env file created in client/"

echo "=== Installing Node dependencies ==="
npm install

cd ..

echo "=== Creating Spring Boot application.properties ==="
mkdir -p src/main/resources
cat <<EOF > src/main/resources/application.properties
app.frontend_url=http://$EC2_IP:5173

# Replace Application.properties 
# code here 


EOF

echo "application.properties created!"

# Optional: Run both frontend and backend in background
echo "=== Starting Spring Boot backend ==="
nohup mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8088 > backend.log 2>&1 &

echo "=== Starting React frontend ==="
cd client
nohup npm run dev -- --host 0.0.0.0 --port 5173 > frontend.log 2>&1 &

echo "=== All services started ==="
echo "Visit Frontend: http://$EC2_IP:5173"
echo "API Base URL: http://$EC2_IP:8088"
