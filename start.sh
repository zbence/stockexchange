docker network create backend

docker run -d --name mongodb --network backend mongo
docker run -d --name exchangeApp --network backend -v %cd%:/app -p 8080:8080 -p 8081:8081 node:9.11.1-alpine node /app/js/main.js