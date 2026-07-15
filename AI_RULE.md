# AI_RULE.md

> Mandatory rules for any AI/developer changing this codebase. Read [AI_CONTEXT.md](AI_CONTEXT.md) first for architecture. These rules encode the conventions already present in the source. **Follow existing patterns over personal preference.** When a rule and the surrounding code disagree, match the surrounding code and flag the conflict.

---

## 0. Golden Rules

1. **Mirror the existing pattern.** Before writing a new feature, copy the structure of the `user` module ([src/modules/user/](src/modules/user/)). Do not invent new layering.
2. **CommonJS only.** Use `require` / `module.exports`. No `import`/`export`, no `.mjs`, no TypeScript runtime files.
3. **Never hardcode magic values.** Add them to [src/common/utils/constants.js](src/common/utils/constants.js) and reference `Constants.*`.
4. **All responses go through `ResponseUtil.send`.** Never call `res.json` / `res.status().send` directly in feature code.
5. **All errors are `AppError`.** Throw `new this.appError({ type, message })`; let `next(error)` reach the global handler. Never send error responses ad-hoc from controllers.
6. **Validate every external input with AJV** before it reaches the service layer.
7. **Don't trust the root `README.md`** for architecture (it's stale — no Knex, no flat folders here).

---

## 1. File & Naming Conventions

- Module files: `src/modules/<feature>/<feature>.<role>.js` where role ∈ `routes, controller, service, model, dto, schema, resource`.
- Utilities: `src/common/utils/<name>.util.js`. Base classes: `src/common/base/base-<name>.js`. Raw queries: `src/common/queries/<name>.query.js`. Kebab-case for multi-word file names.
- Classes: `PascalCase`. Methods/variables: `camelCase`. Constants object keys: `camelCase`. DB columns: `snake_case` (e.g. `user_id`, `created_at`).
- Exports:
  - Controllers, services, models, routes, resources → **export a singleton instance** (`module.exports = new XService();`).
  - DTOs and Schemas → **export the class** (static methods only).
  - Base classes, `AppError` → export the class.
- Indentation 2 spaces, double quotes, semicolons, trailing commas where Prettier adds them. Run `npm run format` before finishing.

---

## 2. Adding a New Feature Module (required steps)

Create `src/modules/<feature>/` with, at minimum:

1. **`<feature>.model.js`** — `extends BaseModel`, `super({ table, columns, hidden, primaryKey, limit })`. Export instance. Add the table to [prisma/schema.prisma](prisma/schema.prisma) and migrate.
2. **`<feature>.resource.js`** — `extends BaseResource`, implement `toJSON(row)` returning only safe/public fields. Export instance.
3. **`<feature>.dto.js`** — `extends BaseDTO`, static `createFromRequest(req)` / `updateFromRequest(req)` / etc. that shape and lightly normalize `req.body`. Use `this.extractPagination(body)` for list endpoints. Export class.
4. **`<feature>.schema.js`** — `extends BaseSchema`. Define `static columns`, one static `*Schema()` per operation, register them in `static allSchemas`, and rely on the `validate(data, name)` pattern. Export class.
5. **`<feature>.service.js`** — `extends BaseService`, `super({ inject: [...] })`. Business logic only; call the model and resource. Throw `AppError` for not-found/conflict. Export instance.
6. **`<feature>.controller.js`** — `extends BaseController`, `super({ inject: [...] })`. Per handler: `try { DTO → validate → service → responseUtil.send } catch (e) { next(e) }`. Export instance.
7. **`<feature>.routes.js`** — `extends BaseRoute`. Implement `registerRoutes()`; get a router via `this.version("v1")`; attach auth/permission middleware; register handlers with `this.bindHandler(controller.method, controller)`. Export instance.
8. **Register** the module in [src/app/router.js](src/app/router.js) under the correct version (`getRoutesV1` / `getRoutesV2`).
9. **Add Swagger docs** under `src/swagger/v1|v2/` if the endpoint is public/documented.
10. **Add tests** in `tests/integration/`.

---

## 3. Dependency Injection Rules

- **Controllers/Services:** acquire utils only through `super({ inject: [...] })`. Reference them as `this.<key>` (e.g. `this.responseUtil`, `this.appError`, `this.passwordUtil`). **Only list keys you use**, and **only use keys you listed** — do not reference `this.helper` if you didn't inject `helperUtil`.
- **Middleware/Schema/DTO/Socket/Mqtt/Worker:** use the statically-attached utils (`this.response`, `this.token`, `this.appError`, `this.ajv`, etc.). Middleware handler methods must be `static`.
- Do **not** `require` util singletons directly inside a controller/service when the base registry already provides them — use injection for consistency and testability.
- When registering middleware/handlers on a router, bind context: `this.bindHandler(fn, ctx)` or `fn.bind(ctx)`. Unbound static methods lose `this`.

