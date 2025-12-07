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

nest_app — your application
postgres_db — PostgreSQL database

Access the application: http://localhost:4000/api/

## Stop containers

```bash

docker compose -f docker-compose.yml down
```

### Development mode
