# Node.js NestJS Service

Example NestJS project with PostgreSQL database, containerized using Docker.

## Requirements

- [Git](https://git-scm.com/install/)
- [Node.js](https://nodejs.org/en/download/)
- [Docker Compose](https://docs.docker.com/engine/install/)

## Downloading

```
git clone {repository URL}
cd <project-folder>
```

## Installing NPM modules

```
npm install
```

### Environment Variables

This project uses a `.env` file to store environment variables.

Create a `.env` file in the project root:

```bash

cp .env.example .env
```

## Running the application

```bash

docker compose up --build –d
```

Containers created:

- nest_app — your application
- postgres_db — PostgreSQL database

Access the application: http://localhost:4000/api/

## Checking the application

### Check container status

```bash

docker ps
```

### View application logs

```bash

docker logs nest_app
```

### Check for dependency vulnerabilities

```bash

npm run audit
```

## Stop containers

```bash

docker compose down
```

### Production mode

```bash

docker compose -f docker-compose.yml up -d
```

### Stop containers

```bash

docker compose -f docker-compose.yml down
```

### Development mode

```bash

docker compose -f docker-compose.dev.yml up -d
```

Source code is mounted as a volume so changes in src/ are reflected in the container automatically.

### Stop containers

```bash

docker compose -f docker-compose.dev.yml down
```

## Important Note!!!!!

After starting the Docker containers, it is essential to run the database migrations before running the tests. Use the following command:

```bash

$env:POSTGRES_HOST="localhost"; npm run migration:run -- -d ./typeorm.config.ts
```

Only after running the migrations, you can safely execute the tests:

```bash

npm run test
```

Failing to run the migrations first will cause the tests to fail due to missing database tables and relations.

## DockerHub

[Image available on DockerHub](https://hub.docker.com/r/ninaevlash/nodejs2025q2-service)

```bash

docker pull <docker image name>
docker run -p 4000:4000 <docker image name>

```

### Volumes and networks

- Database files and node_modules are stored in Docker volumes.
- Containers are connected to user-defined bridge network nodejs2025q2-service_app_net.
