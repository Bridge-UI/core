<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Core Imports
import {
  clampRatingValue,
  normalizeRatingMax,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  FORM_CONTROL_CHROME_SLOT_NAMES,
  FormControl,
} from "@/Components/FormControl";
import { Icon } from "@/Components/Icon";
import { useRating } from "@/Components/Rating/composables/useRating";
import type {
  RatingOwnProps,
  RatingSlots,
} from "@/Components/Rating/rating.types";
import { presentSlotNames, useOptionalModel } from "@/Utils";

defineSlots<RatingSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<RatingOwnProps>();

const model = defineModel<null | number | undefined>({
  default: undefined,
});

const ratingLibDefaults = {
  max: 5,
  size: "md",
  icon: "star",
  rounded: "sm",
  color: "primary",
} as const;

const uncontrolledValue = ref<null | number>(
  clampRatingValue(
    props.defaultValue ?? null,
    normalizeRatingMax(props.max ?? ratingLibDefaults.max),
  ),
);

const value = useOptionalModel(model, uncontrolledValue);

const { icon, items, inputBind, groupBind, setItemRef, formControl } =
  useRating(() => props, ratingLibDefaults, value);
</script>

<template>
  <FormControl :field="formControl">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(FORM_CONTROL_CHROME_SLOT_NAMES, $slots)"
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
        <Icon v-bind="item.iconBind" :icon="icon" />
      </button>

      <input v-bind="inputBind" />
    </div>
  </FormControl>
</template>
