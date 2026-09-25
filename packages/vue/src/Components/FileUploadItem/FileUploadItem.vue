<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import type { FileUploadItemSlots } from "@/Components/FileUpload/fileUpload.types";
import { useFileUploadItem } from "@/Components/FileUploadItem/composables/useFileUploadItem";
import type { FileUploadItemOwnProps } from "@/Components/FileUploadItem/fileUploadItem.types";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot } from "@/Utils";

defineSlots<FileUploadItemSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<FileUploadItemOwnProps>();

const slots = useSlots();

const {
  name,
  media,
  retry,
  color,
  remove,
  rounded,
  disabled,
  rootBind,
  showRetry,
  mediaBind,
  titleBind,
  contentBind,
  actionsBind,
  statusLabel,
  descriptionBind,
  showDescription,
} = useFileUploadItem(props);

const previewSrc = computed(() => {
  return media.value.kind === "image" ? media.value.src : undefined;
});

const iconName = computed(() => {
  return media.value.kind === "icon" ? media.value.icon : "download";
});

const iconSpin = computed(() => {
  return media.value.kind === "icon" && media.value.spin;
});

function onRetry() {
  retry.value?.();
}

function onRemove() {
  remove.value();
}
</script>

<template>
  <li v-bind="rootBind">
    <div class="flex shrink-0 items-center" v-if="hasNamedSlot(slots, 'start')">
      <slot name="start" v-bind="props" />
    </div>

    <div v-bind="mediaBind">
      <img alt="" :src="previewSrc" v-if="previewSrc" />

      <Icon
        v-else
        :icon="iconName"
        :class="iconSpin ? 'animate-spin' : undefined"
      />
    </div>

    <div v-bind="contentBind">
      <p v-bind="titleBind">{{ name }}</p>

      <p v-if="showDescription" v-bind="descriptionBind">{{ statusLabel }}</p>
    </div>

    <div v-bind="actionsBind">
      <Button
        size="sm"
        type="button"
        color="error"
        icon="refresh"
        variant="flat"
        density="mini"
        v-if="showRetry"
        :rounded="rounded"
        v-on:click="onRetry"
        :disabled="disabled"
        :aria-label="`Retry ${name}`"
      />

      <slot name="end" v-bind="props" v-if="hasNamedSlot(slots, 'end')" />

      <Button
        v-else
        size="sm"
        icon="clear"
        type="button"
        variant="flat"
        density="mini"
        :color="color"
        :rounded="rounded"
        :disabled="disabled"
        v-on:click="onRemove"
        :aria-label="`Remove ${name}`"
      />
    </div>
  </li>
</template>
