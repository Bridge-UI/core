# CalendarYear

Year-grid panel with paging. Building block used by `Calendar` and `CalendarRange`.

## Import

```ts
import { CalendarYear } from "@bridge-ui/react/Components/CalendarYear";
```

## Examples

### Usage

```tsx
<CalendarYear value={year} pageSize={15} onChange={setYear} />
```

## Props

| Prop           | Type                      | Default     | Description                      |
| -------------- | ------------------------- | ----------- | -------------------------------- |
| `classes`      | `CalendarYearClasses`     | —           | Classes for calendar regions.    |
| `color`        | `CalendarColor`           | `"primary"` | Accent color for year tiles.     |
| `customProps`  | `CalendarYearCustomProps` | —           | Extra props for internal parts.  |
| `disabled`     | `boolean`                 | `false`     | Disables the entire year grid.   |
| `disableYears` | `number[]`                | —           | Years that cannot be selected.   |
| `maxDate`      | `Date`                    | —           | Latest selectable date.          |
| `minDate`      | `Date`                    | —           | Earliest selectable date.        |
| `pageSize`     | `number`                  | `15`        | How many years to show per page. |
| `readOnly`     | `boolean`                 | `false`     | Prevents selection.              |
| `rounded`      | `CalendarRounded`         | `"md"`      | Border radius of year tiles.     |
| `startYear`    | `number`                  | —           | First year of the visible page.  |
| `timeZone`     | `string`                  | —           | IANA time zone.                  |
| `tokens`       | `CalendarYearTokens`      | —           | Token overrides.                 |
| `value`        | `number`                  | —           | Selected year.                   |

## Events

| Callback   | Type                     | Description                     |
| ---------- | ------------------------ | ------------------------------- |
| `onChange` | `(year: number) => void` | Called when a year is selected. |

## Related components

Calendar, CalendarDate, CalendarMonth
