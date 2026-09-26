<script setup lang="ts">
// ** Local Imports
import { BASE_FIELD_CHROME_SLOT_NAMES } from "@/Components/BaseField";
import BaseField from "@/Components/BaseField/BaseField.vue";
import { Icon } from "@/Components/Icon";
import { useRating } from "@/Components/Rating/composables/useRating";
import type {
  RatingOwnProps,
  RatingSlots,
} from "@/Components/Rating/rating.types";
import { presentSlotNames } from "@/Utils";

defineSlots<RatingSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<RatingOwnProps>();

const model = defineModel<null | number | undefined>();

const api = useRating(props, model);

const { icon, items, inputBind, groupBind, baseField, setItemRef } = api;
</script>

<template>
  <BaseField :field="baseField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(BASE_FIELD_CHROME_SLOT_NAMES, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <div v-bind="groupBind">
      <button
        :key="item.value"
        v-for="item in items"
        v-bind="item.itemBind"
        :ref="(node) => setItemRef(item.value, node)"
      >
        <span
          class="relative inline-flex"
          v-if="item.fill > 0 && item.fill < 1"
        >
          <Icon v-bind="item.emptyIconBind" :icon="icon" />

          <span
            :style="{ width: `${item.fill * 100}%` }"
            class="absolute inset-y-0 inset-s-0 overflow-hidden"
          >
            <Icon v-bind="item.filledIconBind" :icon="icon" />
          </span>
        </span>

        <Icon v-else v-bind="item.iconBind" :icon="icon" />
      </button>

      <input v-bind="inputBind" />
    </div>
  </BaseField>
</template>
