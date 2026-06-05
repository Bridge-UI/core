<script setup lang="ts">
// ** External Imports
import { completeLayerHide, invokeLayerDismiss } from "@bridge-ui/core";
import { computed } from "vue";

// ** Local Imports
import type {
  BridgeSnackbarController,
  BridgeSnackbarEntry,
} from "@/Actions/Snackbar/bridgeSnackbar.types";
import { Snackbar } from "@/Components/Snackbar";

const props = defineProps<{
  api: BridgeSnackbarController;
  entry: BridgeSnackbarEntry;
}>();

const { actions, rightButtons, ...snackbarProps } = props.entry.props;

const dismiss = () => {
  invokeLayerDismiss(props.api.entries.value, props.entry.id);
};

function runAction(handler?: () => void) {
  handler?.();
  dismiss();
}

const hasRight = computed(() => {
  return Boolean(rightButtons && (actions?.accept || actions?.reject));
});

const hasInlineActions = computed(() => {
  return (
    !snackbarProps.dense &&
    !rightButtons &&
    Boolean(actions?.accept || actions?.reject)
  );
});

const hasTrailing = computed(() => {
  return Boolean(snackbarProps.dense && actions?.accept?.label);
});
</script>

<template>
  <Snackbar
    v-bind="snackbarProps"
    :stack-id="entry.id"
    :model-value="entry.show"
    :teleport-to="false"
    v-on:close="dismiss"
    v-on:update:model-value="api.syncShow(entry.id, $event)"
    :on-show-change="
      (show) =>
        completeLayerHide(api.entries.value, entry.id, show, api.removeEntry)
    "
  >
    <template v-if="hasInlineActions" #actions>
      <button
        v-if="actions?.accept?.label"
        type="button"
        class="cursor-pointer text-sm font-medium rounded-md focus:outline-hidden"
        :class="[
          !actions?.accept?.class &&
            'text-primary-600 hover:text-primary-500 dark:text-primary-400',
          actions?.accept?.class,
          actions?.accept?.solid && 'px-3 py-2 border shadow-xs',
        ]"
        @click="runAction(actions?.accept?.onClick)"
      >
        {{ actions.accept.label }}
      </button>

      <button
        v-if="actions?.reject?.label"
        type="button"
        class="cursor-pointer text-sm font-medium rounded-md focus:outline-hidden"
        :class="[
          !actions?.reject?.class &&
            'text-dark-700 hover:text-dark-500 dark:text-dark-400',
          actions?.reject?.class,
          actions?.reject?.solid &&
            'px-3 py-2 border border-dark-300 shadow-xs',
        ]"
        @click="runAction(actions?.reject?.onClick)"
      >
        {{ actions.reject.label }}
      </button>
    </template>

    <template v-if="hasTrailing" #trailing>
      <button
        type="button"
        class="cursor-pointer mr-4 text-sm font-medium rounded-md shrink-0 focus:outline-hidden"
        :class="[
          !actions?.accept?.class &&
            'text-primary-600 hover:text-primary-500 dark:text-primary-400',
          actions?.accept?.class,
        ]"
        @click="runAction(actions?.accept?.onClick)"
      >
        {{ actions?.accept?.label }}
      </button>
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
          <button
            type="button"
            class="cursor-pointer flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-none rounded-tr-lg focus:outline-hidden"
            :class="[
              !actions?.accept?.class &&
                'text-primary-600 hover:text-primary-500 hover:bg-dark-50 dark:hover:bg-dark-700',
              actions?.accept?.class,
              !actions?.reject && 'rounded-br-lg',
            ]"
            @click="runAction(actions?.accept?.onClick)"
          >
            {{ actions.accept.label }}
          </button>
        </div>

        <div v-if="actions?.reject?.label" class="flex flex-1 h-0">
          <button
            type="button"
            class="cursor-pointer flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-none rounded-br-lg focus:outline-hidden"
            :class="[
              !actions?.reject?.class &&
                'text-dark-700 hover:text-dark-500 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700',
              actions?.reject?.class,
              !actions?.accept && 'rounded-tr-lg',
            ]"
            @click="runAction(actions?.reject?.onClick)"
          >
            {{ actions.reject.label }}
          </button>
        </div>
      </div>
    </template>
  </Snackbar>
</template>
