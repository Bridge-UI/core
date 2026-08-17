// ** Local Imports
import { Button } from "@/Components/Button";
import { CalendarRange } from "@/Components/CalendarRange";
import type { DateTimeRangePickerProps } from "@/Components/DateTimeRangePicker/dateTimeRangePicker.types";
import { useDateTimeRangePicker } from "@/Components/DateTimeRangePicker/hooks/useDateTimeRangePicker";
import {
  TIME_PANEL_COLUMN_WIDTH_CLASS,
  TimePanel,
} from "@/Components/TimePanel";

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
    contentBind,
    displayValue,
    handleCancel,
    calendarBind,
    timeFillBind,
    endTimeValue,
    timeSizerBind,
    calendarTokens,
    startTimeValue,
    applyButtonProps,
    cancelButtonProps,
    handleCalendarChange,
    handleEndPanelChange,
    timePanelCustomProps,
    handleStartPanelChange,
  } = useDateTimeRangePicker(props, {
    ampm: false,
    interval: 1,
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showSeconds: false,
    orientation: "horizontal",
  });

  const timeAside = (
    value: Date | null,
    onChange: (next: Date | null) => void,
  ) => (
    <div className={timeBind}>
      <div aria-hidden className={timeSizerBind}>
        <div className={TIME_PANEL_COLUMN_WIDTH_CLASS} />
        <div className={TIME_PANEL_COLUMN_WIDTH_CLASS} />
        {merged.showSeconds ? (
          <div className={TIME_PANEL_COLUMN_WIDTH_CLASS} />
        ) : null}
        {merged.ampm ? <div className={TIME_PANEL_COLUMN_WIDTH_CLASS} /> : null}
      </div>

      <div className={timeFillBind}>
        <TimePanel
          value={value}
          ampm={merged.ampm}
          tokens={timeTokens}
          onChange={onChange}
          color={merged.color}
          error={merged.error}
          maxTime={merged.maxTime}
          minTime={merged.minTime}
          rounded={merged.rounded}
          disabled={merged.disabled}
          interval={merged.interval}
          readOnly={merged.readOnly}
          timeZone={merged.timeZone}
          showSeconds={merged.showSeconds}
          disableTimes={merged.disableTimes}
          customProps={timePanelCustomProps}
        />
      </div>
    </div>
  );

  return (
    <div {...rootBind}>
      <div className={contentBind}>
        <div className={calendarBind}>
          <CalendarRange
            color={merged.color}
            value={displayValue}
            error={merged.error}
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
            customProps={{
              end: { className: "pr-2.5" },
              start: { className: "pr-2.5" },
              panels: { className: "gap-0" },
            }}
            slots={{
              day: props.slots?.day,
              endAside: timeAside(endTimeValue, handleEndPanelChange),
              startAside: timeAside(startTimeValue, handleStartPanelChange),
            }}
          />
        </div>
      </div>

      {showFooter && (
        <div {...footerBind}>
          {props.slots?.footer ? (
            props.slots.footer({ apply: handleApply, cancel: handleCancel })
          ) : (
            <>
              <Button
                variant="flat"
                color="secondary"
                onClick={handleCancel}
                {...cancelButtonProps}
              >
                {cancelLabel}
              </Button>

              <Button
                color="primary"
                onClick={handleApply}
                {...applyButtonProps}
              >
                {applyLabel}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DateTimeRangePicker;
