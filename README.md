# Home Library Service (NestJS)

A REST service built with **NestJS** for managing a personal music library.  
It supports CRUD operations for **Users**, **Artists**, **Albums**, **Tracks**, and a **Favorites** collection.

This project is developed for the **Assignment: REST Service** of the **NodeJS 2025 Q2** course.

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
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
