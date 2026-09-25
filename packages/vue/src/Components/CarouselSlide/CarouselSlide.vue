<script setup lang="ts">
// ** Local Imports
import type {
  CarouselSlideOwnProps,
  CarouselSlideSlots,
} from "@/Components/CarouselSlide/carouselSlide.types";
import { useCarouselSlide } from "@/Components/CarouselSlide/composables/useCarouselSlide";

defineOptions({ inheritAttrs: false });

defineSlots<CarouselSlideSlots>();

const props = defineProps<CarouselSlideOwnProps>();

const { rootBind } = useCarouselSlide(props);
</script>

<template>
  <div v-bind="rootBind">
    <slot />
  </div>
</template>
