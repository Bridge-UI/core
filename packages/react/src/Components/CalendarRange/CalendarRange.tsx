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
    yearLabel,
    monthLabel,
    headerBind,
    panelsBind,
    endViewDate,
    previewDate,
    navIconBind,
    monthTarget,
    handleChange,
    yearPageSize,
    endMonthLabel,
    yearPageStart,
    nextButtonBind,
    pickerFillBind,
    monthPanelYear,
    todayButtonBind,
    monthPanelValue,
    yearSelectorBind,
    handleYearSelect,
    showYearSelector,
    monthSelectorBind,
    handleMonthSelect,
    showMonthSelector,
    previousButtonBind,
    endMonthSelectorBind,
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
              className={chevronClass(
                view === "month" && monthTarget === "start",
              )}
            />
          </button>
        )}

        {showMonthSelector && (
          <button {...endMonthSelectorBind}>
            <span>{endMonthLabel}</span>

            <Icon
              size="2xs"
              icon="chevronDown"
              {...navIconBind}
              className={chevronClass(
                view === "month" && monthTarget === "end",
              )}
            />
          </button>
        )}

        <div className="flex shrink-0 items-center">
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
          <div className={pickerFillBind}>
            <CalendarMonth
              {...shared}
              key={monthTarget}
              year={monthPanelYear}
              value={monthPanelValue}
              onChange={handleMonthSelect}
              disableMonths={merged.disableMonths}
              classes={{
                root: "h-full",
                month: "min-h-16",
                grid: "h-full auto-rows-fr",
              }}
            />
          </div>
        )}

        {view === "year" && (
          <div className={pickerFillBind}>
            <CalendarYear
              {...shared}
              value={viewYear}
              pageSize={yearPageSize}
              startYear={yearPageStart}
              onChange={handleYearSelect}
              disableYears={merged.disableYears}
              classes={{
                root: "h-full",
                year: "min-h-16",
                grid: "h-full auto-rows-fr",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarRange;
