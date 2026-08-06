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
    rounded: "sm",
    startOfWeek: 0,
    color: "primary",
  });

  return (
    <div {...rootBind}>
      <div {...gridBind}>
        {!hideWeekdays &&
          weekdays.map((label, index) => (
            <span key={`${label}-${index}`} {...getWeekdayBind(label)}>
              {label}
            </span>
          ))}

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
