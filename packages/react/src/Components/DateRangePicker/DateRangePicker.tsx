// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import { CalendarRange } from "@/Components/CalendarRange";
import type { DateRangePickerProps } from "@/Components/DateRangePicker/dateRangePicker.types";
import { useDateRangePicker } from "@/Components/DateRangePicker/hooks/useDateRangePicker";

function DateRangePicker(props: DateRangePickerProps) {
  const {
    merged,
    rootBind,
    footerBind,
    showFooter,
    handleApply,
    displayValue,
    handleCancel,
    applyButtonProps,
    cancelButtonProps,
    handleCalendarChange,
  } = useDateRangePicker(props, {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    orientation: "horizontal",
  });

  return (
    <div {...rootBind}>
      <CalendarRange
        fill={merged.fill}
        color={merged.color}
        value={displayValue}
        error={merged.error}
        maxDate={merged.maxDate}
        minDate={merged.minDate}
        rounded={merged.rounded}
        disabled={merged.disabled}
        readOnly={merged.readOnly}
        timeZone={merged.timeZone}
        hideYears={merged.hideYears}
        hideMonths={merged.hideMonths}
        onChange={handleCalendarChange}
        granularity={merged.granularity}
        defaultView={merged.defaultView}
        orientation={merged.orientation}
        startOfWeek={merged.startOfWeek}
        disableDates={merged.disableDates}
        hideWeekdays={merged.hideWeekdays}
        disableYears={merged.disableYears}
        disableMonths={merged.disableMonths}
        hideOutsideDays={merged.hideOutsideDays}
        slots={props.slots?.day ? { day: props.slots.day } : undefined}
      />

      {showFooter && (
        <div {...footerBind}>
          {props.slots?.footer ? (
            props.slots.footer({ apply: handleApply, cancel: handleCancel })
          ) : (
            <ActionFooter
              onApply={handleApply}
              onCancel={handleCancel}
              customProps={{
                applyButton: applyButtonProps,
                cancelButton: cancelButtonProps,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
