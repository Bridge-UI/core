<script setup lang="ts">
// ** External Imports
import type { SnackbarColor } from "@bridge-ui/core";
import { computed } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import type { SnackbarAction } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { Button } from "@/Components/Button";
import { Link } from "@/Components/Link";

type SnackbarActionLayout =
  | "inline"
  | "trailing"
  | "right-accept"
  | "right-reject";

const props = defineProps<{
  action: SnackbarAction;
  role: "accept" | "reject";
  layout: SnackbarActionLayout;
  snackbarColor: keyof SnackbarColor;
  hasReject?: boolean;
  hasAccept?: boolean;
}>();

const emit = defineEmits<{
  run: [];
}>();

const color = computed(() => {
  return props.role === "accept" ? props.snackbarColor : "secondary";
});

const layoutClass = computed(() => {
  switch (props.layout) {
    case "trailing":
      return "mr-4 shrink-0";
    case "right-accept":
      return cn(
        "w-full rounded-none rounded-tr-lg",
        !props.hasReject && "rounded-br-lg",
      );
    case "right-reject":
      return cn(
        "w-full rounded-none rounded-br-lg",
        !props.hasAccept && "rounded-tr-lg",
      );
    default:
      return "";
  }
});

const rootClass = computed(() => {
  return cn(
    layoutClass.value,
    props.action.className,
    props.layout === "right-accept" || props.layout === "right-reject"
      ? "w-full"
      : undefined,
  );
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
      root: cn(rootClass, action.link.classes?.root),
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
      root: cn(rootClass, action.button?.classes?.root),
    }"
    v-on:click="onRun"
  >
    {{ action.label }}
  </Button>
</template>
