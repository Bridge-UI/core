// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import { CalendarDate } from "@/Components/CalendarDate";
import { CalendarMonth } from "@/Components/CalendarMonth";
import type { CalendarRangeProps } from "@/Components/CalendarRange/calendarRange.types";
import { useCalendarRange } from "@/Components/CalendarRange/hooks/useCalendarRange";
import { CalendarYear } from "@/Components/CalendarYear";
import { Icon } from "@/Components/Icon";

function CalendarRange(props: CalendarRangeProps) {
  const {
    view,
    value,
    shared,
    merged,
    endBind,
    rootBind,
    bodyBind,
    viewDate,
    viewYear,
    startBind,
    viewMonth,
    yearLabel,
    monthLabel,
    headerBind,
    panelsBind,
    endViewDate,
    previewDate,
    navIconBind,
    handleChange,
    yearPageSize,
    endMonthLabel,
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
    handleEndViewDateChange,
    handlePreviewDateChange,
    handleStartViewDateChange,
  } = useCalendarRange(props, {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
  });

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
      </div>

      <div {...bodyBind}>
        {view === "date" && (
          <div {...panelsBind}>
            <div {...startBind}>
              <CalendarDate
                {...shared}
                range
                value={value}
                viewDate={viewDate}
                slots={props.slots}
                onChange={handleChange}
                previewDate={previewDate}
                startOfWeek={merged.startOfWeek}
                disableDates={merged.disableDates}
                disableYears={merged.disableYears}
                hideWeekdays={merged.hideWeekdays}
                disableMonths={merged.disableMonths}
                onViewDateChange={handleStartViewDateChange}
                onPreviewDateChange={handlePreviewDateChange}
              />
            </div>

            <div {...endBind}>
              <p className="mb-1 px-1 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                {endMonthLabel}
              </p>

              <CalendarDate
                {...shared}
                range
                value={value}
                slots={props.slots}
                viewDate={endViewDate}
                onChange={handleChange}
                previewDate={previewDate}
                startOfWeek={merged.startOfWeek}
                disableDates={merged.disableDates}
                disableYears={merged.disableYears}
                hideWeekdays={merged.hideWeekdays}
                disableMonths={merged.disableMonths}
                onViewDateChange={handleEndViewDateChange}
                onPreviewDateChange={handlePreviewDateChange}
              />
            </div>
          </div>
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

export default CalendarRange;
