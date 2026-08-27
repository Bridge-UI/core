# Scroll utilities

CSS utilities for overflow scrollers. They ship in `theme.css` — no extra import.

Not a component. Put the class on the element that has `overflow-y-auto` / `overflow-x-auto`.

## Classes

| Class                     | Role                                                                   |
| ------------------------- | ---------------------------------------------------------------------- |
| `bridge-scroll-fade`      | Vertical fade (alias of `-y`).                                         |
| `bridge-scroll-fade-y`    | Vertical fade on the overflow scroller.                                |
| `bridge-scroll-fade-x`    | Horizontal fade on the overflow scroller.                              |
| `bridge-scroll-fade-none` | Disable the fade. Works in any class order.                            |
| `bridge-soft-scrollbar`   | Thin, rounded thumb.                                                   |
| `bridge-hide-scrollbar`   | Hide the scrollbar; wheel / keyboard / programmatic scroll still work. |

## Examples

### Vertical fade

```vue
<div class="bridge-scroll-fade-y overflow-y-auto">…</div>
```

### Horizontal fade

```vue
<div class="flex bridge-scroll-fade-x overflow-x-auto">…</div>
```

### Hide scrollbar

```vue
<div class="bridge-scroll-fade-y bridge-hide-scrollbar overflow-y-auto">
  …
</div>
```

### Fade size

Depth defaults to `12%` of the container, capped at `40px`. Override with `--bridge-scroll-fade-size`:

```vue
<div
  class="bridge-scroll-fade-y overflow-y-auto [--bridge-scroll-fade-size:1.5rem]"
>
  …
</div>
```

### Disable the fade

```vue
<div class="bridge-scroll-fade-y bridge-scroll-fade-none overflow-y-auto">
  …
</div>
```

### Soft scrollbar

```vue
<div class="bridge-soft-scrollbar overflow-y-auto">…</div>
```

Do not pair `bridge-scroll-fade-*` with `bridge-soft-scrollbar` on the same node — the mask dissolves the thumb at the edges. Use fade + `bridge-hide-scrollbar` when the fade is the overflow hint.

Do not put `bridge-scroll-fade-x` and `bridge-scroll-fade-y` on the same node — both set `mask-image`, and the later rule wins.

Put background and border on a wrapper; put `bridge-scroll-fade-*` on the inner scroller so the mask dissolves content, not the card chrome.

## Behavior

- Scroll-aware when the browser supports scroll-driven animations: crisp start edge at rest, both edges mid-scroll, crisp end edge at the end.
- If content does not overflow, no fade.
- Without scroll-driven animations, both edges fade statically. Wheel / keyboard / programmatic scroll still work.
- `bridge-scroll-fade-x` follows reading direction (RTL included).

## TimePanel

TimePanel columns use `bridge-scroll-fade-y` and `bridge-hide-scrollbar` by default. Add `bridge-scroll-fade-none` via `classes.column` to disable the fade.

## Also used by

| Component                       | Classes                                                                  |
| ------------------------------- | ------------------------------------------------------------------------ |
| Select / Listbox                | `bridge-soft-scrollbar` on the options scroller.                         |
| Modal / Drawer `scroll="paper"` | `bridge-scroll-fade-y` and `bridge-hide-scrollbar` on the panel.         |
| FieldOverlay drawer             | Inner `bridge-scroll-fade-x`; vertical fade comes from `scroll="paper"`. |
