<p align="center">
<img src="https://raw.githubusercontent.com/Bridge-UI/docs/main/assets/logo-main.svg" height="100" alt="Bridge UI logo">
</p>

<h2><p align="center">BridgeUI</p></h2>

<p align="center">
<a href="https://github.com/Bridge-UI/core/actions"><img src="https://github.com/Bridge-UI/core/actions/workflows/ci.yml/badge.svg" alt="Tests"></a>
<a href="LICENSE.md"><img src="https://img.shields.io/github/license/Bridge-UI/core" alt="License" /></a>
</p>

### 🚀 Introduction

Bridge UI is a component library for **React** and **Vue** with a shared foundation. Design tokens, types, and utilities live in `@bridge-ui/core`, while each framework package ships the same API surface with idiomatic implementations.

Building accessible forms, overlays, and feedback from scratch is slow. Bridge UI gives you ready-made primitives—customizable with Tailwind CSS—so you can focus on product logic instead of reinventing UI patterns.

#### 🔥 You get with Bridge UI:

- Form controls and fields (`TextField`, `Select`, `Checkbox`, `Switch`, and more)
- Layout and navigation (`Card`, `List`, `Menu`, `Link`)
- Overlays and feedback (`Modal`, `Alert`, `Snackbar`)
- Imperative actions (`DialogAction`, `ModalAction`, `SnackbarAction`)
- Shared design system via `@bridge-ui/core`
- Lucide icons through the `Icon` component

### 📦 Packages

| Package            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `@bridge-ui/react` | React components (depends on `@bridge-ui/core`)  |
| `@bridge-ui/vue`   | Vue components (depends on `@bridge-ui/core`)    |
| `@bridge-ui/core`  | Shared types, tokens, and utilities              |

```bash
npm install @bridge-ui/react   # or @bridge-ui/vue
npx bridge-ui-react-ai install # optional: agent guidelines/skills
```

### 📚 Documentation

Component reference for React and Vue is available in the [`docs/`](./docs/README.md) folder.

### 🤖 AI / agents

Consumer guidelines ship inside `@bridge-ui/react` and `@bridge-ui/vue` (`ai/`, including `AGENTS.md` and `llms.txt`). Edit them under [`packages/react/ai`](./packages/react/ai/) and [`packages/vue/ai`](./packages/vue/ai/). The root [`AGENTS.md`](./AGENTS.md) / [`llms.txt`](./llms.txt) are for this monorepo only.

```bash
npx bridge-ui-react-ai install   # symlink into the app (or --copy)
```

Monorepo contribution rules for Cursor stay in `.cursor/rules/` and are separate from consumer guidance.

### 🔧 Contributing

Thank you for considering contributing to Bridge UI! Open an issue or pull request on [GitHub](https://github.com/Bridge-UI/core). React and Vue components should stay in parity, and shared logic belongs in `@bridge-ui/core`.

### 💡 Philosophy

Bridge UI is free and open source for everyone. The project is maintained by the community—issues, ideas, and pull requests are welcome.

### 📝 License

Bridge UI is open-source software licensed under the [MIT license](LICENSE.md).
