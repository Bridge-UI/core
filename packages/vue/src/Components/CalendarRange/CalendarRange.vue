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
} = useCalendarRange(
  props,
  {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
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
      <div class="flex w-full min-w-0 items-center gap-x-2">
        <button v-if="showYearSelector" v-bind="yearSelectorBind">
          <span>{{ yearLabel }}</span>

          <Icon
            size="2xs"
            icon="chevronDown"
            v-bind="navIconBind"
            :class="chevronClass(view === 'year')"
          />
        </button>

        <button v-if="showMonthSelector" v-bind="monthSelectorBind">
          <span>{{ monthLabel }}</span>

          <Icon
            size="2xs"
            icon="chevronDown"
            v-bind="navIconBind"
            :class="chevronClass(view === 'month')"
          />
        </button>
      </div>

      <div class="flex items-center">
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

    <div v-bind="bodyBind">
      <div v-bind="panelsBind" v-if="view === 'date'">
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
            v-on:view-date-change="handleStartViewDateChange"
            v-on:preview-date-change="handlePreviewDateChange"
          >
            <template #day="cell">
              <slot name="day" v-bind="cell">{{ cell.label }}</slot>
            </template>
          </CalendarDate>
        </div>

        <div v-bind="endBind">
          <p
            class="mb-1 px-1 text-center text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            {{ endMonthLabel }}
          </p>

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
            v-on:view-date-change="handleEndViewDateChange"
            v-on:preview-date-change="handlePreviewDateChange"
          >
            <template #day="cell">
              <slot name="day" v-bind="cell">{{ cell.label }}</slot>
            </template>
          </CalendarDate>
        </div>
      </div>

      <CalendarMonth
        v-bind="shared"
        :year="viewYear"
        :value="viewMonth"
        v-else-if="view === 'month'"
        v-on:change="handleMonthSelect"
        :disable-months="merged.disableMonths"
      />

      <CalendarYear
        v-bind="shared"
        :value="viewYear"
        :page-size="yearPageSize"
        :start-year="yearPageStart"
        v-else-if="view === 'year'"
        v-on:change="handleYearSelect"
        :disable-years="merged.disableYears"
      />
    </div>
  </div>
</template>
