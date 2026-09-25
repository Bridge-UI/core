<script setup lang="ts">
// ** Local Imports
import type {
  CarouselOwnProps,
  CarouselSlots,
} from "@/Components/Carousel/carousel.types";
import { useCarousel } from "@/Components/Carousel/composables/useCarousel";
import { Icon } from "@/Components/Icon";

defineOptions({ inheritAttrs: false });

defineSlots<CarouselSlots>();

const props = withDefaults(defineProps<CarouselOwnProps>(), {
  indicators: true,
});

const index = defineModel<number>("index");

const {
  liveBind,
  nextBind,
  prevBind,
  rootBind,
  nextIcon,
  prevIcon,
  trackBind,
  activeIndex,
  controlsBind,
  nextIconBind,
  prevIconBind,
  showControls,
  viewportBind,
  announcement,
  indicatorsBind,
  showIndicators,
  getIndicatorBind,
  indicatorIndexes,
} = useCarousel(
  props,
  {
    gap: 0,
    size: "md",
    loop: false,
    align: "start",
    autoPlay: false,
    defaultIndex: 0,
    indicators: true,
    slidesPerView: 1,
    orientation: "horizontal",
  },
  index,
);
</script>

<template>
  <section v-bind="rootBind">
    <div v-bind="viewportBind">
      <div v-bind="trackBind">
        <slot />
      </div>

      <div v-if="showControls" v-bind="controlsBind">
        <button v-bind="prevBind">
          <slot name="prev">
            <Icon :icon="prevIcon" v-bind="prevIconBind" />
          </slot>
        </button>

        <button v-bind="nextBind">
          <slot name="next">
            <Icon :icon="nextIcon" v-bind="nextIconBind" />
          </slot>
        </button>
      </div>
    </div>

    <div v-if="showIndicators" v-bind="indicatorsBind">
      <button
        :key="slideIndex"
        v-bind="getIndicatorBind(slideIndex)"
        v-for="slideIndex in indicatorIndexes"
      >
        <slot
          name="indicator"
          :index="slideIndex"
          :selected="slideIndex === activeIndex"
        />
      </button>
    </div>

    <div v-bind="liveBind">
      {{ announcement }}
    </div>
  </section>
</template>
