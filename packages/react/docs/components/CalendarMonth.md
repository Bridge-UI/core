# CalendarMonth

Month-grid panel (`0`–`11`). Building block used by `Calendar` and `CalendarRange`.

## Import

```ts
import { CalendarMonth } from "@bridge-ui/react/Components/CalendarMonth";
```

## Examples

### Usage

```tsx
<CalendarMonth year={2026} value={month} onChange={setMonth} />
```

## Props

| Prop            | Type                       | Default      | Description                                          |
| --------------- | -------------------------- | ------------ | ---------------------------------------------------- |
| `classes`       | `CalendarMonthClasses`     | —            | Classes for calendar regions.                        |
| `color`         | `CalendarColor`            | `"primary"`  | Accent color for month tiles.                        |
| `customProps`   | `CalendarMonthCustomProps` | —            | Extra props for internal parts.                      |
| `disabled`      | `boolean`                  | `false`      | Disables the entire month grid.                      |
| `disableMonths` | `number[]`                 | —            | Month indexes that cannot be selected.               |
| `error`         | `boolean`                  | `false`      | Applies the error color palette to tiles.            |
| `maxDate`       | `Date`                     | —            | Latest selectable date (bounds months for `year`).   |
| `minDate`       | `Date`                     | —            | Earliest selectable date (bounds months for `year`). |
| `readOnly`      | `boolean`                  | `false`      | Prevents selection.                                  |
| `rounded`       | `CalendarRounded`          | `"md"`       | Border radius of month tiles.                        |
| `timeZone`      | `string`                   | —            | IANA time zone.                                      |
| `tokens`        | `CalendarMonthTokens`      | —            | Token overrides.                                     |
| `value`         | `number`                   | —            | Selected month (`0`–`11`).                           |
| `year`          | `number`                   | current year | Year context for min/max month disabling.            |

## Events

| Callback   | Type                      | Description                                 |
| ---------- | ------------------------- | ------------------------------------------- |
| `onChange` | `(month: number) => void` | Called when a month is selected (`0`–`11`). |

## Related components

Calendar, CalendarDate, CalendarYear
