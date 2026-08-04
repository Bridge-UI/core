# Bridge UI — agent instructions (monorepo)

This repository builds `@bridge-ui/core`, `@bridge-ui/react`, and `@bridge-ui/vue`.

## Which instructions to follow

| You are…                             | Read                                                                                                                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Building an app that uses Bridge** | Package files: [`packages/react/ai/AGENTS.md`](./packages/react/ai/AGENTS.md) or [`packages/vue/ai/AGENTS.md`](./packages/vue/ai/AGENTS.md) — or run `npx bridge-ui-*-ai install` in the app |
| **Contributing to this monorepo**    | [`.cursor/rules/`](./.cursor/rules/) (patterns, docs examples, commits)                                                                                                                      |

Do not mix the two.

## Consumer packages (source of truth)

| Package            | AI entrypoints                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `@bridge-ui/react` | [`packages/react/ai/`](./packages/react/ai/) (`AGENTS.md`, `llms.txt`, guidelines, skills) |
| `@bridge-ui/vue`   | [`packages/vue/ai/`](./packages/vue/ai/)                                                   |

```bash
npm install @bridge-ui/react
npx bridge-ui-react-ai install
```

## Documentation

- Index: [`docs/README.md`](./docs/README.md)
- Machine-oriented index (monorepo): [`llms.txt`](./llms.txt)
- Package indexes: `packages/react/ai/llms.txt`, `packages/vue/ai/llms.txt`
