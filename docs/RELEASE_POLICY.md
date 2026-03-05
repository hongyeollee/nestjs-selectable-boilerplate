# Release Policy

## Versioning

- This project follows SemVer.
- While pre-1.0 (`0.x`), breaking changes are released in a minor bump.
- Patch: bug fixes only.

## Support tiers

- Official support: `version-mode=preset`
- Best-effort support: `version-mode=custom`

## Release checklist

1. `npm ci && npm run build`
2. Run official preset smoke commands
3. Update `CHANGELOG.md`
4. Bump version (`npm version <patch|minor|major>`)
5. Push tag (`vX.Y.Z`)

## Beta plan

- Publish beta tags first (`v0.2.0-beta.1`) for risky changes.
- Keep beta period open for at least one feedback cycle.
- Promote to stable after compatibility/CI feedback passes.
