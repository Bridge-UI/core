<script setup lang="ts">
// ** External Imports
import { Loader2 } from "lucide-vue-next";
import { useSlots } from "vue";

// ** Local Imports
import type {
  ButtonOwnProps,
  ButtonSlots,
} from "@/Components/Button/button.types";
import { useButton } from "@/Components/Button/composables/useButton";
import { Icon } from "@/Components/Icon";
import { hasNamedSlot, isPropPresent, resolveNamedSlot } from "@/Utils";

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
  endSlotBind,
  rootAriaBusy,
  rootDisabled,
  startIconBind,
  startSlotBind,
  loadingIconBind,
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
    :type="rootType"
    :href="rootHref"
    v-bind="rootBind"
    :disabled="rootDisabled"
    :aria-busy="rootAriaBusy"
    :aria-disabled="rootAriaDisabled"
  >
    <Icon
      :icon="Loader2"
      :size="merged.size"
      v-if="merged.loading"
      v-bind="loadingIconBind"
    />

    <template v-else-if="isMini">
      <component
        v-if="hasNamedSlot(slots, 'default')"
        :is="resolveNamedSlot(slots, 'default')"
      />

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
        <component :is="resolveNamedSlot(slots, 'start')" />
      </div>

      <template v-if="isPropPresent(merged.text)">{{ merged.text }}</template>

      <component
        :is="resolveNamedSlot(slots, 'default')"
        v-else-if="hasNamedSlot(slots, 'default')"
      />

      <Icon
        :size="merged.size"
        v-bind="endIconBind"
        v-if="merged.endIcon"
        :icon="merged.endIcon"
      />

      <div v-bind="endSlotBind" v-else-if="hasNamedSlot(slots, 'end')">
        <component :is="resolveNamedSlot(slots, 'end')" />
      </div>
    </template>
  </component>
</template>
