// ** Local Imports
import { Button } from "@/Components/Button";
import { TimePanel } from "@/Components/TimePanel";
import { useTimeRangePicker } from "@/Components/TimeRangePicker/hooks/useTimeRangePicker";
import type { TimeRangePickerProps } from "@/Components/TimeRangePicker/timeRangePicker.types";

function TimeRangePicker(props: TimeRangePickerProps) {
  const {
    merged,
    endBind,
    rootBind,
    startBind,
    footerBind,
    panelsBind,
    showFooter,
    applyLabel,
    timeTokens,
    handleApply,
    cancelLabel,
    handleCancel,
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
    showFooter: false,
  });

  return (
    <div {...rootBind}>
      <div {...panelsBind}>
        <div {...startBind}>
          <TimePanel
            ampm={merged.ampm}
            tokens={timeTokens}
            color={merged.color}
            maxTime={merged.maxTime}
            minTime={merged.minTime}
            rounded={merged.rounded}
            value={startDisplayValue}
            disabled={merged.disabled}
            interval={merged.interval}
            readOnly={merged.readOnly}
            timeZone={merged.timeZone}
            onChange={handleStartChange}
            disableTimes={merged.disableTimes}
          />
        </div>

        <div {...endBind}>
          <TimePanel
            ampm={merged.ampm}
            tokens={timeTokens}
            color={merged.color}
            value={endDisplayValue}
            maxTime={merged.maxTime}
            minTime={merged.minTime}
            rounded={merged.rounded}
            disabled={merged.disabled}
            interval={merged.interval}
            readOnly={merged.readOnly}
            timeZone={merged.timeZone}
            onChange={handleEndChange}
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

export default TimeRangePicker;
