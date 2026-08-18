// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

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
    showNav,
    rootBind,
    viewDate,
    viewYear,
    bodyBind,
    viewMonth,
    yearLabel,
    monthLabel,
    headerBind,
    navIconBind,
    setViewDate,
    handleChange,
    yearPageSize,
    yearPageStart,
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
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    defaultView: "date",
  });

  const shared = {
    color: merged.color,
    error: merged.error,
    rounded: merged.rounded,
    maxDate: merged.maxDate,
    minDate: merged.minDate,
    disabled: merged.disabled,
    readOnly: merged.readOnly,
    timeZone: merged.timeZone,
  };

  const chevronClass = (open: boolean) => {
    return cn({
      "size-3 transition-all duration-200 ease-in-out": true,
      [navIconBind?.className ?? ""]: true,
      "rotate-180": open,
    });
  };

  return (
    <div {...rootBind}>
      <div {...headerBind}>
        <div className="flex w-full min-w-0 items-center gap-x-2">
          {showYearSelector && (
            <button {...yearSelectorBind}>
              <span>{yearLabel}</span>

              <Icon
                size="2xs"
                icon="chevronDown"
                {...navIconBind}
                className={chevronClass(view === "year")}
              />
            </button>
          )}

          {showMonthSelector && (
            <button {...monthSelectorBind}>
              <span>{monthLabel}</span>

              <Icon
                size="2xs"
                icon="chevronDown"
                {...navIconBind}
                className={chevronClass(view === "month")}
              />
            </button>
          )}
        </div>

        {showNav && (
          <div className="flex items-center">
            <button {...previousButtonBind}>
              <Icon size="sm" icon="chevronLeft" {...navIconBind} />
            </button>

            <button {...todayButtonBind}>
              <span className="size-2 rounded-full bg-slate-600 dark:bg-slate-300" />
            </button>

            <button {...nextButtonBind}>
              <Icon size="sm" icon="chevronRight" {...navIconBind} />
            </button>
          </div>
        )}
      </div>

      <div {...bodyBind}>
        {view === "date" && (
          <CalendarDate
            {...shared}
            value={value}
            viewDate={viewDate}
            slots={props.slots}
            range={merged.range}
            onChange={handleChange}
            multiple={merged.multiple}
            onViewDateChange={setViewDate}
            previewDate={props.previewDate}
            startOfWeek={merged.startOfWeek}
            disableDates={merged.disableDates}
            disableYears={merged.disableYears}
            hideWeekdays={merged.hideWeekdays}
            disableMonths={merged.disableMonths}
            hideOutsideDays={merged.hideOutsideDays}
            onPreviewDateChange={props.onPreviewDateChange}
          />
        )}

        {view === "month" && (
          <CalendarMonth
            {...shared}
            year={viewYear}
            value={viewMonth}
            onChange={handleMonthSelect}
            disableMonths={merged.disableMonths}
          />
        )}

        {view === "year" && (
          <CalendarYear
            {...shared}
            value={viewYear}
            pageSize={yearPageSize}
            startYear={yearPageStart}
            onChange={handleYearSelect}
            disableYears={merged.disableYears}
          />
        )}
      </div>
    </div>
  );
}

export default Calendar;
