# Home Library Service (NestJS)

A REST service built with **NestJS** for managing a personal music library.  
It supports CRUD operations for **Users**, **Artists**, **Albums**, **Tracks**, and a **Favorites** collection.

This project is developed for the **Assignment: REST Service** of the **NodeJS 2025 Q4** course.

---

## 🚀 Technology Stack

- **NestJS** (Modules, Controllers, Providers)
- **TypeScript**
- **UUID (randomUUID)** for ID generation
- **dotenv** for environment configuration
- NestJS tools:
  - `ValidationPipe` (DTO validation)
  - Custom exception filters
  - Built-in pipes (e.g., `ParseUUIDPipe`)
- In-memory data storage (will later be replaced with DB)

---

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

### Running docker

```bash

docker-compose up --build
```

### Checking user-defined bridge

```bash

docker network ls
docker network inspect nodejs2025q2-service_app_net
docker exec -it nest_app ping postgres
```
