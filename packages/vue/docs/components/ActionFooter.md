# ActionFooter

Cancel / Apply pair used as the default footer in pickers and listboxes. The host keeps the footer bar; `ActionFooter` only renders the buttons.

Both buttons share one `color`; `applyVariant` / `cancelVariant` set their hierarchy. Inside pickers and listboxes the footer follows the host `color` (`<DatePicker color="success" show-footer />` gets a green footer).

Theme the variants once through `components.ActionFooter.defaultProps`. Instance `customProps.applyButton` / `cancelButton` still win, including a per-button `color`.

## Import

```ts
import { ActionFooter } from "@bridge-ui/vue/Components/ActionFooter";
```

## Examples

### Usage

```vue
<ActionFooter v-on:apply="save" v-on:cancel="discard" />

<ActionFooter apply-label="Save" cancel-label="Discard" />

<ActionFooter color="info" cancel-variant="outline" />
```

### Registry defaults

```vue
<BridgeUIProvider
  :components="{
    ActionFooter: {
      defaultProps: {
        applyVariant: 'solid',
        cancelVariant: 'outline',
      },
    },
  }"
>
  <DatePicker show-footer />
</BridgeUIProvider>
```

### Instance override

```vue
<DatePicker
  show-footer
  :custom-props="{
    applyButton: { color: 'error' },
  }"
/>
```

### customProps

```vue
<ActionFooter
  :custom-props="{
    applyButton: { color: 'error' },
    root: { 'data-testid': 'action-footer' },
  }"
/>
```

## Props

| Prop             | Type                      | Default     | Description                                              |
| ---------------- | ------------------------- | ----------- | -------------------------------------------------------- |
| `apply-label`    | `string`                  | `"Apply"`   | Label of the Apply button. Falls back to i18n `Apply`.   |
| `apply-variant`  | `ButtonVariant`           | —           | Variant of the Apply button. Falls back to `Button`.     |
| `cancel-label`   | `string`                  | `"Cancel"`  | Label of the Cancel button. Falls back to i18n `Cancel`. |
| `cancel-variant` | `ButtonVariant`           | `"flat"`    | Variant of the Cancel button.                            |
| `classes`        | `ActionFooterClasses`     | —           | Classes for `root`, `applyButton`, `cancelButton`.       |
| `color`          | `ButtonColor`             | `"primary"` | Color shared by both buttons.                            |
| `custom-props`   | `ActionFooterCustomProps` | —           | Extra props for internal parts.                          |

## Events

| Event         | Type | Description                     |
| ------------- | ---- | ------------------------------- |
| `v-on:apply`  | `()` | Emitted when Apply is pressed.  |
| `v-on:cancel` | `()` | Emitted when Cancel is pressed. |

## Related components

Button, DatePicker, ColorPicker, Select
