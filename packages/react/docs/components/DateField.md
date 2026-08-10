# DateField

Form field that opens a `DatePicker` in an overlay (`auto` by default: `menu` on desktop, bottom `drawer` on mobile). Extends FormField props.

## Import

```ts
import { DateField } from "@bridge-ui/react/Components/DateField";
```

## Examples

### Usage

```tsx
<DateField label="Start date" />

<DateField
  label="Birthday"
  value={date}
  onChange={setDate}
  description="Stored as a local calendar date."
/>

<DateField
  error
  label="Date"
  errorMessage="Pick a valid date."
/>
```

### Range

```tsx
<DateField range label="Trip" value={range} onChange={setRange} />
```

### Overlay

```tsx
<DateField label="Date" overlay="auto" />

<DateField label="Date" overlay="drawer" />

<DateField
  label="Date"
  overlay="modal"
  customProps={{
    modal: { size: "sm", transition: "none" },
  }}
/>
```

Default `overlay` is `auto`: `menu` on desktop and bottom `drawer` on mobile.
When unset, `showFooter` defaults to `true` on mobile (`false` on desktop).

## Props

### DateField-specific

| Prop              | Type                   | Default                               | Description                                                                           |
| ----------------- | ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| `classes`         | `DateFieldClasses`     | —                                     | Classes for field / input regions.                                                    |
| `clearable`       | `boolean`              | `true`                                | Whether the value can be cleared.                                                     |
| `customProps`     | `DateFieldCustomProps` | —                                     | Extra props for internal parts (`input`, `menu`, `modal`, `drawer`, `datePicker`, …). |
| `defaultValue`    | `DatePickerModel`      | `null`                                | Uncontrolled initial value.                                                           |
| `defaultView`     | `CalendarView`         | `"date"`                              | Initial calendar panel view.                                                          |
| `disableDates`    | `Date[]`               | —                                     | Dates that cannot be selected.                                                        |
| `disableMonths`   | `number[]`             | —                                     | Month indexes that cannot be selected.                                                |
| `disableYears`    | `number[]`             | —                                     | Years that cannot be selected.                                                        |
| `hideMonths`      | `boolean`              | `false`                               | Hides month navigation / panel.                                                       |
| `hideOutsideDays` | `boolean`              | `false`                               | Hides days that fall outside the displayed month.                                     |
| `hideWeekdays`    | `boolean`              | `false`                               | Hides weekday labels.                                                                 |
| `hideYears`       | `boolean`              | `false`                               | Hides year navigation / panel.                                                        |
| `maxDate`         | `Date`                 | —                                     | Latest selectable date.                                                               |
| `minDate`         | `Date`                 | —                                     | Earliest selectable date.                                                             |
| `multiple`        | `boolean`              | `false`                               | Allows selecting multiple dates.                                                      |
| `overlay`         | `FieldOverlayMode`     | `"auto"`                              | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                                  |
| `range`           | `boolean`              | `false`                               | Selects a date range.                                                                 |
| `showFooter`      | `boolean`              | `false` (`true` on mobile when unset) | Shows Cancel / Apply on the nested picker.                                            |
| `slots`           | `DateFieldSlots`       | —                                     | Named slots (`FormField` slots + calendar `day`).                                     |
| `startOfWeek`     | `StartOfWeek`          | `0`                                   | First day of the week.                                                                |
| `timeZone`        | `string`               | —                                     | IANA time zone.                                                                       |
| `value`           | `DatePickerModel`      | —                                     | Controlled value.                                                                     |

### Binding

| Prop       | Type                               | Default | Description                            |
| ---------- | ---------------------------------- | ------- | -------------------------------------- |
| `value`    | `DatePickerModel`                  | —       | Controlled value. Use with `onChange`. |
| `onChange` | `(value: DatePickerModel) => void` | —       | Called when the value changes.         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback   | Type                               | Description                              |
| ---------- | ---------------------------------- | ---------------------------------------- |
| `onChange` | `(value: DatePickerModel) => void` | Called when the selection model changes. |
| `onClear`  | `() => void`                       | Called when the value is cleared.        |
| `onClose`  | `() => void`                       | Called when the menu closes.             |
| `onOpen`   | `() => void`                       | Called when the menu opens.              |

## Related components

DatePicker, FormField, DateRangeField, FieldOverlay, Menu, Modal, Drawer
