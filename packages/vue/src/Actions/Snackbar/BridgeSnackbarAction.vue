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
  hasReject?: boolean;
  hasAccept?: boolean;
  action: SnackbarAction;
  role: "accept" | "reject";
  layout: SnackbarActionLayout;
  snackbarColor: keyof SnackbarColor;
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
  return cn({
    [layoutClass.value]: true,
    [props.action.className ?? ""]: true,
    "w-full":
      props.layout === "right-accept" || props.layout === "right-reject",
  });
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
      root: cn(rootClass, action.link.classes?.root),
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
      root: cn(rootClass, action.button?.classes?.root),
    }"
  >
    {{ action.label }}
  </Button>
</template>
