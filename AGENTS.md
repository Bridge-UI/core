# Bridge UI — agent instructions (monorepo)

This repository builds `@bridge-ui/core`, `@bridge-ui/react`, and `@bridge-ui/vue`.

## Which instructions to follow

| You are…                             | Read                                                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Building an app that uses Bridge** | Package AI + docs: [`packages/react/ai`](./packages/react/ai/) / [`packages/react/docs`](./packages/react/docs/) (or vue). Or run `npx bridge-ui-*-ai install` in the app |
| **Contributing to this monorepo**    | [`.cursor/rules/`](./.cursor/rules/) (patterns, docs examples, commits)                                                                                                   |

Do not mix the two.

## Consumer packages (source of truth)

| Package            | AI                                           | Docs                                                                          |
| ------------------ | -------------------------------------------- | ----------------------------------------------------------------------------- |
| `@bridge-ui/react` | [`packages/react/ai/`](./packages/react/ai/) | [`packages/react/docs/`](./packages/react/docs/) (`components/`, `examples/`) |
| `@bridge-ui/vue`   | [`packages/vue/ai/`](./packages/vue/ai/)     | [`packages/vue/docs/`](./packages/vue/docs/) (`components/`, `examples/`)     |

```bash
npm install @bridge-ui/react
npx bridge-ui-react-ai install
```

Skills are thin routers — examples live in package `docs/`.

## Documentation index

- Monorepo index: [`docs/README.md`](./docs/README.md)
- Release guide: [`docs/RELEASE.md`](./docs/RELEASE.md)
- Machine-oriented: [`llms.txt`](./llms.txt)
