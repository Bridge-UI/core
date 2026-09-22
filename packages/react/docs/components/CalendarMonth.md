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

| Prop            | Type                       | Default      | Description                                                           |
| --------------- | -------------------------- | ------------ | --------------------------------------------------------------------- |
| `classes`       | `CalendarMonthClasses`     | —            | Classes for calendar regions.                                         |
| `color`         | `CalendarColor`            | `"primary"`  | Accent color for month tiles.                                         |
| `customProps`   | `CalendarMonthCustomProps` | —            | Extra props for internal parts.                                       |
| `disabled`      | `boolean`                  | `false`      | Disables the entire month grid.                                       |
| `disableDates`  | `Date[]`                   | —            | Dates that cannot be selected. Compared at month precision on commit. |
| `disableMonths` | `number[]`                 | —            | Month indexes that cannot be selected.                                |
| `disableYears`  | `number[]`                 | —            | Years that cannot be selected.                                        |
| `error`         | `boolean`                  | `false`      | Applies the error color palette to tiles.                             |
| `maxDate`       | `Date`                     | —            | Latest selectable date (bounds months for `year`).                    |
| `minDate`       | `Date`                     | —            | Earliest selectable date (bounds months for `year`).                  |
| `multiple`      | `boolean`                  | `false`      | Allows selecting multiple months when this panel is the commit view.  |
| `previewDate`   | `Date \| null`             | —            | Controlled range-preview hover date.                                  |
| `range`         | `boolean`                  | `false`      | Selects a month range when this panel is the commit view.             |
| `readOnly`      | `boolean`                  | `false`      | Prevents selection.                                                   |
| `rounded`       | `CalendarRounded`          | `"md"`       | Border radius of month tiles.                                         |
| `selection`     | `DatePickerModel`          | —            | Date model used to highlight tiles on the commit panel.               |
| `timeZone`      | `string`                   | —            | IANA time zone.                                                       |
| `value`         | `number`                   | —            | Selected month (`0`–`11`).                                            |
| `year`          | `number`                   | current year | Year context for min/max month disabling.                             |

Calendar chrome tokens live on `components.Calendar` (`color`, `day`, `rounded`).

## Events

| Callback              | Type                           | Description                                       |
| --------------------- | ------------------------------ | ------------------------------------------------- |
| `onChange`            | `(month: number) => void`      | Called when a month is selected (`0`–`11`).       |
| `onPreviewDateChange` | `(date: Date \| null) => void` | Called when the range preview hover date changes. |

## Related components

Calendar, CalendarDate, CalendarYear
