// ** Local Imports
import { Button } from "@/Components/Button";
import { Calendar } from "@/Components/Calendar";
import type { DateTimePickerProps } from "@/Components/DateTimePicker/dateTimePicker.types";
import { useDateTimePicker } from "@/Components/DateTimePicker/hooks/useDateTimePicker";
import {
  TIME_PANEL_COLUMN_WIDTH_CLASS,
  TimePanel,
} from "@/Components/TimePanel";

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
    timeFillBind,
    timeSizerBind,
    calendarTokens,
    applyButtonProps,
    cancelButtonProps,
    handlePanelChange,
    handleCalendarChange,
    timePanelCustomProps,
  } = useDateTimePicker(props, {
    ampm: false,
    interval: 1,
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    showSeconds: false,
    defaultView: "date",
  });

  return (
    <div {...rootBind}>
      <div className={contentBind}>
        <div className={calendarBind}>
          <Calendar
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
            defaultView={merged.defaultView}
            startOfWeek={merged.startOfWeek}
            disableDates={merged.disableDates}
            hideWeekdays={merged.hideWeekdays}
            disableYears={merged.disableYears}
            disableMonths={merged.disableMonths}
            hideOutsideDays={merged.hideOutsideDays}
            slots={props.slots?.day ? { day: props.slots.day } : undefined}
          />
        </div>

        <div className={timeBind}>
          <div aria-hidden className={timeSizerBind}>
            <div className={TIME_PANEL_COLUMN_WIDTH_CLASS} />
            <div className={TIME_PANEL_COLUMN_WIDTH_CLASS} />
            {merged.showSeconds ? (
              <div className={TIME_PANEL_COLUMN_WIDTH_CLASS} />
            ) : null}
            {merged.ampm ? (
              <div className={TIME_PANEL_COLUMN_WIDTH_CLASS} />
            ) : null}
          </div>

          <div className={timeFillBind}>
            <TimePanel
              ampm={merged.ampm}
              tokens={timeTokens}
              color={merged.color}
              value={displayValue}
              error={merged.error}
              maxTime={merged.maxTime}
              minTime={merged.minTime}
              rounded={merged.rounded}
              disabled={merged.disabled}
              interval={merged.interval}
              readOnly={merged.readOnly}
              timeZone={merged.timeZone}
              onChange={handlePanelChange}
              showSeconds={merged.showSeconds}
              disableTimes={merged.disableTimes}
              customProps={timePanelCustomProps}
            />
          </div>
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

export default DateTimePicker;
