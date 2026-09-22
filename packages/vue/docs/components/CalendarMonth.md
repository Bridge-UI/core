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

### v-model

| Prop / Event        | Type                      | Default | Description                           |
| ------------------- | ------------------------- | ------- | ------------------------------------- |
| `modelValue`        | `number`                  | —       | Bound with `v-model`.                 |
| `update:modelValue` | `(value: number) => void` | —       | Emitted when `v-model` should update. |

Calendar chrome tokens live on `components.Calendar` (`color`, `day`, `rounded`).

## Events

| Event                      | Payload                | Description                                        |
| -------------------------- | ---------------------- | -------------------------------------------------- |
| `v-on:change`              | `(month: number)`      | Emitted when a month is selected (`0`–`11`).       |
| `v-on:preview-date-change` | `(date: Date \| null)` | Emitted when the range preview hover date changes. |

## Related components

Calendar, CalendarDate, CalendarYear
