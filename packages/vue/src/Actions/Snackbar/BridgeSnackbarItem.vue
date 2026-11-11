<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Core Imports
import { completeLayerHide, mergeLayerShellProps } from "@bridge-ui/core/Layer";
import type { SnackbarColor } from "@bridge-ui/core/Tokens";

// ** Local Imports
import BridgeSnackbarAction from "@/Actions/Snackbar/BridgeSnackbarAction.vue";
import type { BridgeSnackbarItemProps } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { Snackbar } from "@/Components/Snackbar";

const props = defineProps<BridgeSnackbarItemProps>();

const {
  actions,
  actionsPlacement = "bottom",
  ...entrySnackbar
} = props.entry.props;

const hasActions = computed(() => {
  return Boolean(actions?.accept?.label || actions?.reject?.label);
});

const hasRight = computed(() => {
  return hasActions.value && actionsPlacement === "right";
});

const snackbarProps = computed(() => {
  const merged = mergeLayerShellProps(props.hostSnackbar, entrySnackbar);

  // Right-column actions already dismiss the snackbar, so the close
  // button is hidden unless the entry asks for it explicitly.
  if (hasRight.value && entrySnackbar.closeButton === undefined) {
    return { ...merged, closeButton: false };
  }

  return merged;
});

const snackbarColor = computed(() => {
  return (snackbarProps.value.color ?? "primary") as keyof SnackbarColor;
});

const snackbarRounded = computed(() => {
  return snackbarProps.value.rounded ?? "lg";
});

const dismissFromSnackbar = () => {
  props.api.close(props.entry.id);
};

function runAction(handler?: () => void) {
  handler?.();
  props.api.close(props.entry.id);
}

const hasInlineActions = computed(() => {
  return hasActions.value && actionsPlacement === "bottom";
});

const hasTrailing = computed(() => {
  return actionsPlacement === "trailing" && Boolean(actions?.accept?.label);
});
</script>

<template>
  <Snackbar
    :stack-id="entry.id"
    v-bind="snackbarProps"
    :teleport-to="false"
    :model-value="entry.show"
    v-on:close="dismissFromSnackbar"
    v-on:update:model-value="api.syncShow(entry.id, $event)"
    v-on:leave-complete="
      () =>
        completeLayerHide(api.entries.value, entry.id, false, api.removeEntry)
    "
  >
    <template #actions v-if="hasInlineActions">
      <div class="flex items-center gap-x-2">
        <BridgeSnackbarAction
          role="accept"
          layout="inline"
          :action="actions.accept"
          v-if="actions?.accept?.label"
          :snackbar-color="snackbarColor"
          :snackbar-rounded="snackbarRounded"
          v-on:run="runAction(actions?.accept?.onClick)"
        />

        <BridgeSnackbarAction
          role="reject"
          layout="inline"
          :action="actions.reject"
          v-if="actions?.reject?.label"
          :snackbar-color="snackbarColor"
          :snackbar-rounded="snackbarRounded"
          v-on:run="runAction(actions?.reject?.onClick)"
        />
      </div>
    </template>

    <template #trailing v-if="hasTrailing">
      <BridgeSnackbarAction
        role="accept"
        layout="trailing"
        :action="actions!.accept!"
        :snackbar-color="snackbarColor"
        :snackbar-rounded="snackbarRounded"
        v-on:run="runAction(actions?.accept?.onClick)"
      />
    </template>

    <template #right v-if="hasRight">
      <div
        class="flex flex-col min-w-20 border-l border-dark-200 dark:border-dark-700"
      >
        <div
          class="flex flex-1 h-0"
          v-if="actions?.accept?.label"
          :class="{
            'border-b border-dark-200 dark:border-dark-700': actions?.reject,
          }"
        >
          <BridgeSnackbarAction
            role="accept"
            layout="right-accept"
            :action="actions.accept"
            :snackbar-color="snackbarColor"
            :snackbar-rounded="snackbarRounded"
            :has-reject="Boolean(actions?.reject)"
            v-on:run="runAction(actions?.accept?.onClick)"
          />
        </div>

        <div class="flex flex-1 h-0" v-if="actions?.reject?.label">
          <BridgeSnackbarAction
            role="reject"
            layout="right-reject"
            :action="actions.reject"
            :snackbar-color="snackbarColor"
            :snackbar-rounded="snackbarRounded"
            :has-accept="Boolean(actions?.accept)"
            v-on:run="runAction(actions?.reject?.onClick)"
          />
        </div>
      </div>
    </template>
  </Snackbar>
</template>
