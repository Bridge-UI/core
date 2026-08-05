// ** Local Imports
import type { CalendarYearProps } from "@/Components/CalendarYear/calendarYear.types";
import { useCalendarYear } from "@/Components/CalendarYear/hooks/useCalendarYear";

function CalendarYear(props: CalendarYearProps) {
  const { years, rootBind, gridBind, getYearBind } = useCalendarYear(props, {
    pageSize: 15,
    color: "primary",
  });

  return (
    <div {...rootBind}>
      <div {...gridBind}>
        {years.map((cell) => (
          <button key={cell.year} {...getYearBind(cell)}>
            {cell.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CalendarYear;
