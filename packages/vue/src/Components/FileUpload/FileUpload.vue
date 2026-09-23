<script setup lang="ts">
// ** External Imports
import { computed, ref } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { useFileUpload } from "@/Components/FileUpload/composables/useFileUpload";
import type {
  FileUploadEmits,
  FileUploadOwnProps,
  FileUploadSlots,
} from "@/Components/FileUpload/fileUpload.types";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, isPropPresent, useOptionalModel } from "@/Utils";

defineSlots<FileUploadSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<FileUploadEmits>();

const model = defineModel<File[] | undefined>();

const props = withDefaults(defineProps<FileUploadOwnProps>(), {
  size: "md",
  multiple: false,
  variant: "button",
});

const uncontrolledFiles = ref<File[]>(props.defaultValue ?? []);

const files = useOptionalModel(model, uncontrolledFiles);

const {
  slots,
  merged,
  rootBind,
  listBind,
  inputRef,
  labelBind,
  inputBind,
  errorBind,
  mediaBind,
  titleBind,
  fileItems,
  showError,
  isDropzone,
  showPicker,
  actionsBind,
  contentBind,
  triggerBind,
  getItemBind,
  buttonLabel,
  dropzoneBind,
  openFileDialog,
  descriptionBind,
  itemDescriptionBind,
  resolvedErrorMessage,
} = useFileUpload(
  props,
  {
    size: "md",
    multiple: false,
    variant: "button",
  },
  files,
  emit,
);

const showHelperDescription = computed(() => {
  return (
    !showError.value &&
    !isDropzone.value &&
    (hasNamedSlot(slots, "description") ||
      isPropPresent(merged.value.description))
  );
});

function onTriggerKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openFileDialog();
  }
}
</script>

<template>
  <div v-bind="rootBind">
    <input ref="inputRef" v-bind="inputBind" />

    <label
      v-bind="labelBind"
      v-if="isPropPresent(merged.label) || hasNamedSlot(slots, 'label')"
    >
      <slot name="label" v-if="hasNamedSlot(slots, 'label')" />

      <template v-else-if="isPropPresent(merged.label)">
        {{ merged.label }}
      </template>

      <span
        aria-hidden="true"
        v-if="merged.required"
        class="text-error-600 dark:text-error-400"
      >
        *
      </span>
    </label>

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
          :disabled="merged.disabled"
          v-on:click="openFileDialog"
        >
          {{ buttonLabel }}
        </Button>
      </div>
    </template>

    <ul v-bind="listBind" v-if="fileItems.length > 0">
      <li
        v-for="item in fileItems"
        v-bind="getItemBind(item.index)"
        :key="`${item.file.name}-${item.index}`"
      >
        <slot name="item" v-bind="item" v-if="hasNamedSlot(slots, 'item')" />

        <template v-else>
          <div v-bind="mediaBind">
            <img
              alt=""
              :src="item.previewUrl"
              v-if="item.isImage && item.previewUrl"
            />

            <Icon v-else icon="download" />
          </div>

          <div v-bind="contentBind">
            <p v-bind="titleBind">{{ item.file.name }}</p>
            <p v-bind="itemDescriptionBind">{{ item.metaLabel }}</p>
          </div>

          <div v-bind="actionsBind">
            <Button
              size="sm"
              icon="clear"
              type="button"
              variant="flat"
              density="mini"
              v-on:click="item.remove"
              :disabled="merged.disabled"
              :aria-label="`Remove ${item.file.name}`"
            />
          </div>
        </template>
      </li>
    </ul>

    <p v-bind="descriptionBind" v-if="showHelperDescription">
      <slot name="description" v-if="hasNamedSlot(slots, 'description')" />

      <template v-else-if="isPropPresent(merged.description)">
        {{ merged.description }}
      </template>
    </p>

    <p v-if="showError" v-bind="errorBind">
      <slot name="errorMessage" v-if="hasNamedSlot(slots, 'errorMessage')" />

      <template v-else>
        {{ resolvedErrorMessage }}
      </template>
    </p>
  </div>
</template>
