## Summary

<!-- What does this PR change and why? Keep it concise. -->

## Related issue

<!-- Link the issue this PR addresses, e.g. Closes #123 -->

## Type of change

- [ ] Bug fix
- [ ] New feature or component
- [ ] Enhancement to an existing component
- [ ] Documentation
- [ ] Refactor or internal change
- [ ] Tests only
- [ ] Chore (CI, tooling, dependencies)

## Packages affected

- [ ] `@bridge-ui/core`
- [ ] `@bridge-ui/react`
- [ ] `@bridge-ui/vue`
- [ ] Not applicable

## Checklist

- [ ] Shared logic lives in `@bridge-ui/core` when it applies to both frameworks
- [ ] React and Vue stay in parity (or this PR is intentionally scoped to one framework)
- [ ] Types follow project conventions (`*OwnProps`, `*CustomProps`, `MergeHtmlProps`, etc.)
- [ ] Tests added or updated (`*.test.*` and `*.cy.*` where relevant)
- [ ] Docs updated in `docs/react/` and/or `docs/vue/` when behavior or API changes
- [ ] `npm run lint`, `npm run type-check`, and `npm run test:run` pass locally

## Test plan

<!-- How did you verify this change? List commands run and manual steps. -->

- [ ] `npm run test:run -w @bridge-ui/core` (if core changed)
- [ ] `npm run test:run -w @bridge-ui/react` (if react changed)
- [ ] `npm run test:run -w @bridge-ui/vue` (if vue changed)
- [ ] `npm run test:cy -w @bridge-ui/react` (if react UI changed)
- [ ] `npm run test:cy -w @bridge-ui/vue` (if vue UI changed)

## Screenshots / recordings

<!-- Optional. Include for visible UI changes. -->
