# Accordion

Expandable sections for FAQs, settings groups, and stacked content. Single or multiple panels open at once. Compose with `AccordionItem`. Expanded items stay on the same quiet text color; `color` optionally accents the open trigger.

## Import

```ts
import { Accordion } from "@bridge-ui/vue/Components/Accordion";
import { AccordionItem } from "@bridge-ui/vue/Components/AccordionItem";
```

## Examples

### Usage

```vue
<Accordion v-model="open">
  <AccordionItem title="Shipping" value="a">
    Delivery in 2–5 business days.
  </AccordionItem>
  <AccordionItem title="Returns" value="b">
    Free returns within 30 days.
  </AccordionItem>
</Accordion>
```

### Multiple open

```vue
<Accordion multiple :model-value="['a', 'b']">
  <AccordionItem title="One" value="a">
    First
  </AccordionItem>
  <AccordionItem title="Two" value="b">
    Second
  </AccordionItem>
</Accordion>
```

### Outlined variant

```vue
<Accordion model-value="a" variant="outlined">
  <AccordionItem title="Shipping" value="a">
    Delivery in 2–5 business days.
  </AccordionItem>
  <AccordionItem title="Returns" value="b">
    Free returns within 30 days.
  </AccordionItem>
</Accordion>
```

### Separated variant

```vue
<Accordion model-value="a" variant="separated">
  <AccordionItem title="Shipping" value="a">
    Delivery in 2–5 business days.
  </AccordionItem>
  <AccordionItem title="Returns" value="b">
    Free returns within 30 days.
  </AccordionItem>
</Accordion>
```

### Plain variant

```vue
<Accordion model-value="a" variant="plain">
  <AccordionItem title="Shipping" value="a">
    Delivery in 2–5 business days.
  </AccordionItem>
  <AccordionItem title="Returns" value="b">
    Free returns within 30 days.
  </AccordionItem>
</Accordion>
```

### Disabled item

```vue
<Accordion model-value="a">
  <AccordionItem title="Open" value="a">
    Visible content
  </AccordionItem>
  <AccordionItem disabled title="Locked" value="b">
    Hidden while disabled
  </AccordionItem>
</Accordion>
```

### Custom title slot

```vue
<Accordion model-value="a">
  <AccordionItem value="a">
    <template #title>
      <span class="font-semibold">Shipping rates</span>
    </template>

    Delivery in 2–5 business days.
  </AccordionItem>
</Accordion>
```
