# ActionFooter

Cancel / Apply pair used as the default footer in pickers and listboxes. The host keeps the footer bar; `ActionFooter` only renders the buttons.

Both buttons share one `color`; `applyVariant` / `cancelVariant` set their hierarchy. Inside pickers, listboxes and the `RichTextEditor` link editor the footer follows the host `color` (`<DatePicker color="success" showFooter />` gets a green footer).

Theme the variants once through `components.ActionFooter.defaultProps`. Instance `customProps.applyButton` / `cancelButton` still win, including a per-button `color`.

## Import

```ts
import { ActionFooter } from "@bridge-ui/react/Components/ActionFooter";
```

## Examples

### Usage

```tsx
<ActionFooter onApply={save} onCancel={discard} />

<ActionFooter applyLabel="Save" cancelLabel="Discard" />

<ActionFooter color="info" cancelVariant="outline" />
```

### Registry defaults

```tsx
<BridgeUIProvider
  components={{
    ActionFooter: {
      defaultProps: {
        applyVariant: "solid",
        cancelVariant: "outline",
      },
    },
  }}
>
  <DatePicker showFooter />
</BridgeUIProvider>
```

### Instance override

```tsx
<DatePicker
  showFooter
  customProps={{
    applyButton: { color: "error" },
  }}
/>
```

### customProps

```tsx
<ActionFooter
  customProps={{
    applyButton: { color: "error" },
    root: { "data-testid": "action-footer" },
  }}
/>
```

## Props

| Prop            | Type                      | Default     | Description                                              |
| --------------- | ------------------------- | ----------- | -------------------------------------------------------- |
| `applyLabel`    | `string`                  | `"Apply"`   | Label of the Apply button. Falls back to i18n `Apply`.   |
| `applyVariant`  | `ButtonVariant`           | —           | Variant of the Apply button. Falls back to `Button`.     |
| `cancelLabel`   | `string`                  | `"Cancel"`  | Label of the Cancel button. Falls back to i18n `Cancel`. |
| `cancelVariant` | `ButtonVariant`           | `"flat"`    | Variant of the Cancel button.                            |
| `classes`       | `ActionFooterClasses`     | —           | Classes for `root`, `applyButton`, `cancelButton`.       |
| `color`         | `ButtonColor`             | `"primary"` | Color shared by both buttons.                            |
| `customProps`   | `ActionFooterCustomProps` | —           | Extra props for internal parts.                          |

## Events

| Callback   | Type         | Description                    |
| ---------- | ------------ | ------------------------------ |
| `onApply`  | `() => void` | Called when Apply is pressed.  |
| `onCancel` | `() => void` | Called when Cancel is pressed. |

## Related components

Button, DatePicker, ColorPicker, Select
