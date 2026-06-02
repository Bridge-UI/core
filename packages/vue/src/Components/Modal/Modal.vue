<script setup lang="ts">
// ** Local Imports
import type { ModalProps, ModalSlots } from "@/Components/Modal";
import { useModal } from "@/Components/Modal";
import { resolveNamedSlot } from "@/Utils";

defineSlots<ModalSlots>();

const props = defineProps<ModalProps>();

const { slots, merged } = useModal(props, {
  size: "md",
  shadow: "lg",
  rounded: "md",
  modelValue: false,
  closeOnEscape: true,
  closeOnOverlay: true,
});
</script>

<template>
  <Teleport to="body">
    <div v-if="merged.modelValue" class="fixed inset-0 overflow-y-auto">
      <div class="fixed inset-0 bg-black/50" />

      <div
        class="flex min-h-full w-full items-end justify-center p-4 sm:items-center"
      >
        <div class="relative w-full max-w-lg">
          <component :is="resolveNamedSlot(slots, 'header')" />

          <component :is="resolveNamedSlot(slots, 'default')" />

          <component :is="resolveNamedSlot(slots, 'footer')" />

          <component :is="resolveNamedSlot(slots, 'close')" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
