# @bridge-ui/svelte (spike)

Private, unpublished spike to measure the cost of a Svelte 5 binding. It ports
`Icon`, `Button`, `Label`, `BaseField`, `Tooltip` and `Slider`, plus the
provider, adapters and utils they need.

```bash
npm run build:svelte       # svelte-package → dist
npm run type-check:svelte  # svelte-check
npm run test:svelte        # vitest + @testing-library/svelte
npm run test:cy:svelte     # cypress component (unset ELECTRON_RUN_AS_NODE)
```

Not wired into the root `build` / `test` / `type-check` scripts on purpose.

## Conventions (vs React / Vue)

| Topic         | Svelte                                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hooks         | `Components/{X}/hooks/use{X}.svelte.ts` (runes). Take `props` as a getter (`() => props`) and return an object of getters — read `api.merged`, never destructure.                    |
| Slots         | Snippet props: `children`, `start`, `end`, `trigger`, `thumb`. Chrome text props that also had a slot (`label`, `corner`, `description`, `errorMessage`) accept `string \| Snippet`. |
| Events        | Callback props (`onChange`, `onShowChange`), like React. DOM handlers in binds are lowercase (`onkeydown`, `onpointerenter`).                                                        |
| Two-way state | `$bindable` (`bind:value`, `bind:show`); uncontrolled via `defaultValue`.                                                                                                            |
| Ids           | `$props.id()` in the component, passed to the hook (`autoId` / `id`).                                                                                                                |
| Element refs  | Attachments exposed by the hook (`{@attach api.attachTrack}`).                                                                                                                       |
| Teleport      | `{@attach portal(target)}` from `@/Utils`.                                                                                                                                           |
| Inline styles | Strings only: build with `styleToString` / `joinStyles`.                                                                                                                             |
| Hook tests    | `renderHook` from `@/Utils/__tests__/renderHook` (runs the hook inside a component).                                                                                                 |
