# Stepper

Multi-step flow indicator for checkout, onboarding, and wizards. Shows progress through ordered steps; optional click-to-navigate when steps are completed or `linear` is off. Compose with `Step`.

Wizard footer actions (`Next` / `Back`) stay in the app — `Stepper` is the indicator (plus optional vertical step bodies). A labeled progress bar is `Progress`, not `Stepper`.

## Import

```ts
import { Stepper } from "@bridge-ui/react/Components/Stepper";
import { Step } from "@bridge-ui/react/Components/Step";
```

## Examples

### Usage

```tsx
const [active, setActive] = useState(1);

<Stepper activeStep={active} onChange={setActive}>
  <Step label="Account" />
  <Step label="Profile" />
  <Step label="Confirm" />
</Stepper>;
```

### Vertical

```tsx
<Stepper activeStep={active} orientation="vertical">
  <Step label="Cart" description="Review items">
    Cart details…
  </Step>
  <Step label="Shipping" description="Address">
    Shipping form…
  </Step>
  <Step label="Pay" description="Payment">
    Payment form…
  </Step>
</Stepper>
```

### Non-linear

```tsx
<Stepper linear={false} activeStep={active} onChange={setActive}>
  <Step label="Account" />
  <Step label="Profile" />
  <Step label="Confirm" />
</Stepper>
```

### Error and disabled

```tsx
<Stepper activeStep={1} onChange={setActive}>
  <Step label="Account" />
  <Step error label="Profile" />
  <Step disabled label="Confirm" />
</Stepper>
```
