<script setup lang="ts">
// ** External Imports
import {
  completeLayerHide,
  invokeLayerDismiss,
  mergeLayerShellProps,
  type ButtonColor,
} from "@bridge-ui/core";
import { computed } from "vue";

// ** Local Imports
import BridgeDialogAction from "@/Actions/Dialog/BridgeDialogAction.vue";
import type {
  BridgeDialogController,
  BridgeDialogEntry,
  BridgeDialogShellProps,
} from "@/Actions/Dialog/bridgeDialog.types";
import { Card } from "@/Components/Card";
import { Modal } from "@/Components/Modal";

const props = defineProps<{
  api: BridgeDialogController;
  entry: BridgeDialogEntry;
  hostModal?: BridgeDialogShellProps;
}>();

const acceptColor = computed(() => {
  return (props.entry.props.color ?? "primary") as keyof ButtonColor;
});

const modalProps = computed(() => {
  return mergeLayerShellProps(props.hostModal, props.entry.modal);
});

const dismissFromModal = () => {
  invokeLayerDismiss(props.api.entries.value, props.entry.id);
};

function runAction(handler?: () => void) {
  handler?.();
  props.api.close(props.entry.id);
}

const hasFooter = computed(() => {
  return Boolean(
    props.entry.props.actions?.accept || props.entry.props.actions?.reject,
  );
});
</script>

<template>
  <Modal
    v-bind="modalProps"
    :stack-id="entry.id"
    :model-value="entry.show"
    v-on:close="dismissFromModal"
    v-on:update:model-value="api.syncShow(entry.id, $event)"
    :on-show-change="
      (show) =>
        completeLayerHide(api.entries.value, entry.id, show, api.removeEntry)
    "
  >
    <Card :title="entry.props.title" v-bind="entry.props.card">
      <p
        v-if="entry.props.description"
        class="text-sm text-dark-500 dark:text-dark-400"
      >
        {{ entry.props.description }}
      </p>

      <template v-if="hasFooter" #footer>
        <div class="flex justify-end gap-2">
          <BridgeDialogAction
            v-if="entry.props.actions?.reject?.label"
            role="reject"
            :action="entry.props.actions.reject"
            :accept-color="acceptColor"
            v-on:run="runAction(entry.props.actions?.reject?.onClick)"
          />

          <BridgeDialogAction
            v-if="entry.props.actions?.accept?.label"
            role="accept"
            :action="entry.props.actions.accept"
            :accept-color="acceptColor"
            v-on:run="runAction(entry.props.actions?.accept?.onClick)"
          />
        </div>
      </template>
    </Card>
  </Modal>
</template>
