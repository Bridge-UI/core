# useBreakpoint

Reactive viewport breakpoints aligned with Tailwind `--breakpoint-*` tokens.

## Import

```ts
import { useBreakpoint } from "@bridge-ui/vue";
```

## Examples

### Usage

```vue
<script setup>
import { useBreakpoint } from "@bridge-ui/vue";

const breakpoint = useBreakpoint();
</script>

<template>
  <p v-if="breakpoint.mobile">Mobile layout</p>
  <p v-else-if="breakpoint.greaterOrEqual('lg')">Large layout</p>
</template>
```

### Responsive Modal

```vue
<script setup>
import { useBreakpoint } from "@bridge-ui/vue";

const breakpoint = useBreakpoint();
</script>

<template>
  <Modal
    v-model="open"
    :align="breakpoint.mobile ? 'bottom-center' : 'middle-center'"
  >
    …
  </Modal>
</template>
```

### Global defaults

```ts
app.use(
  createBridgeUI({
    global: {
      mobileBreakpoint: "md",
      breakpoints: { "3xl": "120rem" },
    },
  }),
);
```

Composable options override the provider when passed:

```ts
useBreakpoint({
  mobileBreakpoint: "lg",
  breakpoints: { sm: "30rem" },
});
```

## API

| Member                 | Type                                    | Description                                     |
| ---------------------- | --------------------------------------- | ----------------------------------------------- |
| `name`                 | `string`                                | Active band (`xs` or a breakpoint key)          |
| `width`                | `number`                                | Viewport width (px)                             |
| `height`               | `number`                                | Viewport height (px)                            |
| `mobile`               | `boolean`                               | `width < mobileBreakpoint`                      |
| `thresholds`           | `Record<string, number>`                | Resolved min-widths (px)                        |
| `lessThan(name)`       | `(name: string) => boolean`             | `width <` threshold                             |
| `lessOrEqual(name)`    | `(name: string) => boolean`             | `width <=` threshold                            |
| `greaterThan(name)`    | `(name: string) => boolean`             | `width >` threshold                             |
| `greaterOrEqual(name)` | `(name: string) => boolean`             | `width >=` threshold (Tailwind `sm:` semantics) |
| `between(min, max)`    | `(min: string, max: string) => boolean` | `>= min` and `< max`                            |

Returns a **reactive object** — read properties on the object (do not destructure helpers) so updates stay reactive in script.

### Options

| Option             | Type                     | Default         | Description                                  |
| ------------------ | ------------------------ | --------------- | -------------------------------------------- |
| `mobileBreakpoint` | `string`                 | global / `"sm"` | Threshold for `mobile`                       |
| `breakpoints`      | `Record<string, string>` | global / `{}`   | Extra or overridden CSS lengths (`40rem`, …) |

Breakpoints are read from `--breakpoint-*` (export via `@theme static` in Bridge themes). Custom names work when the CSS variable exists or is passed in `breakpoints`.

## Related

- [Modal](./Modal.md)
- [BridgeUIProvider](./BridgeUIProvider.md)
