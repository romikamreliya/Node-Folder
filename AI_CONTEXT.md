# AI_CONTEXT.md

> Machine-oriented project context for AI assistants. Describes **what this project is** and **how it is actually built** (verified against source, not the README — the root `README.md` is outdated and references Knex/old layout that no longer exist). For the rules you must follow when changing code, see [AI_RULE.md](AI_RULE.md).

---

## 1. Project Overview

A production-oriented **Node.js REST API platform** built on Express 5. It bundles a layered MVC-style architecture, JWT/AES authentication with RBAC, request validation (AJV), database access via Prisma (with an escape hatch to raw mysql2), real-time channels (Socket.IO server + client), IoT messaging (MQTT), background jobs (cron + worker threads), i18n responses, structured logging (Winston), rate limiting, and Swagger docs.

- **Entry point:** [app.js](app.js) → [src/app/server.js](src/app/server.js)
- **Runtime:** Node.js `24.x` (see [package.json](package.json) `engines`)
- **Module system:** CommonJS (`require` / `module.exports`). No TypeScript at runtime; `.ts` exists only for `prisma.config.ts`.
- **Language/style:** ES2022+ JS, classes, `async/await`, 2-space indent, double-quoted strings, semicolons. Formatted with Prettier.

---

## 2. Tech Stack (verified from package.json)

| Concern         | Library                                   |
| --------------- | ----------------------------------------- |
| HTTP framework  | `express` ^5.2.1                          |
| ORM             | `@prisma/client` / `prisma` ^7.7.0 with `@prisma/adapter-better-sqlite3` |
| Raw SQL         | `mysql2` ^3.22.5 (also legacy `mysql`)    |
| Validation      | `ajv` 8.18.0                              |
| Auth            | `jsonwebtoken` ^9 + Node `crypto` (AES-256-GCM, HMAC) |
| Realtime        | `socket.io` + `socket.io-client` ^4.8.3   |
| Messaging       | `mqtt` ^5.15.1                            |
| Scheduling      | `cron` 4.4.0                              |
| Uploads         | `multer` 2.1.1                            |
| Email           | `nodemailer` 8.0.5                        |
| Logging         | `winston` + `winston-daily-rotate-file`   |
| Security        | `helmet`, `cors`, `express-rate-limit`    |
| Docs            | `swagger-jsdoc`, `swagger-ui-express`     |
| Templating      | `ejs`                                     |
| Test            | `jest` ^30, `supertest` ^7               |
| Load test       | `artillery` (`test.yml`)                  |
| Process mgr     | PM2 (`ecosystem.config.js`)               |

> ⚠️ The root `README.md` claims Knex.js and a flat `controllers/ models/ services/` layout. **That is stale.** The real persistence layer is Prisma, and code is organized as vertical-slice modules. Trust the source tree and this file.

---

## 3. Directory Structure (actual)

```
app.js                         # bootstraps ApplicationServer
prisma.config.ts               # Prisma config
prisma/
  schema.prisma                # datasource = sqlite, generator output ./generated
  generated/                   # generated Prisma client (do not edit)
  migrations/                  # prisma migrations
  seeder/                      # seeder files run by prisma/script.js
  script.js                    # custom seeder create/run runner (npm run migrate)
src/
  app/
    server.js                  # ApplicationServer: http(s), socket, mqtt, routes, shutdown
    router.js                  # AppRouter: /health, web routes, /api/v1, /api/v2
    middleware/
      auth.middleware.js       # authenticateToken + authorize(permissions) RBAC
      error.middleware.js      # global error handler
      rate-limit.middleware.js # global + per-user limiters
      request-id.middleware.js
      request-logger.middleware.js
  common/
    base/                      # base classes every module extends (see §5)
      base-controller.js  base-service.js  base-model.js  base-route.js
      base-dto.js  base-schema.js  base-resource.js  base-middleware.js
      base-socket.js  base-mqtt.js  base-worker.js
    errors/app-error.js        # AppError(type, message, statusCode, code, context)
    queries/                   # raw SQL queries (mysql2) e.g. userPermissions.query.js
    utils/                     # ajv, constants, date, helper, i18n, logger, memory,
                               # password, performance, response, storage, token, env.validator
  config/                      # app, event, mqtt, socket, socket-client, swagger config
  infra/
    database/
      connection.js            # Prisma client (sqlite via better-sqlite3 adapter)
      mysql.connection.js      # mysql2 callback pool for raw queries
    integrations/mail/mail.service.js
    realtime/
      mqtt/{publisher,subscriber}.mqtt.js
      socketServer/server.socket.js
      socketClient/client.socket.js
  jobs/
    cron/{demo,test}.cron.js   # currently NOT started (see server.initializeCronJobs)
    workers/{fibonacci.worker.js, worker-runner.js}
  language/en/message.js       # i18n message keys
  modules/                     # vertical-slice feature modules (see §4)
    user/  demo/  web/
  swagger/v1, v2/              # swagger route doc definitions
tests/
  integration/index.test.js    # supertest API tests
  unit/cron-jobs.test.js
  helpers/constants-helpers.js
```

