<script setup lang="ts">
// ** External Imports
import { toValue } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";

// ** Local Imports
import type {
  CalendarEmits,
  CalendarOwnProps,
  CalendarSlots,
} from "@/Components/Calendar/calendar.types";
import { useCalendar } from "@/Components/Calendar/composables/useCalendar";
import CalendarDate from "@/Components/CalendarDate/CalendarDate.vue";
import CalendarMonth from "@/Components/CalendarMonth/CalendarMonth.vue";
import CalendarYear from "@/Components/CalendarYear/CalendarYear.vue";
import { Icon } from "@/Components/Icon";

defineOptions({ inheritAttrs: false });

defineSlots<CalendarSlots>();

const props = defineProps<CalendarOwnProps>();

const emit = defineEmits<CalendarEmits>();

const {
  view,
  value,
  merged,
  shared,
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
} = useCalendar(
  props,
  {
    rounded: "md",
    startOfWeek: 0,
    color: "primary",
    defaultView: "date",
  },
  emit,
);

function chevronClass(open: boolean) {
  return cn({
    "size-3 transition-all duration-200 ease-in-out": true,
    [toValue(navIconBind)?.class ?? ""]: true,
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

      <div v-if="showNav" class="flex items-center">
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
      <CalendarDate
        v-bind="shared"
        :value="value"
        :range="merged.range"
        :view-date="viewDate"
        v-if="view === 'date'"
        v-on:change="handleChange"
        :multiple="merged.multiple"
        v-on:view-date-change="setViewDate"
        :start-of-week="merged.startOfWeek"
        :disable-dates="merged.disableDates"
        :disable-years="merged.disableYears"
        :hide-weekdays="merged.hideWeekdays"
        :disable-months="merged.disableMonths"
      >
        <template #day="cell">
          <slot name="day" v-bind="cell">{{ cell.label }}</slot>
        </template>
      </CalendarDate>

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
