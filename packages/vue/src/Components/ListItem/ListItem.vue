<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import Icon from "@/Components/Icon/Icon.vue";
import { useListItem } from "@/Components/ListItem/composables/useListItem";
import type {
  ListItemOwnProps,
  ListItemSlots,
} from "@/Components/ListItem/listItem.types";
import { hasNamedSlot, isPropPresent } from "@/Utils";

defineSlots<ListItemSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ListItemOwnProps>(), {
  as: "li",
  role: "button",
  divider: false,
  disabled: false,
  selected: false,
  interactive: false,
});

const {
  merged,
  hasEnd,
  endBind,
  rootBind,
  rowClass,
  hasStart,
  startBind,
  hasPrimary,
  contentBind,
  primaryBind,
  hasSecondary,
  secondaryBind,
  interactiveBind,
  selectedIconBind,
  resolvedSelectedIcon,
} = useListItem(props, { role: "button" }, slots);

const rootTag = computed(() => {
  return merged.value.as ?? "li";
});

const hasEndSlot = computed(() => {
  return hasNamedSlot(slots, "end");
});
</script>

<template>
  <component :is="rootTag" v-bind="rootBind">
    <div v-if="interactiveBind" v-bind="interactiveBind">
      <div :class="rowClass">
        <div v-if="hasStart" v-bind="startBind">
          <slot name="start" />
        </div>

        <div v-bind="contentBind">
          <span v-if="hasPrimary" v-bind="primaryBind">
            <slot name="primary" v-if="hasNamedSlot(slots, 'primary')" />

            <slot v-else-if="hasNamedSlot(slots, 'default')" />

            <template v-else-if="isPropPresent(merged.primary)">
              {{ merged.primary }}
            </template>
          </span>

          <span v-if="hasSecondary" v-bind="secondaryBind">
            <slot name="secondary" v-if="hasNamedSlot(slots, 'secondary')" />

            <template v-else-if="isPropPresent(merged.secondary)">
              {{ merged.secondary }}
            </template>
          </span>
        </div>

        <div v-if="hasEnd" v-bind="endBind">
          <slot name="end" v-if="hasEndSlot" />

          <Icon
            v-bind="selectedIconBind"
            :icon="resolvedSelectedIcon"
            v-else-if="resolvedSelectedIcon"
          />
        </div>
      </div>
    </div>

    <div v-else :class="rowClass">
      <div v-if="hasStart" v-bind="startBind">
        <slot name="start" />
      </div>

      <div v-bind="contentBind">
        <span v-if="hasPrimary" v-bind="primaryBind">
          <slot name="primary" v-if="hasNamedSlot(slots, 'primary')" />

          <slot v-else-if="hasNamedSlot(slots, 'default')" />

          <template v-else-if="isPropPresent(merged.primary)">
            {{ merged.primary }}
          </template>
        </span>

        <span v-if="hasSecondary" v-bind="secondaryBind">
          <slot name="secondary" v-if="hasNamedSlot(slots, 'secondary')" />

          <template v-else-if="isPropPresent(merged.secondary)">
            {{ merged.secondary }}
          </template>
        </span>
      </div>

      <div v-if="hasEnd" v-bind="endBind">
        <slot name="end" v-if="hasEndSlot" />

        <Icon
          v-bind="selectedIconBind"
          :icon="resolvedSelectedIcon"
          v-else-if="resolvedSelectedIcon"
        />
      </div>
    </div>
  </component>
</template>
