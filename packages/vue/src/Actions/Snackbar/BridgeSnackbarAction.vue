<script setup lang="ts">
// ** External Imports
import { get } from "es-toolkit/compat";
import { computed } from "vue";

// ** Core Imports
import { cn, type LinkColor } from "@bridge-ui/core";

// ** Local Imports
import type { BridgeSnackbarActionProps } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { Button } from "@/Components/Button";
import { Link } from "@/Components/Link";

const props = defineProps<BridgeSnackbarActionProps>();

const emit = defineEmits<{
  run: [];
}>();

const buttonColor = computed(() => {
  return props.role === "accept" ? props.snackbarColor : "secondary";
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

const layoutClass = computed(() => {
  const rootClass = {
    trailing: "mr-4 shrink-0",
    "right-accept": cn({
      "w-full rounded-none rounded-tr-lg": true,
      "rounded-br-lg": !props.hasReject,
    }),
    "right-reject": cn({
      "w-full rounded-none rounded-br-lg": true,
      "rounded-tr-lg": !props.hasAccept,
    }),
  };

  return get(rootClass, props.layout, "");
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
      root: cn(rootClass, action.link.classes?.root),
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
      root: cn(rootClass, action.button?.classes?.root),
    }"
  >
    {{ action.label }}
  </Button>
</template>
