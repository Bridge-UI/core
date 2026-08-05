// ** External Imports
import { useRef } from "react";

// ** Local Imports
import type { DateInputProps } from "@/Components/DateInput/dateInput.types";
import { useDateInput } from "@/Components/DateInput/hooks/useDateInput";
import { DatePicker } from "@/Components/DatePicker";
import { FormField } from "@/Components/FormField";
import { Menu } from "@/Components/Menu";

function DateInput(props: DateInputProps) {
  const triggerRef = useRef<null | HTMLInputElement>(null);

  const {
    open,
    dateOnly,
    formField,
    inputBind,
    menuProps,
    modelValue,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    datePickerCustomProps,
  } = useDateInput(props, triggerRef);

  return (
    <>
      <FormField field={formField}>
        <input ref={triggerRef} {...inputBind} />
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
          locale={dateOnly.locale}
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
          customProps={datePickerCustomProps}
          disableDates={dateOnly.disableDates}
          hideWeekdays={dateOnly.hideWeekdays}
          disableYears={dateOnly.disableYears}
          disableMonths={dateOnly.disableMonths}
        />
      </Menu>
    </>
  );
}

export default DateInput;
