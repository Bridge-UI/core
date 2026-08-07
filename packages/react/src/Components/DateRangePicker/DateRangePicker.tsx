// ** Local Imports
import { Button } from "@/Components/Button";
import { CalendarRange } from "@/Components/CalendarRange";
import type { DateRangePickerProps } from "@/Components/DateRangePicker/dateRangePicker.types";
import { useDateRangePicker } from "@/Components/DateRangePicker/hooks/useDateRangePicker";

function DateRangePicker(props: DateRangePickerProps) {
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
  } = useDateRangePicker(props, {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showFooter: false,
    orientation: "horizontal",
  });

  return (
    <div {...rootBind}>
      <CalendarRange
        slots={props.slots}
        color={merged.color}
        value={displayValue}
        tokens={calendarTokens}
        maxDate={merged.maxDate}
        minDate={merged.minDate}
        rounded={merged.rounded}
        disabled={merged.disabled}
        readOnly={merged.readOnly}
        timeZone={merged.timeZone}
        hideYears={merged.hideYears}
        hideMonths={merged.hideMonths}
        onChange={handleCalendarChange}
        orientation={merged.orientation}
        startOfWeek={merged.startOfWeek}
        disableDates={merged.disableDates}
        hideWeekdays={merged.hideWeekdays}
        disableYears={merged.disableYears}
        disableMonths={merged.disableMonths}
        hideOutsideDays={merged.hideOutsideDays}
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

export default DateRangePicker;
