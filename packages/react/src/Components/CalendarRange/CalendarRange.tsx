// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

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
    monthsBind,
    panelsBind,
    isVertical,
    endViewDate,
    previewDate,
    navIconBind,
    monthTarget,
    handleChange,
    yearPageSize,
    endMonthLabel,
    yearPageStart,
    endHeaderBind,
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
    orientation: "horizontal",
  });

  const chevronClass = (open: boolean) => {
    return cn({
      "size-3 transition-all duration-200 ease-in-out": true,
      [navIconBind?.className ?? ""]: true,
      "rotate-180": open,
    });
  };

  const navButtons = (
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
  );

  const startMonthButton = showMonthSelector ? (
    <button {...monthSelectorBind}>
      <span>{monthLabel}</span>

      <Icon
        size="2xs"
        icon="chevronDown"
        {...navIconBind}
        className={chevronClass(view === "month" && monthTarget === "start")}
      />
    </button>
  ) : null;

  const endMonthButton = showMonthSelector ? (
    <button {...endMonthSelectorBind}>
      <span>{endMonthLabel}</span>

      <Icon
        size="2xs"
        icon="chevronDown"
        {...navIconBind}
        className={chevronClass(view === "month" && monthTarget === "end")}
      />
    </button>
  ) : null;

  const yearButton = showYearSelector ? (
    <button {...yearSelectorBind}>
      <span>{yearLabel}</span>

      <Icon
        size="2xs"
        icon="chevronDown"
        {...navIconBind}
        className={chevronClass(view === "year")}
      />
    </button>
  ) : null;

  return (
    <div {...rootBind}>
      <div {...headerBind}>
        <div className="flex shrink-0 items-center justify-start">
          {yearButton}
        </div>

        <div {...monthsBind}>
          {startMonthButton}
          {!isVertical && endMonthButton}
        </div>

        <div className="flex shrink-0 items-center justify-end">
          {navButtons}
        </div>
      </div>

      <div {...bodyBind}>
        {view === "date" && (
          <div {...panelsBind}>
            <div className="flex min-w-72 flex-1 items-stretch">
              <div {...startBind}>
                <CalendarDate
                  {...shared}
                  range
                  value={value}
                  viewDate={viewDate}
                  onChange={handleChange}
                  previewDate={previewDate}
                  startOfWeek={merged.startOfWeek}
                  disableDates={merged.disableDates}
                  disableYears={merged.disableYears}
                  hideWeekdays={merged.hideWeekdays}
                  disableMonths={merged.disableMonths}
                  hideOutsideDays={merged.hideOutsideDays}
                  onViewDateChange={handleStartViewDateChange}
                  onPreviewDateChange={handlePreviewDateChange}
                  slots={
                    props.slots?.day ? { day: props.slots.day } : undefined
                  }
                />
              </div>

              {props.slots?.startAside}
            </div>

            <div className="flex min-w-72 flex-1 items-stretch">
              <div {...endBind}>
                {isVertical && endMonthButton ? (
                  <div {...endHeaderBind}>{endMonthButton}</div>
                ) : null}

                <CalendarDate
                  {...shared}
                  range
                  value={value}
                  viewDate={endViewDate}
                  onChange={handleChange}
                  previewDate={previewDate}
                  startOfWeek={merged.startOfWeek}
                  disableDates={merged.disableDates}
                  disableYears={merged.disableYears}
                  hideWeekdays={merged.hideWeekdays}
                  disableMonths={merged.disableMonths}
                  hideOutsideDays={merged.hideOutsideDays}
                  onViewDateChange={handleEndViewDateChange}
                  onPreviewDateChange={handlePreviewDateChange}
                  slots={
                    props.slots?.day ? { day: props.slots.day } : undefined
                  }
                />
              </div>

              {props.slots?.endAside}
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
