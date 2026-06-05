<script setup lang="ts">
// ** External Imports
import {
  completeLayerHide,
  invokeLayerDismiss,
  mergeLayerShellProps,
  type SnackbarColor,
} from "@bridge-ui/core";
import { computed } from "vue";

// ** Local Imports
import BridgeSnackbarAction from "@/Actions/Snackbar/BridgeSnackbarAction.vue";
import type {
  BridgeSnackbarController,
  BridgeSnackbarEntry,
  BridgeSnackbarShellProps,
} from "@/Actions/Snackbar/bridgeSnackbar.types";
import { Snackbar } from "@/Components/Snackbar";

const props = defineProps<{
  api: BridgeSnackbarController;
  entry: BridgeSnackbarEntry;
  hostSnackbar?: BridgeSnackbarShellProps;
}>();

const { actions, rightButtons, ...entrySnackbar } = props.entry.props;

const snackbarProps = computed(() => {
  return mergeLayerShellProps(props.hostSnackbar, entrySnackbar);
});

const snackbarColor = computed(() => {
  return (snackbarProps.value.color ?? "primary") as keyof SnackbarColor;
});

const dismissFromSnackbar = () => {
  invokeLayerDismiss(props.api.entries.value, props.entry.id);
};

function runAction(handler?: () => void) {
  handler?.();
  props.api.close(props.entry.id);
}

const hasRight = computed(() => {
  return Boolean(rightButtons && (actions?.accept || actions?.reject));
});

const hasInlineActions = computed(() => {
  return (
    !rightButtons &&
    !snackbarProps.value.dense &&
    Boolean(actions?.accept || actions?.reject)
  );
});

const hasTrailing = computed(() => {
  return Boolean(snackbarProps.value.dense && actions?.accept?.label);
});
</script>

<template>
  <Snackbar
    :stack-id="entry.id"
    :teleport-to="false"
    v-bind="snackbarProps"
    :model-value="entry.show"
    v-on:close="dismissFromSnackbar"
    v-on:update:model-value="api.syncShow(entry.id, $event)"
    :on-show-change="
      (show) =>
        completeLayerHide(api.entries.value, entry.id, show, api.removeEntry)
    "
  >
    <template v-if="hasInlineActions" #actions>
      <BridgeSnackbarAction
        role="accept"
        layout="inline"
        :action="actions.accept"
        v-if="actions?.accept?.label"
        :snackbar-color="snackbarColor"
        v-on:run="runAction(actions?.accept?.onClick)"
      />

      <BridgeSnackbarAction
        role="reject"
        layout="inline"
        :action="actions.reject"
        v-if="actions?.reject?.label"
        :snackbar-color="snackbarColor"
        v-on:run="runAction(actions?.reject?.onClick)"
      />
    </template>

    <template v-if="hasTrailing" #trailing>
      <BridgeSnackbarAction
        role="accept"
        layout="trailing"
        :action="actions!.accept!"
        :snackbar-color="snackbarColor"
        v-on:run="runAction(actions?.accept?.onClick)"
      />
    </template>

    <template v-if="hasRight" #right>
      <div class="flex flex-col border-l border-dark-200 dark:border-dark-700">
        <div
          v-if="actions?.accept?.label"
          class="flex flex-1 h-0"
          :class="{
            'border-b border-dark-200 dark:border-dark-700': actions?.reject,
          }"
        >
          <BridgeSnackbarAction
            role="accept"
            layout="right-accept"
            :action="actions.accept"
            :snackbar-color="snackbarColor"
            :has-reject="Boolean(actions?.reject)"
            v-on:run="runAction(actions?.accept?.onClick)"
          />
        </div>

        <div v-if="actions?.reject?.label" class="flex flex-1 h-0">
          <BridgeSnackbarAction
            role="reject"
            layout="right-reject"
            :action="actions.reject"
            :snackbar-color="snackbarColor"
            :has-accept="Boolean(actions?.accept)"
            v-on:run="runAction(actions?.reject?.onClick)"
          />
        </div>
      </div>
    </template>
  </Snackbar>
</template>
