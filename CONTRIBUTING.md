# Contributing

```bash
npm install
npm run build
```

Run local smoke generation using official presets before opening PR.

```bash
npx schematics ./tools/schematics/collection.json:nest-boilerplate --debug=false --dry-run=true --no-interactive --name local-node20-nest11 --package-manager npm --version-mode preset --preset node20-nest11 --runtime fastify --api-style rest --database postgres --orm prisma --auth jwt --validation class-validator --swagger --test-preset unit --no-docker
```

Update `CHANGELOG.md` for user-facing changes.
