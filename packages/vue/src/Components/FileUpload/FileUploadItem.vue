<script setup lang="ts">
// ** External Imports
import type { ClassValue } from "clsx";
import { computed, inject, useAttrs, useSlots } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { Button } from "@/Components/Button";
import type {
  FileUploadItemSlotProps,
  FileUploadItemSlots,
} from "@/Components/FileUpload/fileUpload.types";
import { FILE_UPLOAD_KEY } from "@/Components/FileUpload/fileUploadInjectionKey";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot } from "@/Utils";

defineSlots<FileUploadItemSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<FileUploadItemSlotProps>();

const attrs = useAttrs();

const slots = useSlots();

const context = inject(FILE_UPLOAD_KEY);

if (!context) {
  throw new Error("FileUploadItem must be used within FileUpload");
}

const itemBind = computed(() => {
  const bind = context.value.getItemBind(props.index);

  return {
    ...bind,
    ...attrs,
    class: cn(bind.class, attrs.class as ClassValue),
  };
});
</script>

<template>
  <li v-bind="itemBind">
    <div class="flex shrink-0 items-center" v-if="hasNamedSlot(slots, 'start')">
      <slot name="start" v-bind="props" />
    </div>

    <div v-bind="context.mediaBind">
      <img alt="" :src="previewUrl" v-if="isImage && previewUrl" />

      <Icon v-else icon="download" />
    </div>

    <div v-bind="context.contentBind">
      <p v-bind="context.titleBind">{{ value.name }}</p>

      <p v-bind="context.descriptionBind">{{ metaLabel }}</p>
    </div>

    <div v-bind="context.actionsBind">
      <slot name="end" v-bind="props" v-if="hasNamedSlot(slots, 'end')" />

      <Button
        v-else
        size="sm"
        icon="clear"
        type="button"
        variant="flat"
        density="mini"
        v-on:click="remove"
        :color="context.color"
        :rounded="context.rounded"
        :disabled="context.disabled"
        :aria-label="`Remove ${value.name}`"
      />
    </div>
  </li>
</template>
