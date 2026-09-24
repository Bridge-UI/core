<script setup lang="ts">
// ** External Imports
import { ref, useTemplateRef } from "vue";

// ** Core Imports
import type { RichTextValue } from "@bridge-ui/core/Adapters";

// ** Local Imports
import { Button } from "@/Components/Button";
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { useRichTextEditor } from "@/Components/RichTextEditor/composables/useRichTextEditor";
import type {
  RichTextEditorEmits,
  RichTextEditorOwnProps,
  RichTextEditorSlots,
} from "@/Components/RichTextEditor/richTextEditor.types";
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
  runTool,
  formField,
  contentBind,
  toolbarBind,
  showToolbar,
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
            v-on:click="runTool(tool)"
            v-bind="getToolbarButtonBind(tool)"
          />
        </div>
      </template>

      <div ref="content" v-bind="contentBind" />
    </div>
  </FormField>
</template>
