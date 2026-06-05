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
import ResolveBridgeDialogFooter from "@/Actions/Dialog/ResolveBridgeDialogFooter.vue";
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

const dismissFromAction = () => {
  props.api.close(props.entry.id);
};
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

      <template
        #footer
        v-if="entry.props.actions?.accept || entry.props.actions?.reject"
      >
        <ResolveBridgeDialogFooter
          :accept-color="acceptColor"
          :dismiss="dismissFromAction"
          :actions="entry.props.actions"
        />
      </template>
    </Card>
  </Modal>
</template>
