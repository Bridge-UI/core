<script setup lang="ts">
// ** External Imports
import { get } from "es-toolkit/compat";
import { computed } from "vue";

// ** Core Imports
import type { LinkColor } from "@bridge-ui/core/Tokens/Link";
import { roundedProps as snackbarRoundedProps } from "@bridge-ui/core/Tokens/Snackbar";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { BridgeSnackbarActionProps } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { Button } from "@/Components/Button";
import { Link } from "@/Components/Link";
import { mergeNestedComponentProps } from "@/Utils";

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
  const rounded = props.snackbarRounded ?? "lg";
  const roundedClasses = get(snackbarRoundedProps, rounded);
  const topRightClass = get(roundedClasses, "tr");
  const bottomRightClass = get(roundedClasses, "br");

  const rootClass = {
    trailing: "mr-4 shrink-0",
    "right-accept": cn({
      "w-full rounded-none": true,
      [topRightClass ?? ""]: true,
      [bottomRightClass ?? ""]: !props.hasReject,
    }),
    "right-reject": cn({
      "w-full rounded-none": true,
      [bottomRightClass ?? ""]: true,
      [topRightClass ?? ""]: !props.hasAccept,
    }),
  };

  return get(rootClass, props.layout, "");
});

const layoutRootClass = computed(() => {
  return cn({
    [layoutClass.value]: true,
    [props.action.className ?? ""]: true,
  });
});

const linkBind = computed(() => {
  return mergeNestedComponentProps(linkProps.value, {
    classes: { root: layoutRootClass.value },
  });
});

const buttonBind = computed(() => {
  return mergeNestedComponentProps(props.action.button, {
    classes: {
      root: cn({
        [layoutRootClass.value]: true,
        "w-full":
          props.layout === "right-accept" || props.layout === "right-reject",
      }),
    },
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
    v-bind="linkBind"
    v-if="action.link"
    v-on:click="onLinkClick"
  >
    {{ action.label }}
  </Link>

  <Button
    v-else
    size="sm"
    v-on:click="onRun"
    :color="buttonColor"
    v-bind="buttonBind"
    :variant="action.solid ? 'outline' : 'flat'"
  >
    {{ action.label }}
  </Button>
</template>
