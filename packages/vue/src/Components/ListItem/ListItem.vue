<script setup lang="ts">
// ** External Imports
import { computed, useSlots } from "vue";

// ** Local Imports
import Icon from "@/Components/Icon/Icon.vue";
import {
  resolveListItemPrimary,
  useListItem,
} from "@/Components/ListItem/composables/useListItem";
import type {
  ListItemOwnProps,
  ListItemSlots,
} from "@/Components/ListItem/listItem.types";
import { hasNamedSlot, resolveNamedSlot, resolveSlotOrProp } from "@/Utils";

defineSlots<ListItemSlots>();

const slots = useSlots();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ListItemOwnProps>(), {
  as: "li",
  role: "button",
  divider: false,
  align: "center",
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
} = useListItem(props, { role: "button", align: "center" }, slots);

const rootTag = computed(() => {
  return merged.value.as ?? "li";
});

const primaryContent = computed(() => {
  return resolveListItemPrimary(slots, props.primary);
});

const secondaryContent = computed(() => {
  return resolveSlotOrProp(slots, "secondary", props.secondary);
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
          <component :is="resolveNamedSlot(slots, 'start')" />
        </div>

        <div v-bind="contentBind">
          <span v-if="hasPrimary" v-bind="primaryBind">
            <component :is="primaryContent" />
          </span>

          <span v-if="hasSecondary" v-bind="secondaryBind">
            <component :is="secondaryContent" />
          </span>
        </div>

        <div v-if="hasEnd" v-bind="endBind">
          <component v-if="hasEndSlot" :is="resolveNamedSlot(slots, 'end')" />

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
        <component :is="resolveNamedSlot(slots, 'start')" />
      </div>

      <div v-bind="contentBind">
        <span v-if="hasPrimary" v-bind="primaryBind">
          <component :is="primaryContent" />
        </span>

        <span v-if="hasSecondary" v-bind="secondaryBind">
          <component :is="secondaryContent" />
        </span>
      </div>

      <div v-if="hasEnd" v-bind="endBind">
        <component v-if="hasEndSlot" :is="resolveNamedSlot(slots, 'end')" />

        <Icon
          v-bind="selectedIconBind"
          :icon="resolvedSelectedIcon"
          v-else-if="resolvedSelectedIcon"
        />
      </div>
    </div>
  </component>
</template>
