# CalendarMonth

Month-grid panel (`0`–`11`). Building block used by `Calendar` and `CalendarRange`.

## Import

```ts
import { CalendarMonth } from "@bridge-ui/vue/Components/CalendarMonth";
```

## Examples

### Usage

```vue
<CalendarMonth :year="2026" v-model="month" />
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `classes` | `CalendarMonthClasses` | — | Classes for calendar regions. |
| `color` | `CalendarColor` | `"primary"` | Accent color for month tiles. |
| `customProps` | `CalendarMonthCustomProps` | — | Extra props for internal parts. |
| `disabled` | `boolean` | `false` | Disables the entire month grid. |
| `disableMonths` | `number[]` | — | Month indexes that cannot be selected. |
| `maxDate` | `Date` | — | Latest selectable date (bounds months for `year`). |
| `minDate` | `Date` | — | Earliest selectable date (bounds months for `year`). |
| `readOnly` | `boolean` | `false` | Prevents selection. |
| `rounded` | `CalendarRounded` | `"md"` | Border radius of month tiles. |
| `timeZone` | `string` | — | IANA time zone. |
| `tokens` | `CalendarMonthTokens` | — | Token overrides. |
| `value` | `number` | — | Selected month (`0`–`11`). |
| `year` | `number` | current year | Year context for min/max month disabling. |

### v-model

| Prop / Event | Type | Default | Description |
| ------------ | ---- | ------- | ----------- |
| `modelValue` | `number` | — | Bound with `v-model`. |
| `update:modelValue` | `(value: number) => void` | — | Emitted when `v-model` should update. |

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `v-on:change` | `(month: number)` | Emitted when a month is selected (`0`–`11`). |

## Related components

Calendar, CalendarDate, CalendarYear
