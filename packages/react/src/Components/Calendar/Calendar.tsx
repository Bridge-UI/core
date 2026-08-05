// ** Local Imports
import type { CalendarProps } from "@/Components/Calendar/calendar.types";
import { useCalendar } from "@/Components/Calendar/hooks/useCalendar";
import { CalendarDate } from "@/Components/CalendarDate";
import { CalendarMonth } from "@/Components/CalendarMonth";
import { CalendarYear } from "@/Components/CalendarYear";
import { Icon } from "@/Components/Icon";

function Calendar(props: CalendarProps) {
  const {
    view,
    value,
    merged,
    rootBind,
    viewDate,
    viewYear,
    viewMonth,
    yearLabel,
    monthLabel,
    headerBind,
    navIconBind,
    setViewDate,
    showDateNav,
    handleChange,
    nextButtonBind,
    todayButtonBind,
    yearSelectorBind,
    handleYearSelect,
    showYearSelector,
    monthSelectorBind,
    handleMonthSelect,
    showMonthSelector,
    previousButtonBind,
  } = useCalendar(props, {
    startOfWeek: 0,
    color: "primary",
    defaultView: "date",
  });

  const shared = {
    color: merged.color,
    locale: merged.locale,
    tokens: merged.tokens,
    maxDate: merged.maxDate,
    minDate: merged.minDate,
    disabled: merged.disabled,
    readOnly: merged.readOnly,
    timeZone: merged.timeZone,
    disableYears: merged.disableYears,
    disableMonths: merged.disableMonths,
  };

  return (
    <div {...rootBind}>
      <div {...headerBind}>
        <div className="flex min-w-0 items-center gap-1">
          {showYearSelector && (
            <button {...yearSelectorBind}>
              <span>{yearLabel}</span>

              <Icon size="xs" icon="chevronDown" {...navIconBind} />
            </button>
          )}

          {showMonthSelector && (
            <button {...monthSelectorBind}>
              <span className="underline decoration-gray-300 underline-offset-4">
                {monthLabel}
              </span>

              <Icon size="xs" icon="chevronDown" {...navIconBind} />
            </button>
          )}
        </div>

        {showDateNav && (
          <div className="flex items-center gap-0.5">
            <button {...previousButtonBind}>
              <Icon size="sm" icon="chevronLeft" {...navIconBind} />
            </button>

            <button {...todayButtonBind}>
              <span className="block h-2.5 w-2.5 rounded-full bg-gray-700 dark:bg-gray-200" />
            </button>

            <button {...nextButtonBind}>
              <Icon size="sm" icon="chevronRight" {...navIconBind} />
            </button>
          </div>
        )}
      </div>

      {view === "date" && (
        <CalendarDate
          {...shared}
          value={value}
          viewDate={viewDate}
          range={merged.range}
          onChange={handleChange}
          multiple={merged.multiple}
          onViewDateChange={setViewDate}
          startOfWeek={merged.startOfWeek}
          disableDates={merged.disableDates}
          hideWeekdays={merged.hideWeekdays}
        />
      )}

      {view === "month" && (
        <CalendarMonth
          {...shared}
          year={viewYear}
          value={viewMonth}
          onChange={handleMonthSelect}
        />
      )}

      {view === "year" && (
        <CalendarYear
          {...shared}
          value={viewYear}
          onChange={handleYearSelect}
        />
      )}
    </div>
  );
}

export default Calendar;
