<script setup lang="ts">
// ** Local Imports
import type {
  ActionFooterEmits,
  ActionFooterOwnProps,
} from "@/Components/ActionFooter/actionFooter.types";
import { useActionFooter } from "@/Components/ActionFooter/composables/useActionFooter";
import { Button } from "@/Components/Button";

defineOptions({ inheritAttrs: false });

const emit = defineEmits<ActionFooterEmits>();

const props = defineProps<ActionFooterOwnProps>();

const { rootBind, applyLabel, cancelLabel, applyButtonBind, cancelButtonBind } =
  useActionFooter(
    props,
    {
      applyColor: "primary",
      cancelVariant: "flat",
      cancelColor: "secondary",
    },
    emit,
  );
</script>

<template>
  <div v-bind="rootBind">
    <Button v-bind="cancelButtonBind">
      {{ cancelLabel }}
    </Button>

    <Button v-bind="applyButtonBind">
      {{ applyLabel }}
    </Button>
  </div>
</template>
