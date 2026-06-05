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
  action: DialogAction;
  role: "accept" | "reject";
  acceptColor: keyof ButtonColor;
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
    v-if="action.link"
    size="sm"
    underline="hover"
    :color="color"
    v-bind="action.link"
    :classes="{
      ...action.link.classes,
      root: cn(action.className, action.link.classes?.root),
    }"
    v-on:click="onLinkClick"
  >
    {{ action.label }}
  </Link>

  <Button
    v-else
    size="sm"
    :color="color"
    :variant="action.solid ? 'outline' : 'flat'"
    v-bind="action.button"
    :classes="{
      ...action.button?.classes,
      root: cn(action.className, action.button?.classes?.root),
    }"
    v-on:click="onRun"
  >
    {{ action.label }}
  </Button>
</template>
