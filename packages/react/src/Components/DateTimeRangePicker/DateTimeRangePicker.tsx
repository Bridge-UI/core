// ** Local Imports
import { Button } from "@/Components/Button";
import { CalendarRange } from "@/Components/CalendarRange";
import type { DateTimeRangePickerProps } from "@/Components/DateTimeRangePicker/dateTimeRangePicker.types";
import { useDateTimeRangePicker } from "@/Components/DateTimeRangePicker/hooks/useDateTimeRangePicker";
import { TimePanel } from "@/Components/TimePanel";

function DateTimeRangePicker(props: DateTimeRangePickerProps) {
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
    displayValue,
    handleCancel,
    calendarBind,
    endTimeValue,
    calendarTokens,
    startTimeValue,
    applyButtonProps,
    cancelButtonProps,
    handleCalendarChange,
    handleEndPanelChange,
    handleStartPanelChange,
  } = useDateTimeRangePicker(props, {
    ampm: false,
    interval: 1,
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showFooter: false,
  });

  return (
    <div {...rootBind}>
      <div className={calendarBind}>
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
          startOfWeek={merged.startOfWeek}
          disableDates={merged.disableDates}
          hideWeekdays={merged.hideWeekdays}
          disableYears={merged.disableYears}
          disableMonths={merged.disableMonths}
        />
      </div>

      <div className={timeBind}>
        <div className="flex-1 p-2">
          <TimePanel
            ampm={merged.ampm}
            tokens={timeTokens}
            color={merged.color}
            value={startTimeValue}
            maxTime={merged.maxTime}
            minTime={merged.minTime}
            rounded={merged.rounded}
            disabled={merged.disabled}
            interval={merged.interval}
            readOnly={merged.readOnly}
            timeZone={merged.timeZone}
            onChange={handleStartPanelChange}
            disableTimes={merged.disableTimes}
          />
        </div>

        <div className="flex-1 border-l border-gray-100 p-2 dark:border-gray-800">
          <TimePanel
            ampm={merged.ampm}
            tokens={timeTokens}
            color={merged.color}
            value={endTimeValue}
            maxTime={merged.maxTime}
            minTime={merged.minTime}
            rounded={merged.rounded}
            disabled={merged.disabled}
            interval={merged.interval}
            readOnly={merged.readOnly}
            timeZone={merged.timeZone}
            onChange={handleEndPanelChange}
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

export default DateTimeRangePicker;
