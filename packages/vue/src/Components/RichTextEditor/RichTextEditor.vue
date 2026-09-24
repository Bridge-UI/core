<script setup lang="ts">
// ** External Imports
import { ref, useTemplateRef } from "vue";

// ** Core Imports
import type { RichTextValue } from "@bridge-ui/core/Adapters";

// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import { Button } from "@/Components/Button";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { Menu } from "@/Components/Menu";
import { useRichTextEditor } from "@/Components/RichTextEditor/composables/useRichTextEditor";
import type {
  RichTextEditorEmits,
  RichTextEditorOwnProps,
  RichTextEditorSlots,
} from "@/Components/RichTextEditor/richTextEditor.types";
import { TextField } from "@/Components/TextField";
import { hasNamedSlot, presentSlotNames, useOptionalModel } from "@/Utils";

defineSlots<RichTextEditorSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<RichTextValue>();

const emit = defineEmits<RichTextEditorEmits>();

const props = withDefaults(defineProps<RichTextEditorOwnProps>(), {
  showErrorIcon: true,
});

const contentRef = useTemplateRef<HTMLDivElement>("content");

const uncontrolledValue = ref<undefined | RichTextValue>(props.defaultValue);

const value = useOptionalModel(model, uncontrolledValue);

const {
  slots,
  tools,
  linkHref,
  linkOpen,
  formField,
  linkAnchor,
  contentBind,
  confirmLink,
  onToolClick,
  toolbarBind,
  showToolbar,
  linkUrlLabel,
  canConfirmLink,
  closeLinkEditor,
  getToolbarButtonBind,
} = useRichTextEditor(props, value, emit, contentRef);
</script>

<template>
  <FormField :field="formField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(FORM_FIELD_CHROME_SLOT_NAMES, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <template v-if="showToolbar">
        <slot
          name="toolbar"
          :tools="tools"
          v-if="hasNamedSlot(slots, 'toolbar')"
        />

        <div v-else v-bind="toolbarBind">
          <Button
            :key="tool"
            v-for="tool in tools"
            v-on:mousedown.prevent
            v-bind="getToolbarButtonBind(tool)"
            v-on:click="onToolClick(tool, $event)"
          />
        </div>
      </template>

      <div ref="content" v-bind="contentBind" />
    </div>

    <Menu v-model="linkOpen" :anchor-el="linkAnchor" placement="bottom-start">
      <div class="flex w-64 flex-col">
        <div class="p-1.5">
          <TextField
            size="sm"
            type="url"
            class="w-full"
            v-model="linkHref"
            autocomplete="off"
            hide-error-message
            :aria-label="linkUrlLabel"
            :placeholder="linkUrlLabel"
          />
        </div>

        <div
          class="flex items-center justify-end gap-2 border-t border-dark-100 bg-dark-50 px-3 py-2 dark:border-dark-800 dark:bg-dark-950/40"
        >
          <ActionFooter
            v-on:apply="confirmLink"
            v-on:cancel="closeLinkEditor"
            :custom-props="{
              cancelButton: { size: 'sm' },
              applyButton: { size: 'sm', disabled: !canConfirmLink },
            }"
          />
        </div>
      </div>
    </Menu>
  </FormField>
</template>
