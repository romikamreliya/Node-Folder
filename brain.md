# brain.md

> Single-page working memory for this codebase — merged from [AI_CONTEXT.md](AI_CONTEXT.md) (what the project _is_) and [AI_RULE.md](AI_RULE.md) (how you must _change_ it). Read this first; go to the source files for detail. **Never trust the root [README.md](README.md)** — it describes Knex and a flat folder layout that no longer exist.

---

## 1. What This Is

A Node.js REST API platform on **Express 5**, layered vertical-slice MVC. CommonJS only (`require` / `module.exports`) — no `import`/`export`, no `.mjs`, no TypeScript at runtime (`prisma.config.ts` is the sole exception). Node `24.x`. ES2022+ classes and `async/await`, 2-space indent, double quotes, semicolons, Prettier-formatted.

Entry: [app.js](app.js) → [src/app/server.js](src/app/server.js) → [src/app/router.js](src/app/router.js).

Stack: Prisma ^7 (SQLite via better-sqlite3 adapter) with a **mysql2** raw-SQL escape hatch, AJV 8.18 validation, JWT + AES-256-GCM custom tokens with RBAC, Socket.IO, MQTT, cron + worker threads, Winston logging, helmet/cors/rate-limit, Swagger, Jest + supertest.

---

## 2. The Golden Rules

1. **Mirror the `user` module** ([src/modules/user/](src/modules/user/)) — it is the reference implementation. Copy its structure; don't invent layering.
2. **No magic values.** Add them to [constants.js](src/common/utils/constants.js), reference `Constants.*`.
3. **Every response goes through `ResponseUtil.send`.** Never `res.json` / `res.status().send` in feature code.
4. **Every error is an `AppError`.** Throw `new this.appError({ type, message })` and let `next(error)` reach the global handler.
5. **Validate every external input with AJV** before it reaches the service layer.
6. When a rule and the surrounding code disagree, **match the surrounding code and flag the conflict**. If you must deviate, say why in your summary and keep it local.

---

## 3. Layout & Naming

```
app.js · prisma/ (schema, generated/, migrations/, seeder/, script.js)
src/
  app/       server.js · router.js · middleware/ (auth, error, rate-limit, request-id, request-logger)
  common/    base/ · errors/app-error.js · queries/*.query.js · utils/*.util.js
  config/    class-based singletons (app, event, mqtt, socket, socket-client, swagger)
  infra/     database/ (connection.js = Prisma, mysql.connection.js = mysql2 pool)
             integrations/mail/ · realtime/ (mqtt, socketServer, socketClient)
  jobs/      cron/ (NOT started) · workers/
  language/  en/message.js — i18n keys
  modules/   user/ demo/ web/  ← vertical slices
  swagger/   v1/ v2/
tests/       integration/ · unit/ · helpers/
```

- Module files: `src/modules/<feature>/<feature>.<role>.js`, role ∈ `routes, controller, service, model, dto, schema, resource`.
- Utils `src/common/utils/<name>.util.js` · base classes `src/common/base/base-<name>.js` · raw SQL `src/common/queries/<name>.query.js`. Kebab-case multi-word names.
- Classes `PascalCase` · methods/vars `camelCase` · constants keys `camelCase` · **DB columns `snake_case`**.
- **Exports:** controllers/services/models/routes/resources → **singleton instance** (`module.exports = new XService()`). DTOs/schemas → **the class** (static only). Base classes + `AppError` → the class.

---

## 4. Request Lifecycle

```
router → authenticateToken → authorize({ user: ["add"] })
  → controller.createUser
      → UserRequestDto.createFromRequest(req)      // shape payload
      → userSchema.validate(dto, "userCreate")     // AJV → throw AppError BAD_REQUEST
      → userService.create({ data })               // business logic
          → userModel.insert(payload)              // Prisma via BaseModel
          → userResource.toJSON(row)               // serialize, drops password
      → this.responseUtil.send({ req, res, type: "CREATED", data, message: "SUCCESS" })
  → on throw: next(error) → ErrorMiddleware.globalErrorHandler
```

---

## 5. New Feature Module — Required Steps

Create `src/modules/<feature>/` with all seven files, then wire it up:

