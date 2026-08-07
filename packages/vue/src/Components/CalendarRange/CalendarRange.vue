<script setup lang="ts">
// ** External Imports
import { isString } from "es-toolkit/compat";
import { toValue } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import CalendarDate from "@/Components/CalendarDate/CalendarDate.vue";
import CalendarMonth from "@/Components/CalendarMonth/CalendarMonth.vue";
import type {
  CalendarRangeEmits,
  CalendarRangeOwnProps,
  CalendarRangeSlots,
} from "@/Components/CalendarRange/calendarRange.types";
import { useCalendarRange } from "@/Components/CalendarRange/composables/useCalendarRange";
import CalendarYear from "@/Components/CalendarYear/CalendarYear.vue";
import { Icon } from "@/Components/Icon";

defineOptions({ inheritAttrs: false });

defineSlots<CalendarRangeSlots>();

const props = defineProps<CalendarRangeOwnProps>();

const emit = defineEmits<CalendarRangeEmits>();

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
} = useCalendarRange(
  props,
  {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    orientation: "horizontal",
  },
  emit,
);

function chevronClass(open: boolean) {
  const navIconClass = toValue(navIconBind)?.class;

  return cn({
    "size-3 transition-all duration-200 ease-in-out": true,
    [isString(navIconClass) ? navIconClass : ""]: true,
    "rotate-180": open,
  });
}
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="headerBind">
      <div class="flex min-w-0 flex-1 items-center justify-start">
        <button v-if="showYearSelector" v-bind="yearSelectorBind">
          <span>{{ yearLabel }}</span>

          <Icon
            size="2xs"
            icon="chevronDown"
            v-bind="navIconBind"
            :class="chevronClass(view === 'year')"
          />
        </button>
      </div>

      <div v-bind="monthsBind">
        <button v-if="showMonthSelector" v-bind="monthSelectorBind">
          <span>{{ monthLabel }}</span>

          <Icon
            size="2xs"
            icon="chevronDown"
            v-bind="navIconBind"
            :class="chevronClass(view === 'month' && monthTarget === 'start')"
          />
        </button>

        <button
          v-bind="endMonthSelectorBind"
          v-if="showMonthSelector && !isVertical"
        >
          <span>{{ endMonthLabel }}</span>

          <Icon
            size="2xs"
            icon="chevronDown"
            v-bind="navIconBind"
            :class="chevronClass(view === 'month' && monthTarget === 'end')"
          />
        </button>
      </div>

      <div class="flex min-w-0 flex-1 items-center justify-end">
        <div class="flex shrink-0 items-center">
          <button v-bind="previousButtonBind">
            <Icon size="sm" icon="chevronLeft" v-bind="navIconBind" />
          </button>

          <button v-bind="todayButtonBind">
            <span class="size-2 rounded-full bg-slate-600 dark:bg-slate-300" />
          </button>

          <button v-bind="nextButtonBind">
            <Icon size="sm" icon="chevronRight" v-bind="navIconBind" />
          </button>
        </div>
      </div>
    </div>

    <div v-bind="bodyBind">
      <div v-bind="panelsBind" v-if="view === 'date'">
        <div class="flex shrink-0 items-stretch">
          <div v-bind="startBind">
            <CalendarDate
              v-bind="shared"
              range
              :value="value"
              :view-date="viewDate"
              v-on:change="handleChange"
              :preview-date="previewDate"
              :start-of-week="merged.startOfWeek"
              :disable-dates="merged.disableDates"
              :disable-years="merged.disableYears"
              :hide-weekdays="merged.hideWeekdays"
              :disable-months="merged.disableMonths"
              :hide-outside-days="merged.hideOutsideDays"
              v-on:view-date-change="handleStartViewDateChange"
              v-on:preview-date-change="handlePreviewDateChange"
            >
              <template #day="cell">
                <slot name="day" v-bind="cell">{{ cell.label }}</slot>
              </template>
            </CalendarDate>
          </div>

          <slot name="startAside" />
        </div>

        <div class="flex shrink-0 items-stretch">
          <div v-bind="endBind">
            <div v-bind="endHeaderBind" v-if="isVertical && showMonthSelector">
              <button v-bind="endMonthSelectorBind">
                <span>{{ endMonthLabel }}</span>

                <Icon
                  size="2xs"
                  icon="chevronDown"
                  v-bind="navIconBind"
                  :class="chevronClass(false)"
                />
              </button>
            </div>

            <CalendarDate
              v-bind="shared"
              range
              :value="value"
              :view-date="endViewDate"
              v-on:change="handleChange"
              :preview-date="previewDate"
              :start-of-week="merged.startOfWeek"
              :disable-dates="merged.disableDates"
              :disable-years="merged.disableYears"
              :hide-weekdays="merged.hideWeekdays"
              :disable-months="merged.disableMonths"
              :hide-outside-days="merged.hideOutsideDays"
              v-on:view-date-change="handleEndViewDateChange"
              v-on:preview-date-change="handlePreviewDateChange"
            >
              <template #day="cell">
                <slot name="day" v-bind="cell">{{ cell.label }}</slot>
              </template>
            </CalendarDate>
          </div>

          <slot name="endAside" />
        </div>
      </div>

      <div :class="pickerFillBind" v-else-if="view === 'month'">
        <CalendarMonth
          v-bind="shared"
          :key="monthTarget"
          :year="monthPanelYear"
          :value="monthPanelValue"
          v-on:change="handleMonthSelect"
          :disable-months="merged.disableMonths"
          :classes="{
            root: 'h-full',
            grid: 'h-full auto-rows-fr',
            month: 'min-h-16',
          }"
        />
      </div>

      <div :class="pickerFillBind" v-else-if="view === 'year'">
        <CalendarYear
          v-bind="shared"
          :value="viewYear"
          :page-size="yearPageSize"
          :start-year="yearPageStart"
          v-on:change="handleYearSelect"
          :disable-years="merged.disableYears"
          :classes="{
            root: 'h-full',
            grid: 'h-full auto-rows-fr',
            year: 'min-h-16',
          }"
        />
      </div>
    </div>
  </div>
</template>
