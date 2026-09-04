<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type {
  ButtonOwnProps,
  ButtonSlots,
} from "@/Components/Button/button.types";
import { useButton } from "@/Components/Button/composables/useButton";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, isPropPresent } from "@/Utils";

defineSlots<ButtonSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<ButtonOwnProps>();

const slots = useSlots();

const {
  tag,
  merged,
  isMini,
  iconBind,
  rootBind,
  rootHref,
  rootType,
  endIconBind,
  contentBind,
  endSlotBind,
  rootAriaBusy,
  rootDisabled,
  startIconBind,
  startSlotBind,
  loadingIconBind,
  loadingWrapBind,
  rootAriaDisabled,
} = useButton(props, {
  size: "md",
  as: "button",
  rounded: "md",
  color: "primary",
  variant: "solid",
  density: "default",
});
</script>

<template>
  <component
    :is="tag"
    :href="rootHref"
    v-bind="rootBind"
    :type="rootType"
    :disabled="rootDisabled"
    :aria-busy="rootAriaBusy"
    :aria-disabled="rootAriaDisabled"
  >
    <span v-if="merged.loading" v-bind="loadingWrapBind">
      <Icon icon="loader" :size="merged.size" v-bind="loadingIconBind" />
    </span>

    <span v-bind="contentBind">
      <template v-if="isMini">
        <slot v-if="hasNamedSlot(slots, 'default')" />

        <Icon
          v-bind="iconBind"
          :icon="merged.icon"
          :size="merged.size"
          v-else-if="merged.icon"
        />
      </template>

      <template v-else>
        <Icon
          :size="merged.size"
          v-bind="startIconBind"
          v-if="merged.startIcon"
          :icon="merged.startIcon"
        />

        <div v-bind="startSlotBind" v-else-if="hasNamedSlot(slots, 'start')">
          <slot name="start" />
        </div>

        <template v-if="isPropPresent(merged.text)">{{ merged.text }}</template>

        <slot v-else-if="hasNamedSlot(slots, 'default')" />

        <Icon
          :size="merged.size"
          v-bind="endIconBind"
          v-if="merged.endIcon"
          :icon="merged.endIcon"
        />

        <div v-bind="endSlotBind" v-else-if="hasNamedSlot(slots, 'end')">
          <slot name="end" />
        </div>
      </template>
    </span>
  </component>
</template>
