# Carousel

Slideshow region. Previous and next buttons, optional dot indicators, keyboard, and swipe. Slide content stays in the app (`CarouselSlide`).

One slide fills the viewport by default. `slidesPerView` shows more than one, including a fraction that peeks the next slide. `orientation` switches the scroll axis. `align` chooses how the active slide sits in the viewport. `gap` is the space between slides, in px.

Auto-advance pauses while the pointer is over the carousel, while focus is inside it, and when the user prefers reduced motion.

## Import

```ts
import { Carousel } from "@bridge-ui/react/Components/Carousel";
import { CarouselSlide } from "@bridge-ui/react/Components/CarouselSlide";
```

## Examples

### Usage

```tsx
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

```tsx
const [index, setIndex] = useState(0);

<Carousel loop index={index} aria-label="Highlights" onIndexChange={setIndex}>
  {slides.map((slide) => (
    <CarouselSlide key={slide.id}>{slide.content}</CarouselSlide>
  ))}
</Carousel>;
```

### Auto-play

`autoPlay` accepts `true` (5 seconds) or an interval in milliseconds.

```tsx
<Carousel loop autoPlay={4000} aria-label="Highlights">
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
</Carousel>
```

### Without indicators

```tsx
<Carousel aria-label="Photos" indicators={false}>
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
</Carousel>
```

### Slots

```tsx
<Carousel
  aria-label="Photos"
  slots={{
    prev: "Back",
    next: "Forward",
  }}
>
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
</Carousel>
```

### Several slides

```tsx
<Carousel gap={16} slidesPerView={3} aria-label="Products">
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
  <CarouselSlide>Three</CarouselSlide>
</Carousel>
```

`align="center"` keeps the active slide in the middle. `align="end"` lines it up with the end of the viewport. The default is `"start"`.

### Vertical

Set a height on the region when the slides should not use the default viewport height.

```tsx
<Carousel className="h-96" aria-label="Stories" orientation="vertical">
  <CarouselSlide>One</CarouselSlide>
  <CarouselSlide>Two</CarouselSlide>
</Carousel>
```

### Right to left

`dir="rtl"` flips the horizontal axis: arrow keys, swipe, and the track. The chevrons rotate with the direction.

```tsx
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
