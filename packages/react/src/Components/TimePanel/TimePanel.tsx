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

  return (
    <div {...rootBind}>
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
