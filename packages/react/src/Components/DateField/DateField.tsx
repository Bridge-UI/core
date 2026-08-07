// ** Local Imports
import type { DateFieldProps } from "@/Components/DateField/dateField.types";
import { useDateField } from "@/Components/DateField/hooks/useDateField";
import { DatePicker } from "@/Components/DatePicker";
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";

function DateField(props: DateFieldProps) {
  const {
    open,
    daySlot,
    dateOnly,
    formField,
    inputBind,
    menuProps,
    modelValue,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    datePickerCustomProps,
  } = useDateField(props);

  return (
    <>
      <FormField field={formField}>
        <input {...inputBind} />
      </FormField>

      <Menu
        show={open}
        closeOnClickAway
        anchorEl={containerRef}
        placement="bottom-start"
        onShowChange={handleOpenChange}
        {...menuProps}
      >
        <DatePicker
          value={modelValue}
          range={dateOnly.range}
          readOnly={props.readonly}
          maxDate={dateOnly.maxDate}
          minDate={dateOnly.minDate}
          multiple={dateOnly.multiple}
          timeZone={dateOnly.timeZone}
          onChange={handlePickerChange}
          hideYears={dateOnly.hideYears}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          showFooter={dateOnly.showFooter}
          hideMonths={dateOnly.hideMonths}
          defaultView={dateOnly.defaultView}
          startOfWeek={dateOnly.startOfWeek}
          rounded={formField.merged.rounded}
          customProps={datePickerCustomProps}
          disableDates={dateOnly.disableDates}
          hideWeekdays={dateOnly.hideWeekdays}
          disableYears={dateOnly.disableYears}
          disableMonths={dateOnly.disableMonths}
          hideOutsideDays={dateOnly.hideOutsideDays}
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </Menu>
    </>
  );
}

export default DateField;
