// ** Local Imports
import { Button } from "@/Components/Button";
import { Divider } from "@/Components/Divider";
import { TimePanel } from "@/Components/TimePanel";
import { useTimeRangePicker } from "@/Components/TimeRangePicker/hooks/useTimeRangePicker";
import type { TimeRangePickerProps } from "@/Components/TimeRangePicker/timeRangePicker.types";

function TimeRangePicker(props: TimeRangePickerProps) {
  const {
    merged,
    endBind,
    rootBind,
    endTitle,
    startBind,
    startTitle,
    footerBind,
    titlesBind,
    panelsBind,
    showFooter,
    applyLabel,
    handleApply,
    cancelLabel,
    titleGapBind,
    endTitleBind,
    handleCancel,
    startTitleBind,
    endDisplayValue,
    handleEndChange,
    applyButtonProps,
    startDisplayValue,
    cancelButtonProps,
    handleStartChange,
  } = useTimeRangePicker(props, {
    ampm: false,
    interval: 1,
    rounded: "md",
    color: "primary",
    showSeconds: false,
  });

  return (
    <div {...rootBind}>
      <div className={titlesBind}>
        <p className={startTitleBind}>{startTitle}</p>
        <span aria-hidden className={titleGapBind} />
        <p className={endTitleBind}>{endTitle}</p>
      </div>

      <div {...panelsBind}>
        <div {...startBind}>
          <TimePanel
            ampm={merged.ampm}
            fill={merged.fill}
            color={merged.color}
            error={merged.error}
            maxTime={merged.maxTime}
            minTime={merged.minTime}
            rounded={merged.rounded}
            value={startDisplayValue}
            disabled={merged.disabled}
            interval={merged.interval}
            readOnly={merged.readOnly}
            timeZone={merged.timeZone}
            onChange={handleStartChange}
            showSeconds={merged.showSeconds}
            disableTimes={merged.disableTimes}
          />
        </div>

        <Divider orientation="vertical" />

        <div {...endBind}>
          <TimePanel
            ampm={merged.ampm}
            fill={merged.fill}
            color={merged.color}
            error={merged.error}
            value={endDisplayValue}
            maxTime={merged.maxTime}
            minTime={merged.minTime}
            rounded={merged.rounded}
            disabled={merged.disabled}
            interval={merged.interval}
            readOnly={merged.readOnly}
            timeZone={merged.timeZone}
            onChange={handleEndChange}
            showSeconds={merged.showSeconds}
            disableTimes={merged.disableTimes}
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

export default TimeRangePicker;
