<script setup lang="ts">
// ** External Imports
import { PropType, toRefs } from "vue";

// ** Local Imports
import { type UseFormFieldReturn } from "@/Components/FormField/composables/useFormField";

const props = defineProps({
  api: {
    required: true,
    type: Object as PropType<UseFormFieldReturn>,
  },
});

const { api } = toRefs(props);
</script>

<template>
  <div>
    {{
      JSON.stringify({
        slots: api.slots,
        merged: api.merged.value,
        rootBind: api.rootBind.value,
        controlId: api.controlId.value,
        errorBind: api.errorBind.value,
        labelBind: api.labelBind.value,
        inputBind: api.inputBind.value,
        cornerBind: api.cornerBind.value,
        headerBind: api.headerBind.value,
        isDisabled: api.isDisabled.value,
        isReadonly: api.isReadonly.value,
        variantKey: api.variantKey.value,
        invalidated: api.invalidated.value,
        requiredBind: api.requiredBind.value,
        ariaDescribedBy: api.ariaDescribedBy.value,
        descriptionBind: api.descriptionBind.value,
      })
    }}
  </div>
</template>
