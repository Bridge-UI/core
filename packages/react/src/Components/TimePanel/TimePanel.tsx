// ** External Imports
import { useLayoutEffect, useRef } from "react";

// ** Local Imports
import { useTimePanel } from "@/Components/TimePanel/hooks/useTimePanel";
import type { TimePanelProps } from "@/Components/TimePanel/timePanel.types";

/**
 * Centers a selected tile in its overflow column without scrolling the page.
 */
function scrollSelectedTimeItemsIntoView(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[aria-pressed="true"]').forEach((el) => {
    const column = el.parentElement;

    if (!column) {
      return;
    }

    column.scrollTop = Math.max(
      0,
      el.offsetTop - column.clientHeight / 2 + el.offsetHeight / 2,
    );
  });
}

function TimePanel(props: TimePanelProps) {
  const {
    rootBind,
    hourItems,
    columnBind,
    getHourBind,
    minuteItems,
    showMeridiem,
    getMinuteBind,
    meridiemItems,
    getMeridiemBind,
  } = useTimePanel(props, {
    ampm: false,
    interval: 1,
    rounded: "md",
    color: "primary",
  });

  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    scrollSelectedTimeItemsIntoView(root);
  }, [hourItems, minuteItems, meridiemItems]);

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