---

## 4. Persistence Rules

- **Default to Prisma via `BaseModel`.** Use `get/find/findOne/insert/update/updateWhere/delete/count/paginate`. Don't call the Prisma client directly from services unless `BaseModel` cannot express the query.
- **Only list real columns** in the model's `columns`/`hidden` arrays — `BaseModel.clean()` silently drops anything not listed, so a typo means silent data loss. Put sensitive fields (e.g. `password`) in `hidden` and never return them from a resource `toJSON`.
- **Raw SQL** belongs in `src/common/queries/*.query.js` using the **mysql2** pool ([mysql.connection.js](src/infra/database/mysql.connection.js)):
  - Always parameterize: `this.db.promise().query("... WHERE x = ?", [value])`. **Never** string-concatenate user input into SQL.
  - Destructure rows: `const [rows] = await this.db.promise().query(...)`.
  - Keep a `format()`/transform step to map `snake_case` rows → `camelCase` output.
- **Pagination:** go through `BaseModel.paginate(...)` and shape the result with `BaseResource.paginate(...)`. Respect `Constants.defaultPageLimit` / `Constants.maxPageLimit`.
- **Schema changes:** edit [prisma/schema.prisma](prisma/schema.prisma) → create a migration → update the corresponding `model.columns`. Never edit `prisma/generated/` by hand.

---

## 5. Validation Rules

- Define fields with `this.ajv.prop(type, options)` and compile via the schema class's `validate(data, schemaName)`.
- In controllers: `const v = <feature>Schema.validate(dto, "<name>"); if (!v.isValid) throw new this.appError({ type: "BAD_REQUEST", message: this.ajvUtil.errorMsg({ error: v.errors[0] }) });`
- Reuse the custom formats (`customEmail`, `customPhone`, `customWebsite`, `customDate`, `customTime`) rather than re-implementing regex.
- Keep `additionalProperties:false` behavior (it's the default in `schemaGenerator`) — declare every accepted field explicitly.

---

## 6. Response & Error Rules

- Success: `this.responseUtil.send({ req, res, type: "SUCCESS"|"CREATED"|"UPDATE"|"DELETE", data, message: "SUCCESS" })`.
- Failure: throw `new this.appError({ type, message })` where `type` is a valid `RES_CODES` key. Let the global handler format it.
- `message` must be a **key** in [src/language/en/message.js](src/language/en/message.js). If you need new copy, add the key there (avoid duplicate keys). Do not put raw English strings as the `message` where a key is expected, except where existing code already passes humanized validation text.
- Never send two responses for one request; never `res.json` inside a `catch` — use `next(error)`.

---

## 7. Auth & Security Rules

- Protected routes must sit behind `authMiddleware.authenticateToken` and, where applicable, `authMiddleware.authorize({ resource: ["action"] })`.
- Read the authenticated user from `req.currentUser`; never re-parse the token in feature code.
- Hash passwords with the injected `passwordUtil` before persisting; never store or return plaintext or hashes.
- Keep all crypto parameters in `Constants.token` / `Constants.password`. Don't introduce new secrets without adding them to `env.validator` required vars.
- Never log secrets, tokens, passwords, or full request bodies containing credentials.
- Preserve existing security middleware (helmet, cors allowlist, rate limiters) — don't loosen them casually.

---

## 8. Config & Constants Rules

- New tunables → [constants.js](src/common/utils/constants.js) (grouped by concern) or `.env` (for deploy-specific/secret values). Add new required env vars to [env.validator.js](src/common/utils/env.validator.js) and to `.env.example`.
- Access env only at config/bootstrap boundaries where the existing code does; prefer reading from `Constants` in feature code.
- Realtime/MQTT/cron must remain disabled under `NODE_APP_ENV=test` (follow the guards in [server.js](src/app/server.js)).

---

## 9. Testing Rules

- Add/extend tests in `tests/` using `jest` + `supertest`. Set `process.env.NODE_APP_ENV = "test"` **before** importing the app.
- Test through the public HTTP surface where possible (see [tests/integration/index.test.js](tests/integration/index.test.js)); assert on `statusCode`, `body.success`, and `body.data` shape.
- Run `npm test` before declaring a change complete. If tests fail, report the failure output honestly — do not claim success.

---

## 10. Workflow & Hygiene

- Run `npm run format` (Prettier) before finishing; keep `npm run format:check` clean.
- Match the comment density and style of surrounding files (section-banner comments like `// ─── X ───` are used in utils/constants).
- Keep changes scoped; do not refactor unrelated modules in a feature PR.
- Do not commit, push, or create branches/PRs unless explicitly asked. Follow [AI_CONTEXT.md](AI_CONTEXT.md) §10 cautions.
- If you must deviate from these rules, state why in your summary and keep the deviation localized.
