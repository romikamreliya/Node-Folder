# 🚀 Node.js Advanced API Project

A production-oriented **Node.js REST API platform** built on Express 5. It provides a layered, module-based architecture with authentication (JWT + custom AES tokens), RBAC authorization, request validation (AJV), Prisma-based persistence (with a raw mysql2 escape hatch), real-time communication (Socket.IO), IoT messaging (MQTT), background jobs (cron + worker threads), i18n responses, structured logging, rate limiting, and Swagger docs.

![Node Version](https://img.shields.io/badge/node-24.x-green)
![Express Version](https://img.shields.io/badge/express-5.2.1-green)
![ORM](https://img.shields.io/badge/ORM-Prisma_7-blue)
![License](https://img.shields.io/badge/license-ISC-blue)

> 📎 For machine-oriented architecture notes and contribution rules, see **[AI_CONTEXT.md](AI_CONTEXT.md)** and **[AI_RULE.md](AI_RULE.md)**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Architecture](#-architecture)
- [Request Lifecycle](#-request-lifecycle)
- [Adding a New Module](#-adding-a-new-module)
- [Database](#-database)
- [API Reference](#-api-reference)
- [Real-time & Messaging](#-real-time--messaging)
- [Background Jobs](#-background-jobs)
- [Security](#-security)
- [Testing](#-testing)
- [Logging & Monitoring](#-logging--monitoring)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 📌 Overview

- **RESTful API** with route versioning (`/api/v1`, `/api/v2`)
- **Vertical-slice modules** — each feature owns its routes, controller, service, model, DTO, schema, and resource
- **Authentication & RBAC** — Bearer tokens (custom AES-256-GCM), JWT, HMAC refresh tokens, and permission-based route guards
- **Validation** — AJV schemas with custom formats (email, phone, website, date, time)
- **Persistence** — Prisma ORM (SQLite by default via better-sqlite3 adapter) plus a raw **mysql2** pool for direct SQL/views
- **Real-time** — Socket.IO server + client, with an app-wide event bus
- **Messaging** — MQTT publisher/subscriber
- **Background processing** — cron jobs and worker threads
- **Cross-cutting** — unified responses, i18n messages, centralized error handling, rate limiting, Helmet, CORS, file uploads, Winston logging, Swagger UI

---

## 🛠 Tech Stack

| Concern         | Technology                                              |
| --------------- | ------------------------------------------------------- |
| Runtime         | Node.js **24.x**                                        |
| Framework       | Express **5.2.1**                                       |
| ORM             | Prisma **7.7** (`@prisma/adapter-better-sqlite3`)       |
| Raw SQL         | **mysql2** 3.x                                          |
| Validation      | AJV **8.18**                                            |
| Auth / Crypto   | jsonwebtoken **9** + Node `crypto` (AES-256-GCM, HMAC)  |
| Real-time       | Socket.IO **4.8** (server + client)                     |
| Messaging       | MQTT **5.x**                                            |
| Scheduling      | cron **4.4**                                            |
| Uploads         | Multer **2.1**                                          |
| Email           | Nodemailer **8**                                        |
| Logging         | Winston + winston-daily-rotate-file                     |
| Security        | Helmet, CORS, express-rate-limit                        |
| Docs            | swagger-jsdoc + swagger-ui-express                      |
| Templating      | EJS                                                     |
| Testing         | Jest **30**, Supertest **7**                            |
| Load testing    | Artillery (`test.yml`)                                  |
| Process manager | PM2 (`ecosystem.config.js`)                             |

---

## 📁 Project Structure

```
app.js                          # Entry point → src/app/server.js
ecosystem.config.js             # PM2 config
jest.config.js                  # Jest config
prisma.config.ts                # Prisma config
test.yml                        # Artillery load test
prisma/
├── schema.prisma               # datasource (sqlite) + models
├── generated/                  # generated Prisma client (DO NOT EDIT)
├── migrations/                 # Prisma migrations
├── seeder/                     # seeder files
└── script.js                   # seeder create/run runner (npm run migrate)
src/
├── app/
│   ├── server.js               # ApplicationServer: http(s), sockets, mqtt, routes, shutdown
│   ├── router.js               # /health, web routes, /api/v1, /api/v2
│   └── middleware/             # auth, error, rate-limit, request-id, request-logger
├── common/
│   ├── base/                   # base classes (controller, service, model, route, dto,
│   │                           #   schema, resource, middleware, socket, mqtt, worker)
│   ├── errors/app-error.js     # AppError class
│   ├── queries/                # raw SQL (mysql2) e.g. userPermissions.query.js
│   └── utils/                  # ajv, constants, date, helper, i18n, logger, memory,
│                               #   password, performance, response, storage, token, env.validator
├── config/                     # app, event, mqtt, socket, socket-client, swagger
├── infra/
│   ├── database/
│   │   ├── connection.js       # Prisma client (sqlite)
│   │   └── mysql.connection.js # mysql2 pool (raw SQL)
│   ├── integrations/mail/      # Nodemailer service
│   └── realtime/               # mqtt/, socketServer/, socketClient/
├── jobs/
│   ├── cron/                   # demo.cron.js, test.cron.js (not started by default)
│   └── workers/                # fibonacci.worker.js, worker-runner.js
├── language/en/message.js      # i18n message keys
├── modules/                    # vertical-slice features
│   ├── user/                   # routes, controller, service, model, dto, schema, resource
│   ├── demo/                   # public demo/test endpoints
│   └── web/                    # EJS web view(s)
└── swagger/                    # v1/, v2/ route documentation
tests/
├── integration/index.test.js   # supertest API tests
├── unit/cron-jobs.test.js
└── helpers/constants-helpers.js
```

---

## 📋 Prerequisites

- **Node.js** 24.x (see `engines` in `package.json`)
- **npm** 10.x+
- **SQLite** — used by default; the `dev.db` file is created/used automatically
- **MySQL** 8.x — only required if you use the raw `mysql2` query layer (e.g. `user_permissions_view`)
- **MQTT broker** — optional, for messaging features

---

## 🔧 Installation

```bash
git clone <repository-url>
cd Node-Folder
npm install
cp .env.example .env   # then fill in secrets (see Configuration)
```

---

## ⚙️ Configuration

Environment variables are loaded in `src/app/server.js` via `dotenv`, then validated by `src/common/utils/env.validator.js` (the process exits if required vars are missing). Copy `.env.example` to `.env`:

```env
NAME = "Test"
PORT = 3008
ENV = "development"            # development | production | test
HTTPS_ENABLED = false

# Dev options
DEBUG = true
ENABLE_MEMORY_MONITORING = false
REQUEST_LOGGER_ENABLED = true
SWAGGER_ENABLED = true

# CORS
ALLOWED_ORIGINS = "http://localhost:3000,http://localhost:8080"

# Database
DB_TYPE = "sqlite"            # mysql | sqlite
DATABASE_URL = "file:./dev.db"
# DATABASE_URL = "mysql://user:pass@host:3306/db"   # required for mysql2 raw queries

# Tokens (REQUIRED secrets)
algorithm = "aes-256-cbc"
accessTokenKey = ""           # required
refreshTokenKey = ""          # required
AES_SALT = ""                 # required by token.util.js

# Mail
service = 'gmail'
host = 'smtp.gmail.com'
port = 465
secure = true
user = ''
pass = ''

# Upload root
path = "./public"

# MQTT
MQTT_URL = "mqtt://broker.hivemq.com:1883"

# Socket client
SOCKET_CLIENT_URL = "https://easychat.fly.dev"

# Language
default_language = "en"
```

**Required variables** (enforced at startup): `NAME`, `PORT`, `ENV`, `DATABASE_URL`, `algorithm`, `accessTokenKey`, `refreshTokenKey`. Additionally `token.util.js` requires `accessTokenKey`, `refreshTokenKey`, and `AES_SALT`.

> Setting `NODE_APP_ENV=test` disables server start, sockets, MQTT, and cron (used by the test suite).

---

## 🚀 Running the Application

```bash
npm start              # start the API server (node app.js)
npm test               # run Jest (integration + unit)
npm run migrate        # run prisma/script.js (seeder create/run)
npm run load-test      # artillery run test.yml
npm run format         # Prettier write
npm run format:check   # Prettier check
```

Server boots at `http(s)://localhost:<PORT>`. Health check: `GET /health`. Swagger UI (when `SWAGGER_ENABLED=true`): `GET /api-docs`.

---

## 🏛 Architecture

This project uses **vertical-slice modules** under `src/modules/<feature>/`. Each slice splits responsibilities across files, and most export a **singleton instance**:

| File                 | Responsibility                                              | Base class      |
| -------------------- | ---------------------------------------------------------- | --------------- |
| `*.routes.js`        | Express routes + auth/permission middleware wiring         | `BaseRoute`     |
| `*.controller.js`    | HTTP layer: DTO → validate → service → response            | `BaseController` |
| `*.service.js`       | Business logic; orchestrates model + resource              | `BaseService`   |
| `*.model.js`         | Data access config (table, columns, hidden, primaryKey)    | `BaseModel`     |
| `*.dto.js`           | Static request shapers (`createFromRequest`, …)            | `BaseDTO`       |
| `*.schema.js`        | AJV schemas + `validate(data, name)`                       | `BaseSchema`    |
| `*.resource.js`      | Output serialization (`toJSON`)                            | `BaseResource`  |

**Dependency injection** comes in two flavors:

- **Constructor injection** (controllers/services): `super({ inject: ["responseUtil", "appError", ...] })` copies selected util singletons onto `this`.
- **Static injection** (middleware/schema/dto/socket/mqtt/worker): utils are exposed as static/instance properties (`this.response`, `this.token`, `this.ajv`, `this.appError`, …).

`BaseModel` is a Prisma-backed generic repository exposing `get, find, findOne, insert, update, updateWhere, delete, count, paginate`. It sanitizes input against declared `columns`/`hidden` and wraps DB failures as `AppError({ type: "DATABASE_ERROR" })`.

---

## 🔄 Request Lifecycle

Example: `POST /api/v1/user/add`

```
router
  → globalLimiter → userLimiter            (rate limiting)
  → authenticateToken                       (verify custom AES token → req.currentUser)
  → authorize({ user: ["add"] })            (RBAC check on req.currentUser.permissions)
  → UserController.createUser
      → UserRequestDto.createFromRequest(req)        // shape payload
      → userSchema.validate(dto, "userCreate")        // AJV → throw AppError BAD_REQUEST on failure
      → userService.create({ data })                  // hash password, insert
          → userModel.insert(payload)                 // Prisma via BaseModel
          → userResource.toJSON(row)                  // serialize (drops password, etc.)
      → this.responseUtil.send({ req, res, type: "CREATED", data, message: "SUCCESS" })
  → on throw: next(error) → ErrorMiddleware.globalErrorHandler
```

**Responses** are always sent through `ResponseUtil.send({ req, res, type, message, data })`, where `type` maps to an HTTP status + success flag, and `message` is an i18n key from `src/language/en/message.js`.

**Errors** are always thrown as `AppError({ type, message })` and rendered by the global error handler.

---

## ➕ Adding a New Module

1. Create `src/modules/<feature>/` with `model`, `resource`, `dto`, `schema`, `service`, `controller`, `routes` (mirror the `user` module).
2. Add the table to `prisma/schema.prisma` and create a migration; keep `model.columns` in sync.
3. Register the routes in `src/app/router.js` under the correct version.
4. Add Swagger docs under `src/swagger/v1|v2/` if the endpoint is public.
5. Add tests under `tests/integration/`.

See **[AI_RULE.md](AI_RULE.md)** for the full checklist and conventions.

---

## 🗄️ Database

**Primary (Prisma / SQLite):** `src/infra/database/connection.js` creates the Prisma client using the better-sqlite3 adapter and `DATABASE_URL`. Models are declared in `prisma/schema.prisma` and accessed through `BaseModel`.

**Raw SQL (mysql2):** `src/infra/database/mysql.connection.js` exposes a mysql2 pool built from `DATABASE_URL`. Raw queries live in `src/common/queries/*.query.js` and **must** be parameterized:

```js
const pool = require("../../infra/database/mysql.connection");

const [rows] = await pool
  .promise()
  .query("SELECT * FROM user_permissions_view WHERE user_id = ?", [userId]);
```

> The raw layer requires `DATABASE_URL` to point at a real MySQL instance. By default the project runs on SQLite.

**Seeding:**

```bash
# Create a seeder file
npm run migrate -- --seeder_create=seed-users

# Run all seeders, or a specific one
npm run migrate -- --seeder_run
npm run migrate -- --seeder_run=<timestamp>-seed-users
```

---

## 📚 API Reference

Base URL: `http://localhost:<PORT>/api/v1`

Protected endpoints require a Bearer token:

```
Authorization: Bearer <customAccessToken>
```

### Health

```
GET /health        → { status: "ok", uptime, timestamp }   (public)
```

### User (protected + permission-gated)

| Method | Path                 | Permission         | Body                                            |
| ------ | -------------------- | ------------------ | ----------------------------------------------- |
| GET    | `/api/v1/user/get`   | `user:read`        | —                                               |
| POST   | `/api/v1/user/add`   | `user:add`         | `{ name, email, phone, password, status?, notes? }` |
| PUT    | `/api/v1/user/update`| `user:update`      | `{ id, name?, email?, phone?, notes? }`         |
| DELETE | `/api/v1/user/delete`| `user:delete`      | `{ id }`                                        |
| POST   | `/api/v1/user/filter`| `user:read`        | `{ name, page?, limit? }`                       |

### Demo / Public (`/api/v1/public`, some also on `/api/v2/public`)

| Method | Path           | Description                          |
| ------ | -------------- | ------------------------------------ |
| GET    | `/test`        | Emits a socket event, returns version |
| POST   | `/ajv`         | AJV validation demo                  |
| POST   | `/filter`      | Filter schema demo                   |
| POST   | `/token`       | Generate custom/JWT/refresh tokens   |
| POST   | `/tokenCheck`  | Verify the three token types         |
| POST   | `/apiVersion`  | Echo the resolved API version        |
| POST   | `/upload`      | Single-file upload (`reviewProfile`) |

**Standard success response:**

```json
{
  "success": true,
  "code": "CREATED",
  "message": "Resource created successfully",
  "data": { }
}
```

---

## 🔌 Real-time & Messaging

- **Socket.IO server** (`src/infra/realtime/socketServer/server.socket.js`): authenticates each connection using the custom AES token from `socket.handshake.auth.token`, then handles `send` events and bridges the app event bus (`SOCKET_EMIT`).
- **Socket.IO client** (`src/infra/realtime/socketClient/`): connects to `SOCKET_CLIENT_URL`.
- **MQTT** (`src/infra/realtime/mqtt/`): publisher/subscriber wired to `MQTT_URL` and the app event bus.
- **Event bus** (`src/config/event.config.js`): a singleton `EventEmitter` with a registered `EVENTS` map; accessed via `req.app.get("appEvent")`. Emitting/subscribing to unknown events logs a warning.

> Sockets, MQTT, and cron are only initialized when **not** running under `NODE_APP_ENV=test`.

---

## ⏱️ Background Jobs

- **Cron** (`src/jobs/cron/`): `demo.cron.js` and `test.cron.js` are implemented but **not started** by default — see `ApplicationServer.initializeCronJobs()` in `src/app/server.js` (calls are commented out). Enable them there once schedules are finalized.
- **Workers** (`src/jobs/workers/`): worker-thread examples (`fibonacci.worker.js`, `worker-runner.js`) for CPU-bound tasks.

---

## 🔒 Security

- **Authentication:** custom AES-256-GCM token verified by `authenticateToken`; also supports JWT access tokens and HMAC-signed refresh tokens (`src/common/utils/token.util.js`).
- **Authorization (RBAC):** `authorize({ resource: ["action"] })` checks `req.currentUser.permissions`.
- **Passwords:** hashed via `passwordUtil`; never stored or returned in plaintext (hidden in the user model and excluded by the resource).
- **Transport & headers:** Helmet (CSP, HSTS, frameguard, etc.), CORS allowlist via `ALLOWED_ORIGINS`, optional HTTPS.
- **Rate limiting:** global IP limiter + per-user limiter on all `/api/*` routes.
- **Input safety:** AJV validation with `additionalProperties: false`; mysql2 queries are parameterized; uploads validate MIME type + extension and sanitize filenames/paths.
- **Crypto/limit parameters** live in `src/common/utils/constants.js` — do not hardcode elsewhere.

---

## 🧪 Testing

```bash
npm test                 # all tests
npm test -- --coverage   # with coverage
npm test -- --watch      # watch mode
```

Tests use **Jest + Supertest** and exercise the app through its HTTP surface. They set `process.env.NODE_APP_ENV = "test"` before importing `app` so background services stay off. See `tests/integration/index.test.js`.

---

## 📊 Logging & Monitoring

- **Winston** logger (`src/common/utils/logger.util.js`) with daily rotating files in `logs/`. Level via `LOG_LEVEL`.
- **Request logging** (`request-logger.middleware.js`) with per-request IDs (`request-id.middleware.js`), enabled by `REQUEST_LOGGER_ENABLED` and skipping `/health` and `/public`.
- **Memory monitoring** (`memory.util.js`) toggled by `ENABLE_MEMORY_MONITORING`.

---

## 🚀 Deployment

### PM2

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
```

`ecosystem.config.js` configures auto-restart, a 500MB memory restart threshold, graceful shutdown (`kill_timeout`), exponential backoff, and log files under `logs/`.

### Docker (example)

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3008
CMD ["node", "app.js"]
```

The app handles `SIGTERM`/`SIGINT` for graceful shutdown (closes the HTTP server, forces exit after 10s).

---

## 🐛 Troubleshooting

- **Startup exits with "Missing required environment variables"** → fill the required keys in `.env` (see Configuration).
- **`Missing required environment variable: AES_SALT`** → `token.util.js` requires `AES_SALT`; add it to `.env`.
- **mysql2 query errors / connection refused** → `DATABASE_URL` must point at a reachable MySQL instance for the raw query layer; the default SQLite URL won't work for those.
- **Port already in use** → change `PORT`, or free the port (`netstat -ano | findstr :<PORT>` then `taskkill /PID <PID> /F` on Windows).
- **CORS errors** → add the origin to `ALLOWED_ORIGINS`.
- **Module not found after pull** → `rm -rf node_modules package-lock.json && npm install`.

---

## 📄 License

ISC License.
