// ** Local Imports
import { Button } from "@/Components/Button";
import { Calendar } from "@/Components/Calendar";
import type { DatePickerProps } from "@/Components/DatePicker/datePicker.types";
import { useDatePicker } from "@/Components/DatePicker/hooks/useDatePicker";

function DatePicker(props: DatePickerProps) {
  const {
    merged,
    rootBind,
    footerBind,
    showFooter,
    applyLabel,
    handleApply,
    cancelLabel,
    displayValue,
    handleCancel,
    calendarTokens,
    applyButtonProps,
    cancelButtonProps,
    handleCalendarChange,
  } = useDatePicker(props, {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showFooter: false,
  });

  return (
    <div {...rootBind}>
      <Calendar
        slots={props.slots}
        color={merged.color}
        range={merged.range}
        value={displayValue}
        tokens={calendarTokens}
        maxDate={merged.maxDate}
        minDate={merged.minDate}
        rounded={merged.rounded}
        disabled={merged.disabled}
        multiple={merged.multiple}
        readOnly={merged.readOnly}
        timeZone={merged.timeZone}
        hideYears={merged.hideYears}
        hideMonths={merged.hideMonths}
        onChange={handleCalendarChange}
        defaultView={merged.defaultView}
        startOfWeek={merged.startOfWeek}
        disableDates={merged.disableDates}
        hideWeekdays={merged.hideWeekdays}
        disableYears={merged.disableYears}
        disableMonths={merged.disableMonths}
      />

      {showFooter && (
        <div {...footerBind}>
          <Button
            variant="flat"
            color="secondary"
            onClick={handleCancel}
            {...cancelButtonProps}
          >
            {cancelLabel}
          </Button>

          <Button color="primary" onClick={handleApply} {...applyButtonProps}>
            {applyLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
