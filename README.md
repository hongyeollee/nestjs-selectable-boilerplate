# Nest Flex Schematics

NestJS 보일러플레이트를 선택형으로 생성하는 `Nest schematics` 패키지입니다.

## 빠른 시작

```bash
cd nest-flex-schematics
npm install
npm run build
npx @hongyeol/nest-flex-schematics init
```

pnpm 사용 시:

```bash
cd nest-flex-schematics
pnpm install
pnpm run build
pnpm dlx @hongyeol/nest-flex-schematics init
```

인터랙티브 질문 흐름은 `docs/CLI_FLOW.md`를 참고하세요.

## 보일러플레이트 생성

가장 쉬운 방법은 interactive 모드입니다.

```bash
npx @hongyeol/nest-flex-schematics init
```

직접 옵션을 모두 지정하려면 아래 명령을 사용하세요. 공식 프리셋(`node20-nest11`) 기반 프로젝트가 생성됩니다.

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

### 옵션 값 가이드

아래 값들만 사용 가능합니다.

- `--package-manager`: `npm`, `pnpm`
- `--version-mode`: `preset`, `custom`
- `--preset`: `node20-nest11`, `node22-nest11`, `node20-nest10`
- `--runtime`: `express`, `fastify`
- `--api-style`: `rest`, `graphql`, `both`
- `--graphql-approach`: `code-first`, `schema-first` (api-style이 graphql/both일 때)
- `--graphql-driver`: `apollo`, `mercurius` (api-style이 graphql/both일 때)
- `--database`: `postgres`, `mysql`, `mongodb`
- `--orm`: `prisma`, `typeorm`, `mongoose`
- `--auth`: `none`, `jwt`
- `--validation`: `class-validator`, `zod`
- `--test-preset`: `unit`, `unit-e2e`
- `--swagger` / `--no-swagger`
- `--docker` / `--no-docker`

### 허용 조합 / 금지 조합

#### DB + ORM

- 허용
  - `postgres + prisma`
  - `postgres + typeorm`
  - `mysql + prisma`
  - `mysql + typeorm`
  - `mongodb + mongoose`
- 금지
  - `mongodb + prisma`
  - `mongodb + typeorm`
  - `postgres/mysql + mongoose`

#### GraphQL 드라이버

- `apollo`: `express`, `fastify` 모두 가능
- `mercurius`: `fastify`에서만 가능
- `mercurius`는 `nest >= 11`에서만 가능

#### 런타임 제약

- `nest < 11`에서는 `fastify + swagger` 조합 미지원

### 조건부 옵션 규칙

- `--api-style rest` 선택 시
  - `--graphql-approach`, `--graphql-driver`는 의미 없음
- `--api-style graphql` 또는 `--api-style both` 선택 시
  - `--graphql-approach`, `--graphql-driver`를 함께 지정 권장
- `--version-mode custom` 선택 시
  - `--node-version`, `--nest-version`을 추가로 지정 가능
  - 지원 티어는 `Custom (Best-Effort)`로 동작

### 실패 예시

아래 조합은 생성 단계에서 에러로 차단됩니다.

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

### custom 모드 예시

공식 프리셋 대신 직접 버전을 지정하려면 `custom` 모드를 사용합니다.

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

참고:
- `custom` 모드는 `Custom (Best-Effort)` 지원 티어입니다.
- 조합 검증 규칙(DB/ORM, GraphQL 드라이버 제약)은 동일하게 적용됩니다.

## 생성 후 실행

```bash
cd my-nest-app
cp .env.example .env
npm install
npm run build
npm run start:dev
```

pnpm 사용 시:

```bash
cd my-nest-app
cp .env.example .env
pnpm install
pnpm run build
pnpm run start:dev
```

기본 확인 URL:
- Health: `http://localhost:3000/v1/health`
- Swagger(REST + swagger): `http://localhost:3000/docs`

## 공식 프리셋

- `node20-nest11` (recommended)
- `node22-nest11`
- `node20-nest10` (legacy)

지원 정책:
- `version-mode=preset`: Official Support
- `version-mode=custom`: Custom (Best-Effort)

## 주요 규칙

- DB/ORM 허용 조합
  - postgres: prisma, typeorm
  - mysql: prisma, typeorm
  - mongodb: mongoose
- GraphQL 드라이버
  - apollo: express, fastify
  - mercurius: fastify only (`nest >= 11`)
- 런타임 제약
  - `nest < 11`에서는 `fastify + swagger` 조합 미지원

## 릴리스 규칙

- 버전 정책: SemVer (`0.x` 구간에서는 minor에 breaking change 포함)
- 변경 기록: `CHANGELOG.md`의 Added/Changed/Fixed/Deprecated 형식 유지
- 상세 릴리스 절차: `docs/RELEASE_POLICY.md`
