// ** External Imports
import { useLayoutEffect, useRef } from "react";

// ** Core Imports
import { observeTimePanelSelectedScroll } from "@bridge-ui/core/Domain";

// ** Local Imports
import { useTimePanel } from "@/Components/TimePanel/hooks/useTimePanel";
import type { TimePanelProps } from "@/Components/TimePanel/timePanel.types";

function TimePanel(props: TimePanelProps) {
  const {
    rootBind,
    hourItems,
    columnBind,
    getHourBind,
    minuteItems,
    secondItems,
    showSeconds,
    showMeridiem,
    getMinuteBind,
    getSecondBind,
    meridiemItems,
    getMeridiemBind,
  } = useTimePanel(props, {
    ampm: false,
    interval: 1,
    rounded: "md",
    color: "primary",
    showSeconds: false,
  });

  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    return observeTimePanelSelectedScroll(root);
  }, [hourItems, minuteItems, secondItems, meridiemItems]);

  return (
    <div
      {...rootBind}
      ref={(node) => {
        rootRef.current = node;
      }}
    >
      <div {...columnBind}>
        {hourItems.map((item) => (
          <button key={`hour-${item.value}`} {...getHourBind(item)}>
            {item.label}
          </button>
        ))}
      </div>

      <div {...columnBind}>
        {minuteItems.map((item) => (
          <button key={`minute-${item.value}`} {...getMinuteBind(item)}>
            {item.label}
          </button>
        ))}
      </div>

      {showSeconds && (
        <div {...columnBind}>
          {secondItems.map((item) => (
            <button key={`second-${item.value}`} {...getSecondBind(item)}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {showMeridiem && (
        <div {...columnBind}>
          {meridiemItems.map((item) => (
            <button key={`meridiem-${item.value}`} {...getMeridiemBind(item)}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TimePanel;
