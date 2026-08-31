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
import Tooltip from "@/Components/Tooltip/Tooltip.vue";
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
  startBind,
  hasPrimary,
  contentBind,
  primaryBind,
  hasSecondary,
  secondaryBind,
  tooltipContent,
  interactiveBind,
  selectedIconBind,
  tooltipPlacement,
  resolvedSelectedIcon,
} = useListItem(props, { role: "button" }, slots);

const rootTag = computed(() => {
  return merged.value.as ?? "li";
});
</script>

<template>
  <component :is="rootTag" v-bind="rootBind">
    <Tooltip
      v-if="tooltipContent"
      :content="tooltipContent"
      :placement="tooltipPlacement"
      :classes="{ root: 'flex w-full min-w-0', trigger: 'flex w-full min-w-0' }"
    >
      <template #trigger>
        <div v-if="interactiveBind" v-bind="interactiveBind">
          <div :class="rowClass">
            <div v-bind="startBind" v-if="hasNamedSlot(slots, 'start')">
              <slot name="start" />
            </div>

            <div v-bind="contentBind" v-if="hasPrimary || hasSecondary">
              <span v-if="hasPrimary" v-bind="primaryBind">
                <slot name="primary" v-if="hasNamedSlot(slots, 'primary')" />

                <slot v-else-if="hasNamedSlot(slots, 'default')" />

                <template v-else-if="isPropPresent(merged.primary)">
                  {{ merged.primary }}
                </template>
              </span>

              <span v-if="hasSecondary" v-bind="secondaryBind">
                <slot
                  name="secondary"
                  v-if="hasNamedSlot(slots, 'secondary')"
                />

                <template v-else-if="isPropPresent(merged.secondary)">
                  {{ merged.secondary }}
                </template>
              </span>
            </div>

            <div v-if="hasEnd" v-bind="endBind">
              <slot name="end" v-if="hasNamedSlot(slots, 'end')" />

              <Icon
                v-bind="selectedIconBind"
                :icon="resolvedSelectedIcon"
                v-else-if="resolvedSelectedIcon"
              />
            </div>
          </div>
        </div>

        <div v-else :class="rowClass">
          <div v-bind="startBind" v-if="hasNamedSlot(slots, 'start')">
            <slot name="start" />
          </div>

          <div v-bind="contentBind" v-if="hasPrimary || hasSecondary">
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
            <slot name="end" v-if="hasNamedSlot(slots, 'end')" />

            <Icon
              v-bind="selectedIconBind"
              :icon="resolvedSelectedIcon"
              v-else-if="resolvedSelectedIcon"
            />
          </div>
        </div>
      </template>
    </Tooltip>

    <template v-else>
      <div v-if="interactiveBind" v-bind="interactiveBind">
        <div :class="rowClass">
          <div v-bind="startBind" v-if="hasNamedSlot(slots, 'start')">
            <slot name="start" />
          </div>

          <div v-bind="contentBind" v-if="hasPrimary || hasSecondary">
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
            <slot name="end" v-if="hasNamedSlot(slots, 'end')" />

            <Icon
              v-bind="selectedIconBind"
              :icon="resolvedSelectedIcon"
              v-else-if="resolvedSelectedIcon"
            />
          </div>
        </div>
      </div>

      <div v-else :class="rowClass">
        <div v-bind="startBind" v-if="hasNamedSlot(slots, 'start')">
          <slot name="start" />
        </div>

        <div v-bind="contentBind" v-if="hasPrimary || hasSecondary">
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
          <slot name="end" v-if="hasNamedSlot(slots, 'end')" />

          <Icon
            v-bind="selectedIconBind"
            :icon="resolvedSelectedIcon"
            v-else-if="resolvedSelectedIcon"
          />
        </div>
      </div>
    </template>
  </component>
</template>
