<script setup lang="ts">
// ** External Imports
import type { ButtonColor } from "@bridge-ui/core";
import { computed } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import type { DialogAction } from "@/Actions/Dialog/bridgeDialog.types";
import { Button } from "@/Components/Button";
import { Link } from "@/Components/Link";

const props = defineProps<{
  acceptColor: keyof ButtonColor;
  action: DialogAction;
  role: "accept" | "reject";
}>();

const emit = defineEmits<{
  run: [];
}>();

const color = computed(() => {
  return props.role === "accept" ? props.acceptColor : "secondary";
});

function onRun() {
  emit("run");
}

function onLinkClick(event: MouseEvent) {
  event.preventDefault();
  props.action.link?.onClick?.(event);
  onRun();
}
</script>

<template>
  <Link
    size="sm"
    :color="color"
    underline="hover"
    v-if="action.link"
    v-bind="action.link"
    v-on:click="onLinkClick"
    :classes="{
      ...action.link.classes,
      root: cn(action.className, action.link.classes?.root),
    }"
  >
    {{ action.label }}
  </Link>

  <Button
    v-else
    size="sm"
    :color="color"
    v-on:click="onRun"
    v-bind="action.button"
    :variant="action.solid ? 'outline' : 'flat'"
    :classes="{
      ...action.button?.classes,
      root: cn(action.className, action.button?.classes?.root),
    }"
  >
    {{ action.label }}
  </Button>
</template>
