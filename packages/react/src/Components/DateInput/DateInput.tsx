// ** Local Imports
import type { DateInputProps } from "@/Components/DateInput/dateInput.types";
import { useDateInput } from "@/Components/DateInput/hooks/useDateInput";
import { DatePicker } from "@/Components/DatePicker";
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";

function DateInput(props: DateInputProps) {
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
  } = useDateInput(props);

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
          color="primary"
          value={modelValue}
          range={dateOnly.range}
          readOnly={props.readonly}
          maxDate={dateOnly.maxDate}
          minDate={dateOnly.minDate}
          multiple={dateOnly.multiple}
          timeZone={dateOnly.timeZone}
          onChange={handlePickerChange}
          hideYears={dateOnly.hideYears}
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
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </Menu>
    </>
  );
}

export default DateInput;
