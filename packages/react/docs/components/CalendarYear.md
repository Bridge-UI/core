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

| Prop           | Type                      | Default     | Description                                                          |
| -------------- | ------------------------- | ----------- | -------------------------------------------------------------------- |
| `classes`      | `CalendarYearClasses`     | —           | Classes for calendar regions.                                        |
| `color`        | `CalendarColor`           | `"primary"` | Accent color for year tiles.                                         |
| `customProps`  | `CalendarYearCustomProps` | —           | Extra props for internal parts.                                      |
| `disabled`     | `boolean`                 | `false`     | Disables the entire year grid.                                       |
| `disableDates` | `Date[]`                  | —           | Dates that cannot be selected. Compared at year precision on commit. |
| `disableYears` | `number[]`                | —           | Years that cannot be selected.                                       |
| `error`        | `boolean`                 | `false`     | Applies the error color palette to tiles.                            |
| `maxDate`      | `Date`                    | —           | Latest selectable date.                                              |
| `minDate`      | `Date`                    | —           | Earliest selectable date.                                            |
| `multiple`     | `boolean`                 | `false`     | Allows selecting multiple years when this panel is the commit view.  |
| `pageSize`     | `number`                  | `15`        | How many years to show per page.                                     |
| `previewDate`  | `Date \| null`            | —           | Controlled range-preview hover date.                                 |
| `range`        | `boolean`                 | `false`     | Selects a year range when this panel is the commit view.             |
| `readOnly`     | `boolean`                 | `false`     | Prevents selection.                                                  |
| `rounded`      | `CalendarRounded`         | `"md"`      | Border radius of year tiles.                                         |
| `selection`    | `DatePickerModel`         | —           | Date model used to highlight tiles on the commit panel.              |
| `startYear`    | `number`                  | —           | First year of the visible page.                                      |
| `timeZone`     | `string`                  | —           | IANA time zone.                                                      |
| `value`        | `number`                  | —           | Selected year.                                                       |

Calendar chrome tokens live on `components.Calendar` (`color`, `day`, `rounded`).

## Events

| Callback              | Type                           | Description                                       |
| --------------------- | ------------------------------ | ------------------------------------------------- |
| `onChange`            | `(year: number) => void`       | Called when a year is selected.                   |
| `onPreviewDateChange` | `(date: Date \| null) => void` | Called when the range preview hover date changes. |

## Related components

Calendar, CalendarDate, CalendarMonth
