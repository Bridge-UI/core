// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { CalendarDate } from "@/Components/CalendarDate";
import { CalendarMonth } from "@/Components/CalendarMonth";
import type { CalendarRangeProps } from "@/Components/CalendarRange/calendarRange.types";
import { useCalendarRange } from "@/Components/CalendarRange/hooks/useCalendarRange";
import { CalendarYear } from "@/Components/CalendarYear";
import { Divider } from "@/Components/Divider";
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
    handleChange,
    yearPageSize,
    endMonthLabel,
    yearPageStart,
    endHeaderBind,
    monthYearBind,
    nextButtonBind,
    monthPanelYear,
    todayButtonBind,
    monthPanelValue,
    startHeaderBind,
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
        className={chevronClass(view === "month")}
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
        className={chevronClass(view === "month")}
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

  const showCenteredHeader = view === "year" || (isVertical && view === "date");
  const centeredMonthButton = view === "date" ? startMonthButton : null;

  return (
    <div {...rootBind}>
      <div {...headerBind}>
        {showCenteredHeader ? (
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center">
            <div className="flex justify-start">{yearButton}</div>

            <div {...monthsBind}>{centeredMonthButton}</div>

            <div className="flex justify-end">{navButtons}</div>
          </div>
        ) : (
          <>
            <div {...startHeaderBind}>
              {yearButton}
              <div className="ml-auto">{startMonthButton}</div>
            </div>

            <div {...endHeaderBind}>
              {endMonthButton}
              <div className="ml-auto">{navButtons}</div>
            </div>
          </>
        )}
      </div>

      <div {...bodyBind}>
        <div {...panelsBind}>
          <div
            className={cn("flex min-w-max flex-1 items-stretch", {
              "pb-2.5": isVertical,
            })}
          >
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
                slots={props.slots?.day ? { day: props.slots.day } : undefined}
              />
            </div>

            {props.slots?.startAside}
          </div>

          <Divider
            className={isVertical ? "mx-2.5" : undefined}
            orientation={isVertical ? "horizontal" : "vertical"}
          />

          <div
            className={cn("flex min-w-max flex-1 flex-col", {
              "pt-2.5": isVertical,
            })}
          >
            {isVertical && view === "date" && endMonthButton ? (
              <div {...endHeaderBind}>{endMonthButton}</div>
            ) : null}

            <div className="flex min-w-max flex-1 items-stretch">
              <div {...endBind}>
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
        </div>

        {view === "month" && (
          <div className={monthYearBind}>
            <CalendarMonth
              {...shared}
              year={monthPanelYear}
              value={monthPanelValue}
              onChange={handleMonthSelect}
              disableMonths={merged.disableMonths}
              classes={{
                month: "min-h-0",
                grid: "h-full auto-rows-fr",
                root: "h-full min-h-0 flex-1",
              }}
            />
          </div>
        )}

        {view === "year" && (
          <div className={monthYearBind}>
            <CalendarYear
              {...shared}
              value={viewYear}
              pageSize={yearPageSize}
              startYear={yearPageStart}
              onChange={handleYearSelect}
              disableYears={merged.disableYears}
              classes={{
                year: "min-h-0",
                grid: "h-full auto-rows-fr",
                root: "h-full min-h-0 flex-1",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarRange;
