<script setup lang="ts" generic="Multiple extends boolean = false">
// ** External Imports
import { computed, provide, ref, type WritableComputedRef } from "vue";

// ** Core Imports
import {
  getFileUploadItemKey,
  type FileUploadModel,
  type FileUploadValue,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import { BASE_FIELD_CHROME_SLOT_NAMES } from "@/Components/BaseField";
import BaseField from "@/Components/BaseField/BaseField.vue";
import { Button } from "@/Components/Button";
import { useFileUpload } from "@/Components/FileUpload/composables/useFileUpload";
import type {
  FileUploadEmits,
  FileUploadOwnProps,
  FileUploadSlots,
} from "@/Components/FileUpload/fileUpload.types";
import { FILE_UPLOAD_KEY } from "@/Components/FileUpload/fileUploadInjectionKey";
import FileUploadItem from "@/Components/FileUpload/FileUploadItem.vue";
import { Icon } from "@/Components/Icon";
import {
  hasNamedSlot,
  isPropPresent,
  presentSlotNames,
  useOptionalModel,
} from "@/Utils";

defineSlots<FileUploadSlots>();

defineOptions({ inheritAttrs: false });

type FileUploadBoundModel = Multiple extends true
  ? FileUploadValue[]
  : null | FileUploadValue;

const emit = defineEmits<FileUploadEmits>();

const model = defineModel<FileUploadBoundModel>();

const props = defineProps<FileUploadOwnProps<Multiple>>();

const uncontrolled = ref<FileUploadBoundModel>(
  props.defaultValue ?? (null as FileUploadBoundModel),
);

const selection = useOptionalModel(model, uncontrolled);

const {
  slots,
  merged,
  listBind,
  inputRef,
  baseField,
  inputBind,
  mediaBind,
  titleBind,
  fileItems,
  isDropzone,
  showPicker,
  actionsBind,
  contentBind,
  triggerBind,
  getItemBind,
  buttonLabel,
  dropzoneBind,
  openFileDialog,
  itemDescriptionBind,
} = useFileUpload(
  props as FileUploadOwnProps<boolean>,
  {
    size: "md",
    rounded: "md",
    multiple: false,
    color: "primary",
    variant: "button",
  },
  selection as WritableComputedRef<FileUploadModel>,
  emit,
);

provide(
  FILE_UPLOAD_KEY,
  computed(() => {
    return {
      getItemBind,
      color: merged.value.color,
      mediaBind: mediaBind.value,
      titleBind: titleBind.value,
      rounded: merged.value.rounded,
      actionsBind: actionsBind.value,
      contentBind: contentBind.value,
      disabled: merged.value.disabled,
      descriptionBind: itemDescriptionBind.value,
    };
  }),
);

function onTriggerKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openFileDialog();
  }
}
</script>

<template>
  <BaseField :field="baseField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(
        BASE_FIELD_CHROME_SLOT_NAMES.filter((slotName) => {
          return slotName !== 'start' && slotName !== 'end';
        }),
        $slots,
      )"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <div class="flex w-full flex-col">
      <input ref="inputRef" v-bind="inputBind" />

      <template v-if="showPicker">
        <div v-if="isDropzone" v-bind="dropzoneBind">
          <slot name="dropzone" v-if="hasNamedSlot(slots, 'dropzone')" />

          <template v-else>
            <Icon icon="inbox" class="mb-1 text-dark-400" />

            <p
              v-if="isPropPresent(merged.title)"
              class="m-0 font-medium text-dark-900 dark:text-dark-100"
            >
              {{ merged.title }}
            </p>

            <p
              v-if="isPropPresent(merged.description)"
              class="m-0 text-sm text-dark-500 dark:text-dark-400"
            >
              {{ merged.description }}
            </p>
          </template>
        </div>

        <div v-else v-bind="triggerBind">
          <span
            role="button"
            v-on:click="openFileDialog"
            v-on:keydown="onTriggerKeyDown"
            :tabindex="merged.disabled ? -1 : 0"
            v-if="hasNamedSlot(slots, 'trigger')"
          >
            <slot name="trigger" />
          </span>

          <Button
            v-else
            type="button"
            :size="merged.size"
            :color="merged.color"
            :rounded="merged.rounded"
            :disabled="merged.disabled"
            v-on:click="openFileDialog"
          >
            {{ buttonLabel }}
          </Button>
        </div>
      </template>

      <slot name="list" :items="fileItems" v-if="hasNamedSlot(slots, 'list')" />

      <ul v-bind="listBind" v-else-if="fileItems.length > 0">
        <template
          v-for="item in fileItems"
          :key="getFileUploadItemKey(item.value, item.index)"
        >
          <li
            v-bind="getItemBind(item.index)"
            v-if="hasNamedSlot(slots, 'item')"
          >
            <slot name="item" v-bind="item" />
          </li>

          <FileUploadItem v-else v-bind="item">
            <template #start v-if="hasNamedSlot(slots, 'start')">
              <slot name="start" v-bind="item" />
            </template>

            <template #end v-if="hasNamedSlot(slots, 'end')">
              <slot name="end" v-bind="item" />
            </template>
          </FileUploadItem>
        </template>
      </ul>
    </div>
  </BaseField>
</template>
