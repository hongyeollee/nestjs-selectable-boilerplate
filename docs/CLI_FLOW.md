# Interactive CLI Flow

Use this command for the best UX:

```bash
npx @yeoli/nest-flex-schematics init
```

The wizard asks in this order:

1. Project name
2. Package manager (`npm`, `pnpm`)
3. Version mode (`preset`, `custom`)
4. Preset selection or Node/Nest versions
5. Runtime (`express`, `fastify`)
6. API style (`rest`, `graphql`, `both`)
7. GraphQL approach/driver (only when graphql or both)
8. Database and ORM/ODM (ORM options are filtered by DB)
9. Auth / Validation / Swagger / Test / Docker
10. Summary and confirm

If a combination is invalid, generation stops with a clear error message.

## Driver and compatibility rules

- `mercurius` is only available with `fastify`
- `mercurius` requires `nest >= 11`
- `nest < 11` does not support `fastify + swagger`
- DB/ORM allowed matrix:
  - postgres: prisma, typeorm
  - mysql: prisma, typeorm
  - mongodb: mongoose
