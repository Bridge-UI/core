<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Core Imports
import { cn, type LinkColor } from "@bridge-ui/core";

// ** Local Imports
import type { BridgeDialogActionProps } from "@/Actions/Dialog/bridgeDialog.types";
import { Button } from "@/Components/Button";
import { Link } from "@/Components/Link";

const props = defineProps<BridgeDialogActionProps>();

const emit = defineEmits<{
  run: [];
}>();

const buttonColor = computed(() => {
  return props.role === "accept" ? props.acceptColor : "secondary";
});

const linkColor = computed(() => {
  return buttonColor.value as keyof LinkColor;
});

const linkProps = computed(() => {
  if (!props.action.link) {
    return {};
  }

  const { onClick: _onClick, ...rest } = props.action.link;

  return rest;
});

function onRun() {
  emit("run");
}

function onLinkClick(event: PointerEvent) {
  event.preventDefault();
  props.action.link?.onClick?.(event);
  onRun();
}
</script>

<template>
  <Link
    size="sm"
    underline="hover"
    :color="linkColor"
    v-if="action.link"
    v-bind="linkProps"
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
    v-on:click="onRun"
    :color="buttonColor"
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