| # | File | Extends | Must do |
|---|------|---------|---------|
| 1 | `<feature>.model.js` | `BaseModel` | `super({ table, columns, hidden, primaryKey, limit })`; add table to [schema.prisma](prisma/schema.prisma) + migrate |
| 2 | `<feature>.resource.js` | `BaseResource` | `toJSON(row)` returning only safe/public fields |
| 3 | `<feature>.dto.js` | `BaseDTO` | static `createFromRequest(req)` etc.; `this.extractPagination(body)` for lists |
| 4 | `<feature>.schema.js` | `BaseSchema` | `static columns`, one `*Schema()` per op, register in `static allSchemas`, use `validate(data, name)` |
| 5 | `<feature>.service.js` | `BaseService` | `super({ inject: [...] })`; business logic only; throw `AppError` for not-found/conflict |
| 6 | `<feature>.controller.js` | `BaseController` | `super({ inject: [...] })`; per handler `try { DTO → validate → service → responseUtil.send } catch (e) { next(e) }` |
| 7 | `<feature>.routes.js` | `BaseRoute` | `registerRoutes()`; router via `this.version("v1")`; auth/permission middleware; `this.bindHandler(controller.method, controller)` |

Then: **register** in [router.js](src/app/router.js) under `getRoutesV1`/`getRoutesV2` → **Swagger docs** in `src/swagger/v1|v2/` if public → **tests** in `tests/integration/`.

---

## 6. Dependency Injection — Two Styles

**Constructor injection — controllers & services.** `super({ inject: [...] })` copies util singletons onto `this`. Registry keys: `ajvUtil, constants, dateUtil, helperUtil, i18nUtil, loggerUtil, responseUtil, tokenUtil, appError, storageUtil` (+ `passwordUtil` in services). Omitting `inject` injects everything.

```js
class UserController extends BaseController {
  constructor() { super({ inject: ["responseUtil", "ajvUtil", "appError"] }); }
}
```

> **Only list keys you use, and only use keys you listed.** Don't reference `this.helper` if you didn't inject `helperUtil` — some demo code gets this wrong; don't copy its wiring.

**Static injection — middleware, schema, DTO, socket, mqtt, worker.** Use the statically-attached utils (`this.response`, `this.token`, `this.appError`, `this.ajv`). Middleware handler methods must be `static` and bound at registration (`this.bindHandler(fn, ctx)` / `fn.bind(ctx)`) — unbound statics lose `this`.

Don't `require` util singletons directly when the base registry provides them.

---

## 7. Persistence

- **Default to Prisma via `BaseModel`** ([base-model.js](src/common/base/base-model.js)): `get, find, findOne, insert, update, updateWhere, delete, count, paginate`. It `clean()`s input against `columns`+`hidden` and wraps errors as `AppError({ type: "DATABASE_ERROR" })`. Don't touch the Prisma client directly from services unless `BaseModel` can't express the query.
- ⚠️ **Only list real columns** in `columns`/`hidden` — `clean()` silently drops anything unlisted, so a typo means **silent data loss**. Sensitive fields (e.g. `password`) go in `hidden` and never appear in a resource `toJSON`.
- **Raw SQL** lives in `src/common/queries/*.query.js` on the mysql2 pool ([mysql.connection.js](src/infra/database/mysql.connection.js)). Always parameterize — `this.db.promise().query("... WHERE x = ?", [value])` — **never** concatenate user input. Destructure rows: `const [rows] = await ...`. Keep a `format()` step mapping `snake_case` → `camelCase`.
- **Pagination:** `BaseModel.paginate(...)` + `BaseResource.paginate(...)`. Respect `Constants.defaultPageLimit` / `Constants.maxPageLimit`.
- **Schema changes:** edit [schema.prisma](prisma/schema.prisma) → create migration → update `model.columns`. **Never hand-edit `prisma/generated/`.**

---

## 8. Validation

- Define fields with `this.ajv.prop(type, options)`; compile via the schema class's `validate(data, schemaName)` → `{ isValid, errors, validate }`.
- In controllers:
  ```js
  const v = featureSchema.validate(dto, "<name>");
  if (!v.isValid) throw new this.appError({ type: "BAD_REQUEST", message: this.ajvUtil.errorMsg({ error: v.errors[0] }) });
  ```
- Reuse custom formats: `customEmail, customPhone, customWebsite, customDate, customTime` — don't re-implement the regex.
- `additionalProperties: false` is the default — declare every accepted field explicitly.

---

## 9. Responses & Errors

