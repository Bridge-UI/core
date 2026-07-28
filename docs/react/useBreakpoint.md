# useBreakpoint

Reactive viewport breakpoints aligned with Tailwind `--breakpoint-*` tokens.

## Import

```ts
import { useBreakpoint } from "@bridge-ui/react";
```

## Examples

### Usage

```tsx
const breakpoint = useBreakpoint();

if (breakpoint.mobile) {
  // below global mobileBreakpoint (default `sm`)
}

if (breakpoint.greaterOrEqual("lg")) {
  // Tailwind `lg:` and up
}
```

### Responsive Modal

```tsx
const breakpoint = useBreakpoint();

<Modal
  show={open}
  onShowChange={setOpen}
  align={breakpoint.mobile ? "bottom-center" : "middle-center"}
>
  …
</Modal>;
```

### Global defaults

```tsx
<BridgeUIProvider
  global={{
    mobileBreakpoint: "md",
    breakpoints: { "3xl": "120rem" },
  }}
>
  <App />
</BridgeUIProvider>
```

Hook options override the provider when passed:

```tsx
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

### Options

| Option             | Type                     | Default         | Description                                  |
| ------------------ | ------------------------ | --------------- | -------------------------------------------- |
| `mobileBreakpoint` | `string`                 | global / `"sm"` | Threshold for `mobile`                       |
| `breakpoints`      | `Record<string, string>` | global / `{}`   | Extra or overridden CSS lengths (`40rem`, …) |

On the server (and before hydration), `width`/`height` are `0` and `mobile` is `true`.

Breakpoints are read from `--breakpoint-*` (export via `@theme static` in Bridge themes). Custom names work when the CSS variable exists or is passed in `breakpoints`.

## Related

- [Modal](./Modal.md)
- [BridgeUIProvider](./BridgeUIProvider.md)