---

## 4. Module Pattern (vertical slices)

Each feature lives under `src/modules/<name>/` and is split by responsibility. The `user` module is the reference implementation:

| File                  | Role | Extends | Export |
| --------------------- | ---- | ------- | ------ |
| `user.routes.js`      | Defines Express routes, attaches auth + permission middleware | `BaseRoute` | singleton instance |
| `user.controller.js`  | HTTP layer: transform req → DTO, validate, call service, send response | `BaseController` | singleton instance |
| `user.service.js`     | Business logic, orchestrates model + resource | `BaseService` | singleton instance |
| `user.model.js`       | Data access config (table, columns, hidden, primaryKey, limit) | `BaseModel` | singleton instance |
| `user.dto.js`         | Static `*FromRequest(req)` payload shapers | `BaseDTO` | class (static methods) |
| `user.schema.js`      | AJV schema definitions + `validate(data, schemaName)` | `BaseSchema` | class (static) |
| `user.resource.js`    | `toJSON(row)` output transformer / serializer | `BaseResource` | singleton instance |

**Request lifecycle (e.g. POST /api/v1/user/add):**
```
router → authenticateToken → authorize({user:["add"]})
  → controller.createUser
      → UserRequestDto.createFromRequest(req)        // shape payload
      → userSchema.validate(dto, "userCreate")        // AJV; throw AppError BAD_REQUEST on fail
      → userService.create({ data })                  // hash password, insert
          → userModel.insert(payload)                 // Prisma via BaseModel
          → userResource.toJSON(row)                  // serialize (drops password etc.)
      → this.responseUtil.send({ req,res,type:"CREATED",data,message:"SUCCESS" })
  → on throw: next(error) → ErrorMiddleware.globalErrorHandler
```

---

## 5. Base Classes & Dependency Injection

Two DI styles coexist:

1. **Instance injection (constructor) — controllers & services.**
   `BaseController` / `BaseService` have a `REGISTRY` of util singletons. The subclass constructor calls `super({ inject: [...] })` to copy selected utils onto `this`.
   ```js
   class UserController extends BaseController {
     constructor() { super({ inject: ["responseUtil", "ajvUtil", "appError"] }); }
   }
   // → this.responseUtil, this.ajvUtil, this.appError available
   ```
   Omitting `inject` injects everything in the registry. Registry keys: `ajvUtil, constants, dateUtil, helperUtil, i18nUtil, loggerUtil, responseUtil, tokenUtil, appError, storageUtil` (+ `passwordUtil` in services).

2. **Static injection — middleware, schema, DTO, socket, mqtt, worker.**
   `BaseMiddleware`, `BaseSchema`, `BaseDTO`, `BaseSocket`, `BaseMqtt`, `BaseWorker` expose utils as static/instance properties (e.g. `this.response`, `this.token`, `this.appError`, `this.ajv`). Middleware methods are **static** and bound via `bindHandler` / `.bind()` when registered.

**`BaseModel`** ([src/common/base/base-model.js](src/common/base/base-model.js)) is a Prisma-backed generic repository. Configured per model via constructor `{ table, columns, hidden, primaryKey, limit }`. Provides: `get, find, findOne, insert, update, updateWhere, delete, count, paginate`. It `clean()`s/`sanitize()`s input against `columns`+`hidden` and wraps all errors as `AppError({type:"DATABASE_ERROR"})`. `paginate()` caps limit at `Constants.maxPageLimit` and uses `$transaction` for data+count.

**`BaseResource`** provides `collection(data, formatter)` and `paginate({items, pageInfo, transform})` for consistent output shaping.

---

## 6. Persistence

- **Primary:** Prisma client in [src/infra/database/connection.js](src/infra/database/connection.js). Datasource is **SQLite** (`dev.db`) via `@prisma/adapter-better-sqlite3`, URL from `DATABASE_URL`. Schema in [prisma/schema.prisma](prisma/schema.prisma) (currently one `User` model). All standard CRUD flows through `BaseModel` → Prisma.
- **Raw SQL escape hatch:** [src/infra/database/mysql.connection.js](src/infra/database/mysql.connection.js) is a **mysql2 callback pool** built from `DATABASE_URL`. Raw queries live in `src/common/queries/*.query.js` and call `this.db.promise().query("... ?", [params])`. Example: [userPermissions.query.js](src/common/queries/userPermissions.query.js) reads `user_permissions_view`.
- **Note:** `.env` currently sets `DB_TYPE="sqlite"` and a `file:` `DATABASE_URL`; the MySQL URL is commented. mysql2 raw queries require `DATABASE_URL` to point at a real MySQL instance.
- **Seeding/migration:** `npm run migrate` runs [prisma/script.js](prisma/script.js) (custom `--seeder_create=` / `--seeder_run[=name]` flags). Prisma migrations under `prisma/migrations/`.

---

## 7. Cross-Cutting Concerns

