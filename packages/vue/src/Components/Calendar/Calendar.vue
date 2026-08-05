<script setup lang="ts">
// ** Local Imports
import type {
  CalendarEmits,
  CalendarOwnProps,
} from "@/Components/Calendar/calendar.types";
import { useCalendar } from "@/Components/Calendar/composables/useCalendar";
import CalendarDate from "@/Components/CalendarDate/CalendarDate.vue";
import CalendarMonth from "@/Components/CalendarMonth/CalendarMonth.vue";
import CalendarYear from "@/Components/CalendarYear/CalendarYear.vue";
import { Icon } from "@/Components/Icon";

defineOptions({ inheritAttrs: false });

const props = defineProps<CalendarOwnProps>();

const emit = defineEmits<CalendarEmits>();

const {
  view,
  value,
  merged,
  shared,
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
} = useCalendar(
  props,
  { startOfWeek: 0, color: "primary", defaultView: "date" },
  emit,
);
</script>

<template>
  <div v-bind="rootBind">
    <div v-bind="headerBind">
      <div class="flex min-w-0 items-center gap-1">
        <button v-if="showYearSelector" v-bind="yearSelectorBind">
          <span>{{ yearLabel }}</span>
          <Icon size="xs" icon="chevronDown" v-bind="navIconBind" />
        </button>

        <button v-if="showMonthSelector" v-bind="monthSelectorBind">
          <span class="underline decoration-gray-300 underline-offset-4">
            {{ monthLabel }}
          </span>
          <Icon size="xs" icon="chevronDown" v-bind="navIconBind" />
        </button>
      </div>

      <div v-if="showDateNav" class="flex items-center gap-0.5">
        <button v-bind="previousButtonBind">
          <Icon size="sm" icon="chevronLeft" v-bind="navIconBind" />
        </button>

        <button v-bind="todayButtonBind">
          <span
            class="block h-2.5 w-2.5 rounded-full bg-gray-700 dark:bg-gray-200"
          />
        </button>

        <button v-bind="nextButtonBind">
          <Icon size="sm" icon="chevronRight" v-bind="navIconBind" />
        </button>
      </div>
    </div>

    <CalendarDate
      v-bind="shared"
      :value="value"
      :range="merged.range"
      :view-date="viewDate"
      v-if="view === 'date'"
      @change="handleChange"
      :multiple="merged.multiple"
      @view-date-change="setViewDate"
      :start-of-week="merged.startOfWeek"
      :disable-dates="merged.disableDates"
      :hide-weekdays="merged.hideWeekdays"
    />

    <CalendarMonth
      v-bind="shared"
      :year="viewYear"
      :value="viewMonth"
      @change="handleMonthSelect"
      v-else-if="view === 'month'"
    />

    <CalendarYear
      v-bind="shared"
      :value="viewYear"
      @change="handleYearSelect"
      v-else-if="view === 'year'"
    />
  </div>
</template>
