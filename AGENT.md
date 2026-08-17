## Project Structure & Module Organization

- `src/main.ts` bootstraps NestJS. `src/app.module.ts` is the composition root
  for feature modules, global guards, caching, and infrastructure.
- `src/<feature>/` contains one domain's module, controller, service, and DTOs.
  Keep controllers thin and put business and persistence logic in services.
- `src/auth/` owns JWT cookies, sessions, and role checks. `src/cache/` owns
  HTTP caching and invalidation. `src/database/` exposes the shared Prisma
  client.
- `prisma/schema.prisma` defines the PostgreSQL model and
  `prisma/migrations/` is immutable migration history.
- `filters/` contains the global Prisma exception filter.
- `tests/` is the only test tree. Keep Jest unit, HTTP contract, Supertest API,
  authorization, and Redis tests there; do not add generated specs beside
  production files.
- `Dockerfile` defines the production image. `.env.example` documents
  test-safe variable names. `dist/`, `coverage/`, and `node_modules/` are
  generated and must not be edited.
- `Jenkinsfile` defines the multibranch CI/CD pipeline. `deploy.sh` performs
  the main-branch deployment over SSH and runs Compose from `~/web` on the
  production host.

## Build, Test, and Development Commands

Run commands from `backend/`:

```bash
npm ci
npm run start:dev
npm run build
npm run lint:check
npm run lint:test
npx prettier --check "src/**/*.ts" "tests/**/*.ts"
npm test -- --runInBand
npm run test:cov -- --runInBand
npx prisma validate
```

`npm run lint` and `npm run format` rewrite files; use them intentionally and
review their diffs. `lint:check` and `lint:test` are non-mutating checks.

After relevant JavaScript tests pass, build and smoke-test the Docker image only
when application code or its runtime dependencies changed:

```bash
docker build -t taavoni-backend:verify .
docker run --name taavoni-backend-verify --env-file .env.example -p 3000:3000 taavoni-backend:verify
docker inspect taavoni-backend-verify
```

Use disposable PostgreSQL and Redis containers on a disposable Docker network
when the application requires them. Confirm the application remains running,
becomes healthy, and answers an HTTP smoke request. Remove verification
containers afterward. Documentation-only and test-only changes do not require
an image rebuild.

## Coding Style & Naming Conventions

- Follow TypeScript, ESLint, and Prettier configuration: two-space indentation,
  single quotes, and trailing commas where supported.
- Use `PascalCase` for classes, DTOs, decorators, and exported types;
  `camelCase` for functions, variables, properties, and parameters; and
  `UPPER_SNAKE_CASE` for true constants.
- Use kebab-case feature directories and suffix files with
  `.controller.ts`, `.service.ts`, `.module.ts`, `.guard.ts`, or
  `.spec.ts`.
- Name DTOs by operation, such as `CreateProjectDto` and `UpdateProjectDto`.
- Inject `DatabaseService`; never construct a feature-local Prisma client.
- Validate request data with DTOs and class-validator. Preserve the global
  `/api` prefix, stable response shapes, and authorization behavior.
- Never expose passwords, tokens, cookies, connection strings, or production
  credentials in code, logs, tests, fixtures, or documentation.

## Testing Guidelines

Write backend tests in TypeScript with Jest. Use Nest testing utilities for
controllers and modules, Supertest for HTTP behavior, and Jest mocks for Redis
unit tests.

Use these naming conventions:

- Files: `<feature>.spec.ts` or `<feature>.api.spec.ts`
- Suites: `describe('<Feature>', ...)`
- Cases: `it('does <observable behavior>', ...)`

For every endpoint, keep a named route-contract case that verifies its HTTP
method and complete controller path. The contract suite must fail for duplicate
routes. Add behavioral API tests for changed endpoints; a metadata-only case is
not sufficient for new behavior.

For a new feature, test applicable behavior in this order:

1. Normal successful behavior and expected database changes.
2. Invalid input.
3. Authentication and authorization.
4. Failures from relevant external services, such as Redis.
5. Important edge cases and previously reported bugs.

Only test scenarios relevant to the feature. Do not add Redis tests to a feature
that does not use Redis.

Follow these rules:

- Test observable behavior rather than private implementation details.
- Use a temporary database or disposable PostgreSQL container for integration
  tests; use repository/service mocks for unit and HTTP contract tests.
- Use mocks for Redis in unit and API tests. Use a real disposable Redis
  container only for Redis integration tests.
- Never connect tests to development or production PostgreSQL, Redis, or other
  services, and never assume an existing service is safe to use.
- Keep tests independent, repeatable, and order-independent.
- Test API responses and important resulting state changes.
- Add a regression test whenever fixing a bug.
- Do not change production behavior merely to make a test pass; behavior-
  preserving refactoring for testability is allowed.
- Run the relevant tests and `npm run lint:test` after every change. Run the
  full suite and `npm run lint:check` before completion when feasible.
- Test infrastructure must be reproducible from repository configuration.
- Ask before installing system-wide software or changing shared infrastructure.
- Report passing tests, failures, and important behavior that remains untested.

## Commit & Pull Request Guidelines

Do not commit, push, or open a pull request unless the user requests it.

When asked to commit:

- Begin the subject with `fix:` or `add:`.
- Group files by one logical change and exclude unrelated changes.
- Do not create one commit per file unless the files are independent changes.

When asked to open a pull request:

- Explain each feature or fix separately.
- Include exact test and lint commands with their results.
- Mention known limitations and unresolved failures.

## Completion Criteria

A code-change task is complete when:

1. The requested behavior is implemented.
2. Relevant tests are added or updated.
3. Relevant tests and test lint pass.
4. The full suite and project lint run when feasible.
5. Unrelated or pre-existing failures are clearly reported.
6. No production credentials or production services were used.

In the final report, summarize changes in simple words, provide exact test and
lint commands and results, and mention anything not tested and why. If changes
are ready but unpublished, ask whether the user wants them committed and opened
as a pull request.
