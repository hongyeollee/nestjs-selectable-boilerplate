# Nest Flex Schematics

NestJS 보일러플레이트를 선택형으로 생성하는 `Nest schematics` 패키지입니다.

## 빠른 시작

```bash
cd nest-flex-schematics
npm install
npm run build
```

pnpm 사용 시:

```bash
cd nest-flex-schematics
pnpm install
pnpm run build
```

## 보일러플레이트 생성

아래 명령을 그대로 실행하면 공식 프리셋(`node20-nest11`) 기반 프로젝트가 생성됩니다.

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
