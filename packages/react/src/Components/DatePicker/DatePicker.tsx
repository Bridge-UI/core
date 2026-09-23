// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import { Calendar } from "@/Components/Calendar";
import type { DatePickerProps } from "@/Components/DatePicker/datePicker.types";
import { useDatePicker } from "@/Components/DatePicker/hooks/useDatePicker";

function DatePicker(props: DatePickerProps) {
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
  } = useDatePicker(props, {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
  });

  return (
    <div {...rootBind}>
      <Calendar
        fill={merged.fill}
        color={merged.color}
        range={merged.range}
        value={displayValue}
        error={merged.error}
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
        granularity={merged.granularity}
        defaultView={merged.defaultView}
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

export default DatePicker;