- **Responses:** Always via `ResponseUtil.send({ req, res, type, message, data })` ([response.util.js](src/common/utils/response.util.js)). `type` is a key in `RES_CODES` (SUCCESS, CREATED, UPDATE, DELETE, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, TOO_MANY_REQUESTS, INTERNAL_SERVER_ERROR, DATABASE_ERROR, …) mapping to status + success flag. `message` is an i18n key resolved via `i18n.t` against [language/en/message.js](src/language/en/message.js). 204 → empty body.
- **Errors:** Throw `new AppError({ type, message })` (constructed via injected `this.appError`). Controllers wrap logic in `try/catch` and call `next(error)`. [ErrorMiddleware.globalErrorHandler](src/app/middleware/error.middleware.js) renders `AppError` via `ResponseUtil.send`; unknown errors are logged and returned as `INTERNAL_SERVER_ERROR`.
- **Validation:** AJV via [ajv.util.js](src/common/utils/ajv.util.js). Build field specs with `ajv.prop(type, options)`; compile with `ajv.ajvCheck(fields, options)`. Custom formats: `customEmail, customPhone, customWebsite, customDate, customTime`. Schemas defined as static methods on `*.schema.js` and exposed through `allSchemas` + `validate(data, name)` returning `{ isValid, errors, validate }`. Error messages humanized via `ajvUtil.errorMsg({ error })`.
- **Auth:** Bearer token in `Authorization` header. `authenticateToken` verifies a **custom AES-256-GCM token** (`tokenUtil.verifyCustomToken`) and sets `req.currentUser`. `authorize(permissions)` checks `req.currentUser.permissions` against a `{ resource: ["action"] }` map. Token utilities (JWT access, AES custom, HMAC refresh) in [token.util.js](src/common/utils/token.util.js); constants in `Constants.token`.
- **Routing & versioning:** [router.js](src/app/router.js) mounts `/api/v1` and `/api/v2`, each behind `globalLimiter` + `userLimiter`. Modules expose `getRoutes(version)` from `BaseRoute`; controllers/middleware are bound with `bindHandler(fn, ctx)`. `/health` is public (no auth, no limit).
- **Config:** All config is class-based singletons under `src/config/`. Env is loaded once in `server.js` via `dotenv`, then validated by [env.validator.js](src/common/utils/env.validator.js) (exits if required vars missing). Magic numbers live in [constants.js](src/common/utils/constants.js) — **do not hardcode**.
- **Events:** App-wide `EventEmitter` singleton in [event.config.js](src/config/event.config.js) with a registered `EVENTS` map (`SOCKET_EMIT`, `SOCKET_CLIENT_EMIT`); emitting/subscribing unknown events warns. Accessed via `req.app.get("appEvent")`.
- **Realtime/MQTT:** Initialized in `server.js` only when **not** in test env. Socket server authenticates connections with the custom token. Handlers extend `BaseSocket` / `BaseMqtt`.

---

## 8. Configuration & Environment

- `.env` (loaded in `server.js`); `.env.example` is the template.
- Required (enforced by [env.validator.js](src/common/utils/env.validator.js)): `NAME, PORT, ENV, DATABASE_URL, algorithm, accessTokenKey, refreshTokenKey`.
- `token.util.js` additionally hard-requires `accessTokenKey, refreshTokenKey, AES_SALT` at load.
- Notable flags: `HTTPS_ENABLED, SWAGGER_ENABLED, REQUEST_LOGGER_ENABLED, ALLOWED_ORIGINS, ENABLE_MEMORY_MONITORING, DB_TYPE, DEBUG, LOG_LEVEL`, plus mail/MQTT/socket-client URLs.
- `NODE_APP_ENV=test` disables server start, sockets, MQTT, and cron (used by Jest/supertest).

---

## 9. Build / Run / Test

```bash
npm start            # node app.js (starts ApplicationServer unless NODE_APP_ENV=test)
npm test             # jest (integration via supertest + unit)
npm run migrate      # node prisma/script.js (seeder create/run)
npm run load-test    # artillery run test.yml
npm run format       # prettier --write (app.js, configs, src/**, tests/**)
npm run format:check # prettier --check
pm2 start ecosystem.config.js   # production process management
```

Tests set `process.env.NODE_APP_ENV = "test"` before importing the app and exercise it through `supertest` against the exported `app`.

---

## 10. Known Gaps / Cautions

- Root `README.md` is outdated (Knex, flat folders, old filenames) — ignore for architecture; trust source + this file.
- Cron jobs exist but `server.initializeCronJobs()` leaves them commented out (not started).
- `message.js` has duplicate keys (e.g. `NOT_FOUND`, `TOKEN_MISSING`) — later definitions win.
- Some demo code references utils not present on the injected instance (e.g. `this.helper` in a controller that didn't inject `helperUtil`). Don't copy demo wiring blindly; verify injected keys.
- Prisma client output is committed under `prisma/generated/` — treat as generated, never hand-edit.
