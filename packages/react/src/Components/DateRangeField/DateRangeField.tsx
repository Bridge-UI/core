// ** Local Imports
import type { DateRangeFieldProps } from "@/Components/DateRangeField/dateRangeField.types";
import { useDateRangeField } from "@/Components/DateRangeField/hooks/useDateRangeField";
import { DateRangePicker } from "@/Components/DateRangePicker";
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";

function DateRangeField(props: DateRangeFieldProps) {
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
    dateRangePickerCustomProps,
  } = useDateRangeField(props);

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
        <DateRangePicker
          value={modelValue}
          readOnly={props.readonly}
          maxDate={dateOnly.maxDate}
          minDate={dateOnly.minDate}
          timeZone={dateOnly.timeZone}
          onChange={handlePickerChange}
          hideYears={dateOnly.hideYears}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          showFooter={dateOnly.showFooter}
          hideMonths={dateOnly.hideMonths}
          startOfWeek={dateOnly.startOfWeek}
          rounded={formField.merged.rounded}
          disableDates={dateOnly.disableDates}
          hideWeekdays={dateOnly.hideWeekdays}
          disableYears={dateOnly.disableYears}
          disableMonths={dateOnly.disableMonths}
          customProps={dateRangePickerCustomProps}
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </Menu>
    </>
  );
}

export default DateRangeField;
