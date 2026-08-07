// ** Local Imports
import type { CalendarMonthProps } from "@/Components/CalendarMonth/calendarMonth.types";
import { useCalendarMonth } from "@/Components/CalendarMonth/hooks/useCalendarMonth";

function CalendarMonth(props: CalendarMonthProps) {
  const { months, rootBind, gridBind, getMonthBind } = useCalendarMonth(props, {
    rounded: "md",
    color: "primary",
  });

  return (
    <div {...rootBind}>
      <div {...gridBind}>
        {months.map((cell) => (
          <button key={cell.month} {...getMonthBind(cell)}>
            {cell.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CalendarMonth;