- **Success:** `this.responseUtil.send({ req, res, type: "SUCCESS"|"CREATED"|"UPDATE"|"DELETE", data, message: "SUCCESS" })`.
- **Failure:** `throw new this.appError({ type, message })` where `type` is a valid `RES_CODES` key (SUCCESS, CREATED, UPDATE, DELETE, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, TOO_MANY_REQUESTS, INTERNAL_SERVER_ERROR, DATABASE_ERROR, …). The global handler formats it.
- `message` must be a **key** in [message.js](src/language/en/message.js) — add new copy there, avoid duplicate keys. No raw English where a key is expected (except existing humanized validation text).
- Never send two responses for one request. Never `res.json` inside a `catch` — use `next(error)`.

---

## 10. Auth & Security

- Protected routes sit behind `authMiddleware.authenticateToken` and, where applicable, `authMiddleware.authorize({ resource: ["action"] })`.
- Auth is a **custom AES-256-GCM token** (`tokenUtil.verifyCustomToken`), Bearer in `Authorization`. Read the user from `req.currentUser` — never re-parse the token in feature code.
- Hash passwords with the injected `passwordUtil` before persisting; never store or return plaintext or hashes.
- Crypto params live in `Constants.token` / `Constants.password`. New secrets must be added to [env.validator.js](src/common/utils/env.validator.js) and `.env.example`.
- **Never log** secrets, tokens, passwords, or full bodies containing credentials.
- Don't loosen helmet, the cors allowlist, or the rate limiters.

---

## 11. Config & Env

- New tunables → [constants.js](src/common/utils/constants.js) (grouped by concern) or `.env` for deploy-specific/secret values. New required env vars → [env.validator.js](src/common/utils/env.validator.js) **and** `.env.example`.
- Read env only at config/bootstrap boundaries where existing code does; feature code reads `Constants`.
- Required vars: `NAME, PORT, ENV, DATABASE_URL, algorithm, accessTokenKey, refreshTokenKey`. `token.util.js` also hard-requires `AES_SALT` at load.
- Flags: `HTTPS_ENABLED, SWAGGER_ENABLED, REQUEST_LOGGER_ENABLED, ALLOWED_ORIGINS, ENABLE_MEMORY_MONITORING, DB_TYPE, DEBUG, LOG_LEVEL`.
- **`NODE_APP_ENV=test` must keep realtime/MQTT/cron disabled** — follow the guards in [server.js](src/app/server.js).

---

## 12. Commands

```bash
npm start            # node app.js
npm test             # jest (integration via supertest + unit)
npm run migrate      # node prisma/script.js  (--seeder_create= / --seeder_run[=name])
npm run load-test    # artillery run test.yml
npm run format       # prettier --write
npm run format:check # prettier --check
pm2 start ecosystem.config.js
```

---

## 13. Testing

- `tests/` with `jest` + `supertest`. Set `process.env.NODE_APP_ENV = "test"` **before** importing the app.
- Test through the public HTTP surface where possible ([index.test.js](tests/integration/index.test.js)); assert on `statusCode`, `body.success`, `body.data` shape.
- Run `npm test` before declaring a change complete. **If tests fail, report the failure output honestly — do not claim success.**

---

## 14. Traps & Known Gaps

- Root [README.md](README.md) is stale (Knex, flat folders) — ignore it for architecture.
- Cron jobs exist but `server.initializeCronJobs()` leaves them commented out — they are **not started**.
- [message.js](src/language/en/message.js) has duplicate keys (`NOT_FOUND`, `TOKEN_MISSING`) — later definitions win.
- Demo code references uninjected utils (e.g. `this.helper`). Verify injected keys rather than copying.
- `prisma/generated/` is committed but generated — never hand-edit.
- `.env` sets `DB_TYPE="sqlite"` with a `file:` `DATABASE_URL`; the MySQL URL is commented out, so **mysql2 raw queries need `DATABASE_URL` pointed at a real MySQL instance**.

---

## 15. Before You Finish

- [ ] `npm run format` run, `npm run format:check` clean.
- [ ] Comment density/style matches surrounding files (`// ─── X ───` banners in utils/constants).
- [ ] Changes scoped — no unrelated refactors in a feature PR.
- [ ] **No commits, pushes, branches, or PRs unless explicitly asked.**
- [ ] Any rule deviation stated in the summary and kept localized.
