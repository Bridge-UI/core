// ** External Imports
import { useRef } from "react";

// ** Local Imports
import BaseField from "@/Components/BaseField/BaseField";
import { useSlider } from "@/Components/Slider/hooks/useSlider";
import type { SliderProps } from "@/Components/Slider/slider.types";
import { Tooltip } from "@/Components/Tooltip";
import { hasNamedSlot } from "@/Utils";

const sliderLibDefaults = {
  min: 0,
  step: 1,
  max: 100,
  size: "md",
  rounded: "full",
  color: "primary",
  showStops: false,
  showTooltip: true,
} as const;

function Slider(props: SliderProps) {
  const thumb0Ref = useRef<null | HTMLButtonElement>(null);
  const thumb1Ref = useRef<null | HTMLButtonElement>(null);

  const api = useSlider(props, sliderLibDefaults);

  const {
    barBind,
    baseField,
    trackBind,
    controlBind,
    showTooltip,
    getStopBind,
    thumbIndexes,
    tooltipProps,
    getThumbBind,
    resolvedStops,
    isTooltipOpen,
    hasStopLabels,
    readThumbValue,
    stopLabelsBind,
    getStopLabelBind,
    getThumbKnobBind,
  } = api;

  const { slots } = baseField;

  const thumbRefs = [thumb0Ref, thumb1Ref] as const;

  return (
    <BaseField field={baseField}>
      <div {...controlBind}>
        <div {...trackBind}>
          <div {...barBind} />

          {resolvedStops.map((stop) => (
            <div key={`stop-${stop.value}`} {...getStopBind(stop)} />
          ))}

          {thumbIndexes.map((thumbIndex) => {
            const thumbBind = getThumbBind(thumbIndex);
            const knobBind = getThumbKnobBind(thumbIndex);

            return (
              <button
                key={thumbIndex}
                {...thumbBind}
                ref={thumbRefs[thumbIndex]}
              >
                {hasNamedSlot(slots, "thumb") ? (
                  slots?.thumb
                ) : (
                  <span {...knobBind} />
                )}
              </button>
            );
          })}
        </div>

        {showTooltip &&
          thumbIndexes.map((thumbIndex) => (
            <Tooltip
              arrow
              size="sm"
              openDelay={0}
              closeDelay={0}
              placement="top"
              key={thumbIndex}
              show={isTooltipOpen(thumbIndex)}
              anchorEl={thumbRefs[thumbIndex]}
              content={String(readThumbValue(thumbIndex))}
              {...tooltipProps}
            />
          ))}

        {hasStopLabels && (
          <div {...stopLabelsBind}>
            {resolvedStops.map((stop) =>
              stop.label ? (
                <div key={`label-${stop.value}`} {...getStopLabelBind(stop)}>
                  {stop.label}
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </BaseField>
  );
}

export default Slider;
