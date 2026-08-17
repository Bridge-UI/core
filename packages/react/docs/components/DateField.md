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
When unset, `showFooter` defaults to `true` for `modal` / `drawer` overlays (`false` for `menu`).
When unset, `fill` defaults to `true` for `drawer` overlays (`false` for `menu` / `modal`).
Apply commits and closes the overlay; Cancel discards the draft and closes.

The input is read-only by default (picker only). Set `editable` to unlock typing. The field does not parse or commit typed text — handle that in your own component if needed:

```tsx
<DateField editable label="Date" />
```

### Custom footer

Replaces Cancel / Apply on the nested picker. `apply()` commits and closes; `cancel()` discards and closes.

```tsx
<DateField
  overlay="modal"
  slots={{
    footer: ({ apply, cancel }) => (
      <>
        <button type="button" onClick={cancel}>
          Discard
        </button>
        <button type="button" onClick={apply}>
          Save
        </button>
      </>
    ),
  }}
/>
```

## Props

### DateField-specific

| Prop              | Type                   | Default                                      | Description                                                                           |
| ----------------- | ---------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------- |
| `classes`         | `DateFieldClasses`     | —                                            | Classes for field / input regions.                                                    |
| `clearable`       | `boolean`              | `true`                                       | Whether the value can be cleared.                                                     |
| `customProps`     | `DateFieldCustomProps` | —                                            | Extra props for internal parts (`input`, `menu`, `modal`, `drawer`, `datePicker`, …). |
| `defaultValue`    | `DatePickerModel`      | `null`                                       | Uncontrolled initial value.                                                           |
| `defaultView`     | `CalendarView`         | `"date"`                                     | Initial calendar panel view.                                                          |
| `disableDates`    | `Date[]`               | —                                            | Dates that cannot be selected.                                                        |
| `disableMonths`   | `number[]`             | —                                            | Month indexes that cannot be selected.                                                |
| `disableYears`    | `number[]`             | —                                            | Years that cannot be selected.                                                        |
| `editable`        | `boolean`              | `false`                                      | Unlocks the input. Does not parse or commit typed text.                               |
| `fill`            | `boolean`              | —                                            | Fills the overlay width. Unset: `true` for `drawer`, `false` for `menu` / `modal`.    |
| `hideMonths`      | `boolean`              | `false`                                      | Hides month navigation / panel.                                                       |
| `hideOutsideDays` | `boolean`              | `false`                                      | Hides days that fall outside the displayed month.                                     |
| `hideWeekdays`    | `boolean`              | `false`                                      | Hides weekday labels.                                                                 |
| `hideYears`       | `boolean`              | `false`                                      | Hides year navigation / panel.                                                        |
| `maxDate`         | `Date`                 | —                                            | Latest selectable date.                                                               |
| `minDate`         | `Date`                 | —                                            | Earliest selectable date.                                                             |
| `multiple`        | `boolean`              | `false`                                      | Allows selecting multiple dates.                                                      |
| `overlay`         | `FieldOverlayMode`     | `"auto"`                                     | Overlay shell: `menu`, `modal`, `drawer`, or `auto`.                                  |
| `range`           | `boolean`              | `false`                                      | Selects a date range.                                                                 |
| `showFooter`      | `boolean`              | `false` (`true` for modal/drawer when unset) | Shows Cancel / Apply on the nested picker.                                            |
| `slots`           | `DateFieldSlots`       | —                                            | Named slots (`FormField` slots + calendar `day` + footer).                            |
| `startOfWeek`     | `StartOfWeek`          | `0`                                          | First day of the week.                                                                |
| `timeZone`        | `string`               | —                                            | IANA time zone.                                                                       |
| `value`           | `DatePickerModel`      | —                                            | Controlled value.                                                                     |

### Binding

| Prop       | Type                               | Default | Description                            |
| ---------- | ---------------------------------- | ------- | -------------------------------------- |
| `value`    | `DatePickerModel`                  | —       | Controlled value. Use with `onChange`. |
| `onChange` | `(value: DatePickerModel) => void` | —       | Called when the value changes.         |

### Inherited from FormField

See [FormField](./FormField.md).

## Events

| Callback   | Type                               | Description                                   |
| ---------- | ---------------------------------- | --------------------------------------------- |
| `onApply`  | `() => void`                       | Called when Apply is pressed (`showFooter`).  |
| `onCancel` | `() => void`                       | Called when Cancel is pressed (`showFooter`). |
| `onChange` | `(value: DatePickerModel) => void` | Called when the selection model changes.      |
| `onClear`  | `() => void`                       | Called when the value is cleared.             |
| `onClose`  | `() => void`                       | Called when the menu closes.                  |
| `onOpen`   | `() => void`                       | Called when the menu opens.                   |

## Related components

DatePicker, FormField, DateRangeField, FieldOverlay, Menu, Modal, Drawer
