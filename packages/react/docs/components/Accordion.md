# Accordion

Expandable sections for FAQs, settings groups, and stacked content. Single or multiple panels open at once. Compose with `AccordionItem`.

## Import

```ts
import { Accordion } from "@bridge-ui/react/Components/Accordion";
import { AccordionItem } from "@bridge-ui/react/Components/AccordionItem";
```

## Examples

### Usage

```tsx
const [open, setOpen] = useState<string | string[]>("a");

<Accordion value={open} onChange={setOpen}>
  <AccordionItem title="Shipping" value="a">
    Delivery in 2–5 business days.
  </AccordionItem>
  <AccordionItem title="Returns" value="b">
    Free returns within 30 days.
  </AccordionItem>
</Accordion>;
```

### Multiple open

```tsx
<Accordion multiple defaultValue={["a", "b"]}>
  <AccordionItem title="One" value="a">
    First
  </AccordionItem>
  <AccordionItem title="Two" value="b">
    Second
  </AccordionItem>
</Accordion>
```

### Separated variant

```tsx
<Accordion variant="separated" defaultValue="a">
  <AccordionItem title="Shipping" value="a">
    Delivery in 2–5 business days.
  </AccordionItem>
  <AccordionItem title="Returns" value="b">
    Free returns within 30 days.
  </AccordionItem>
</Accordion>
```

### Disabled item

```tsx
<Accordion defaultValue="a">
  <AccordionItem title="Open" value="a">
    Visible content
  </AccordionItem>
  <AccordionItem disabled title="Locked" value="b">
    Hidden while disabled
  </AccordionItem>
</Accordion>
```

### Custom title slot

```tsx
<Accordion defaultValue="a">
  <AccordionItem
    value="a"
    slots={{
      title: <span className="font-semibold">Shipping rates</span>,
    }}
  >
    Delivery in 2–5 business days.
  </AccordionItem>
</Accordion>
```
