# Carousel

Slideshow region. Previous and next buttons, optional dot indicators, keyboard, and swipe. Slide content stays in the app (`CarouselSlide`).

One slide fills the viewport by default. `slidesPerView` shows more than one, including a fraction that peeks the next slide. `orientation` switches the scroll axis. `align` chooses how the active slide sits in the viewport. `gap` is the space between slides, in px.

Auto-advance pauses while the pointer is over the carousel, while focus is inside it, and when the user prefers reduced motion.

## Import

```ts
import { Carousel } from "@bridge-ui/vue/Components/Carousel";
import { CarouselSlide } from "@bridge-ui/vue/Components/CarouselSlide";
```

## Examples

### Usage

```vue
<Carousel aria-label="Product photos">
  <CarouselSlide>
    <img alt="Front" src="/photos/1.jpg" />
  </CarouselSlide>
  <CarouselSlide>
    <img alt="Side" src="/photos/2.jpg" />
  </CarouselSlide>
</Carousel>
```

### Controlled index

```vue
<Carousel loop v-model:index="index" aria-label="Highlights">
  <CarouselSlide v-for="slide in slides" :key="slide.id">
    {{ slide.content }}
  </CarouselSlide>
</Carousel>
```

### Auto-play

`auto-play` accepts `true` (5 seconds) or an interval in milliseconds.

```vue
<Carousel loop :auto-play="4000" aria-label="Highlights">
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
</Carousel>
```

### Without indicators

```vue
<Carousel aria-label="Photos" :indicators="false">
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
</Carousel>
```

### Slots

```vue
<Carousel aria-label="Photos">
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>

  <template #prev>Back</template>
  <template #next>Forward</template>
</Carousel>
```

### Several slides

```vue
<Carousel :gap="16" aria-label="Products" :slides-per-view="3">
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
  <CarouselSlide>Three</CarouselSlide>
</Carousel>
```

`align="center"` keeps the active slide in the middle. `align="end"` lines it up with the end of the viewport. The default is `"start"`.

### Vertical

Set a height on the region when the slides should not use the default viewport height.

```vue
<Carousel class="h-96" aria-label="Stories" orientation="vertical">
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
</Carousel>
```

### Right to left

`dir="rtl"` flips the horizontal axis: arrow keys, swipe, and the track. The chevrons rotate with the direction.

```vue
<Carousel loop dir="rtl" aria-label="Photos">
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
</Carousel>
```

## Keyboard and touch

- Horizontal: `ArrowLeft` / `ArrowRight`. Vertical: `ArrowUp` / `ArrowDown`. `dir="rtl"` swaps the horizontal arrows
- `Home` / `End` jump to the first and last snap
- A swipe along the scroll axis moves one snap. The cross-axis is left to the page
- `loop` wraps the ends. Without it, the edge control is disabled
- With `slidesPerView` above `1` and `align="start"`, next stops once the last slides fill the viewport
