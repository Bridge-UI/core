// ** Local Imports
import { Button } from "@/Components/Button";
import { Calendar } from "@/Components/Calendar";
import type { DateTimePickerProps } from "@/Components/DateTimePicker/dateTimePicker.types";
import { useDateTimePicker } from "@/Components/DateTimePicker/hooks/useDateTimePicker";
import { TimePanel } from "@/Components/TimePanel";

function DateTimePicker(props: DateTimePickerProps) {
  const {
    merged,
    rootBind,
    timeBind,
    footerBind,
    showFooter,
    applyLabel,
    timeTokens,
    handleApply,
    cancelLabel,
    contentBind,
    displayValue,
    handleCancel,
    calendarBind,
    calendarTokens,
    applyButtonProps,
    cancelButtonProps,
    handlePanelChange,
    handleCalendarChange,
  } = useDateTimePicker(props, {
    ampm: false,
    interval: 1,
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showFooter: false,
    defaultView: "date",
  });

  return (
    <div {...rootBind}>
      <div className={contentBind}>
        <div className={calendarBind}>
          <Calendar
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
            defaultView={merged.defaultView}
            startOfWeek={merged.startOfWeek}
            disableDates={merged.disableDates}
            hideWeekdays={merged.hideWeekdays}
            disableYears={merged.disableYears}
            disableMonths={merged.disableMonths}
          />
        </div>

        <div className={timeBind}>
          <TimePanel
            ampm={merged.ampm}
            tokens={timeTokens}
            color={merged.color}
            value={displayValue}
            maxTime={merged.maxTime}
            minTime={merged.minTime}
            rounded={merged.rounded}
            disabled={merged.disabled}
            interval={merged.interval}
            readOnly={merged.readOnly}
            timeZone={merged.timeZone}
            onChange={handlePanelChange}
            disableTimes={merged.disableTimes}
          />
        </div>
      </div>

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

export default DateTimePicker;
