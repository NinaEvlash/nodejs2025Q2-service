# Node.js NestJS Service

Example NestJS project with PostgreSQL database, containerized using Docker.

## Requirements

- Docker (>=20)
- Docker Compose (v2+)
- Node.js (not required locally, everything is in containers)

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

### Production mode

```bash

docker compose -f docker-compose.yml up -d
```

Containers created:

- nest_app — your application
- postgres_db — PostgreSQL database

Access the application: http://localhost:4000/api/

#### Stop containers

```bash

docker compose -f docker-compose.yml down
```

### Development mode

```bash

docker compose -f docker-compose.dev.yml up -d
```

Source code is mounted as a volume so changes in src/ are reflected in the container automatically.

#### Stop containers

```bash

docker compose -f docker-compose.dev.yml down
```

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

## DockerHub

Image available on DockerHub: ninaevlash/nodejs2025q2-service:latest

```bash

docker pull ninaevlash/nodejs2025q2-service:latest
docker run -p 4000:4000 ninaevlash/nodejs2025q2-service:latest

```

### Volumes and networks

- Database files and node_modules are stored in Docker volumes.
- Containers are connected to user-defined bridge network nodejs2025q2-service_app_net.
