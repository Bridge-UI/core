# Bridge UI (Vue) — agent instructions

Use **`@bridge-ui/vue`**. Prefer Bridge components over ad-hoc markup.

## Quick start

```bash
npm install @bridge-ui/vue
npx bridge-ui-vue-ai install
```

## Always follow

- Guidelines: `.ai/guidelines/core.md`
- Component docs: `.ai/docs/components/` (index: `.ai/docs/README.md`)
- Adapter samples: `.ai/docs/examples/`
- Skills (on demand) under `.cursor/skills/`:
  - `bridge-ui-setup`
  - `bridge-ui-components`
  - `bridge-ui-forms`
  - `bridge-ui-overlays`

Skills point at the docs — **read `.ai/docs/components/{Component}.md` for copy-paste examples**.

## Hard rules

1. Import from `@bridge-ui/vue/Components/{Name}`.
2. Tailwind v4 + `@bridge-ui/vue/theme.css`.
3. `createBridgeUI` / `BridgeUIProvider` + `BridgeUIHosts` when using action hooks.
4. Fields: `v-model`.
5. Modal body: `Card` (no `ModalCard`).
