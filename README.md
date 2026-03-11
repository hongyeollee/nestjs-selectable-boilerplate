# Nest Flex Schematics

An interactive Nest schematics package for generating a selectable NestJS boilerplate.
KR: 선택형 NestJS 보일러플레이트를 생성하는 인터랙티브 Nest schematics 패키지입니다.

## Quick Start

```bash
cd nest-flex-schematics
npm install
npm run build
npx @yeoli/nest-flex-schematics init
```

If you use pnpm:
KR: pnpm을 사용하는 경우:

```bash
cd nest-flex-schematics
pnpm install
pnpm run build
pnpm dlx @yeoli/nest-flex-schematics init
```

For the interactive question flow, see `docs/CLI_FLOW.md`.
KR: 인터랙티브 질문 흐름은 `docs/CLI_FLOW.md`를 참고하세요.

In CI/automation, prefer `generate --no-interactive`.
KR: CI/자동화 환경에서는 `generate --no-interactive` 사용을 권장합니다.

## Generate a Boilerplate

The easiest way is interactive mode:
KR: 가장 쉬운 방법은 interactive 모드입니다.

```bash
npx @yeoli/nest-flex-schematics init
```

To provide all options manually, use this command:
KR: 모든 옵션을 직접 지정하려면 아래 명령을 사용하세요.

```bash
npx schematics ./tools/schematics/collection.json:nest-boilerplate \
  --no-interactive \
  --name my-nest-app \
  --package-manager npm \
  --version-mode preset \
  --preset node20-nest11 \
  --runtime fastify \
  --api-style rest \
  --database postgres \
  --orm prisma \
  --auth jwt \
  --validation class-validator \
  --swagger \
  --test-preset unit \
  --no-docker
```

## Option Values

Only these values are allowed.
KR: 아래 값만 사용할 수 있습니다.

- `--package-manager`: `npm`, `pnpm`
- `--version-mode`: `preset`, `custom`
- `--preset`: `node20-nest11`, `node22-nest11`, `node20-nest10`
- `--runtime`: `express`, `fastify`
- `--api-style`: `rest`, `graphql`, `both`
- `--graphql-approach`: `code-first`, `schema-first` (for graphql/both)
- `--graphql-driver`: `apollo`, `mercurius` (for graphql/both)
- `--database`: `postgres`, `mysql`, `mongodb`
- `--orm`: `prisma`, `typeorm`, `mongoose`
- `--auth`: `none`, `jwt`
- `--validation`: `class-validator`, `zod`
- `--test-preset`: `unit`, `unit-e2e`
- `--swagger` / `--no-swagger`
- `--docker` / `--no-docker`

## Allowed and Disallowed Combinations

### DB + ORM

Allowed:
KR: 허용 조합:

- `postgres + prisma`
- `postgres + typeorm`
- `mysql + prisma`
- `mysql + typeorm`
- `mongodb + mongoose`

Disallowed:
KR: 금지 조합:

- `mongodb + prisma`
- `mongodb + typeorm`
- `postgres/mysql + mongoose`

### GraphQL Driver Rules

- `apollo`: supports both `express` and `fastify`
- `mercurius`: supports only `fastify`
- `mercurius` requires `nest >= 11`

KR:
- `apollo`: `express`, `fastify` 모두 지원
- `mercurius`: `fastify`에서만 지원
- `mercurius`는 `nest >= 11`에서만 지원

### Runtime Constraint

- `fastify + swagger` is not supported for `nest < 11`

KR:
- `nest < 11`에서는 `fastify + swagger` 조합을 지원하지 않습니다.

## Conditional Option Rules

- With `--api-style rest`, `--graphql-approach` and `--graphql-driver` are ignored.
- With `--api-style graphql` or `both`, set both GraphQL options explicitly.
- With `--version-mode custom`, you can set `--node-version` and `--nest-version`.

KR:
- `--api-style rest`에서는 `--graphql-approach`, `--graphql-driver`가 무시됩니다.
- `--api-style graphql` 또는 `both`에서는 GraphQL 옵션을 함께 지정하는 것을 권장합니다.
- `--version-mode custom`에서는 `--node-version`, `--nest-version`을 추가로 지정할 수 있습니다.

## Invalid Examples (Fail Fast)

These combinations are blocked during generation.
KR: 아래 조합은 생성 단계에서 에러로 차단됩니다.

```bash
# 1) mongodb + prisma
npx schematics ./tools/schematics/collection.json:nest-boilerplate \
  --no-interactive --name invalid-db --package-manager npm \
  --version-mode preset --preset node20-nest11 --runtime fastify \
  --api-style rest --database mongodb --orm prisma --auth none \
  --validation class-validator --no-swagger --test-preset unit --no-docker

# 2) express + mercurius
npx schematics ./tools/schematics/collection.json:nest-boilerplate \
  --no-interactive --name invalid-driver --package-manager npm \
  --version-mode preset --preset node22-nest11 --runtime express \
  --api-style graphql --graphql-approach code-first --graphql-driver mercurius \
  --database postgres --orm typeorm --auth none --validation class-validator \
  --no-swagger --test-preset unit --no-docker
```

## Custom Mode Example

Use custom mode when you want to set versions directly instead of presets.
KR: 공식 프리셋 대신 버전을 직접 지정하려면 custom 모드를 사용하세요.

```bash
npx schematics ./tools/schematics/collection.json:nest-boilerplate \
  --no-interactive \
  --name my-custom-app \
  --package-manager pnpm \
  --version-mode custom \
  --node-version 20 \
  --nest-version 11 \
  --runtime express \
  --api-style both \
  --graphql-approach code-first \
  --graphql-driver apollo \
  --database mysql \
  --orm typeorm \
  --auth jwt \
  --validation class-validator \
  --swagger \
  --test-preset unit-e2e \
  --docker
```

Notes:
KR: 참고:

- `custom` mode is a `Custom (Best-Effort)` support tier.
- DB/ORM and GraphQL validation rules still apply in custom mode.

## Run Generated Project

```bash
cd my-nest-app
cp .env.example .env
npm install
npm run build
npm run start:dev
```

If you use pnpm:
KR: pnpm을 사용하는 경우:

```bash
cd my-nest-app
cp .env.example .env
pnpm install
pnpm run build
pnpm run start:dev
```

Default URLs:
KR: 기본 확인 URL:

- Health: `http://localhost:3000/v1/health`
- Swagger (REST + swagger): `http://localhost:3000/docs`

## Official Presets

- `node20-nest11` (recommended)
- `node22-nest11`
- `node20-nest10` (legacy)

Support policy:
KR: 지원 정책:

- `version-mode=preset`: Official Support
- `version-mode=custom`: Custom (Best-Effort)

## Release Rules

- Version policy: SemVer (`0.x` may include breaking changes in minor)
- Changelog format: keep Added/Changed/Fixed/Deprecated in `CHANGELOG.md`
- Detailed release flow: `docs/RELEASE_POLICY.md`

KR:
- 버전 정책: SemVer (`0.x` 구간에서는 minor에 breaking change 포함 가능)
- 변경 이력 형식: `CHANGELOG.md`에서 Added/Changed/Fixed/Deprecated 유지
- 상세 릴리스 절차: `docs/RELEASE_POLICY.md`

Recommended pre-publish order:
KR: 배포 직전 권장 순서:

```bash
npm ci
npm run build
npm pack --dry-run
npm publish --access public
```
