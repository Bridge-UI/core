---
name: bridge-ui-overlays
description: >-
  Bridge UI Vue overlays and imperative actions — Modal, Drawer, Menu, Tooltip,
  Snackbar, useModalAction, useDialogAction, useDrawerAction, useSnackbarAction,
  BridgeUIHosts. Use when opening layers or toast/dialog flows.
---

# Bridge UI (Vue) — overlays & actions

## Declarative Modal

`v-model`. Content: **`Card`** (no `ModalCard`).

```vue
<Button v-on:click="open = true">Open</Button>

<Modal v-model="open">
  <Card title="Confirm" :on-close="() => (open = false)">
    Are you sure?
  </Card>
</Modal>
```

Useful props: `size`, `align`, `blur`, `transition`, `persistent`.

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

## Drawer / Menu / Tooltip / Snackbar

Import from `Components/{Name}`. For imperative toasts, prefer action hooks.

## Imperative actions

```ts
import { BridgeUIHosts } from "@bridge-ui/vue/Actions";
import {
  useDialogAction,
  useModalAction,
  useDrawerAction,
  useSnackbarAction,
} from "@bridge-ui/vue/Actions";
```

Mount `BridgeUIHosts` inside the provider tree.

```ts
const modal = useModalAction();
const id = modal.open({
  component: SettingsForm,
  modal: { size: "lg", title: "Settings" },
});
modal.close(id);
modal.closeTop();
```

Match option shapes to docs. Escape closes the top nested layer.
