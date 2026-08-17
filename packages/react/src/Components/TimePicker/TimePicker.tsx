// ** Local Imports
import { Button } from "@/Components/Button";
import { TimePanel } from "@/Components/TimePanel";
import { useTimePicker } from "@/Components/TimePicker/hooks/useTimePicker";
import type { TimePickerProps } from "@/Components/TimePicker/timePicker.types";

function TimePicker(props: TimePickerProps) {
  const {
    merged,
    rootBind,
    footerBind,
    showFooter,
    applyLabel,
    timeTokens,
    contentBind,
    handleApply,
    cancelLabel,
    displayValue,
    handleCancel,
    applyButtonProps,
    cancelButtonProps,
    handlePanelChange,
  } = useTimePicker(props, {
    ampm: false,
    interval: 1,
    rounded: "md",
    color: "primary",
    showSeconds: false,
  });

  return (
    <div {...rootBind}>
      <div className={contentBind}>
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
        />
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

export default TimePicker;
