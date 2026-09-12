// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import { TimePanel } from "@/Components/TimePanel";
import { useTimePicker } from "@/Components/TimePicker/hooks/useTimePicker";
import type { TimePickerProps } from "@/Components/TimePicker/timePicker.types";

function TimePicker(props: TimePickerProps) {
  const {
    merged,
    rootBind,
    footerBind,
    showFooter,
    contentBind,
    handleApply,
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
          fill={merged.fill}
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

export default TimePicker;
