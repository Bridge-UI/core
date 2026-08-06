// ** Local Imports
import type { CalendarDateProps } from "@/Components/CalendarDate/calendarDate.types";
import { useCalendarDate } from "@/Components/CalendarDate/hooks/useCalendarDate";

function adapterDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function CalendarDate(props: CalendarDateProps) {
  const {
    days,
    rootBind,
    gridBind,
    weekdays,
    getDayBind,
    hideWeekdays,
    getWeekdayBind,
  } = useCalendarDate(props, {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
  });

  return (
    <div {...rootBind}>
      {!hideWeekdays && (
        <div role="row" className="grid grid-cols-7 gap-1">
          {weekdays.map((label, index) => (
            <span key={`${label}-${index}`} {...getWeekdayBind(label)}>
              {label}
            </span>
          ))}
        </div>
      )}

      <div {...gridBind}>
        {days.map((cell) => (
          <button
            key={`${adapterDayKey(cell.date)}-${cell.label}`}
            {...getDayBind(cell)}
          >
            {props.slots?.day?.(cell) ?? cell.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CalendarDate;
