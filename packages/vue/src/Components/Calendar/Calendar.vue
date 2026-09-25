<script setup lang="ts">
// ** External Imports
import { isString } from "es-toolkit/compat";
import { ref, toValue } from "vue";

// ** Core Imports
import type { DatePickerModel } from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

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
import { useOptionalModel } from "@/Utils";

defineSlots<CalendarSlots>();

defineOptions({ inheritAttrs: false });

const emit = defineEmits<CalendarEmits>();

const model = defineModel<DatePickerModel>();

const props = defineProps<CalendarOwnProps>();

const uncontrolledValue = ref<DatePickerModel>(props.defaultValue ?? null);

const value = useOptionalModel(model, uncontrolledValue);

const {
  view,
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
  granularity,
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
  value,
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

      <div v-if="showNav" class="flex items-center">
        <button v-bind="previousButtonBind">
          <Icon size="sm" icon="chevronLeft" v-bind="navIconBind" />
        </button>

        <button v-bind="todayButtonBind">
          <span class="size-2 rounded-full bg-dark-600 dark:bg-dark-300" />
        </button>

        <button v-bind="nextButtonBind">
          <Icon size="sm" icon="chevronRight" v-bind="navIconBind" />
        </button>
      </div>
    </div>

    <div v-bind="bodyBind">
      <CalendarDate
        v-bind="shared"
        :model-value="value"
        :range="merged.range"
        :view-date="viewDate"
        v-if="view === 'date'"
        v-on:change="handleChange"
        :multiple="merged.multiple"
        :preview-date="props.previewDate"
        v-on:view-date-change="setViewDate"
        :start-of-week="merged.startOfWeek"
        :disable-dates="merged.disableDates"
        :disable-years="merged.disableYears"
        :hide-weekdays="merged.hideWeekdays"
        :disable-months="merged.disableMonths"
        :hide-outside-days="merged.hideOutsideDays"
        v-on:preview-date-change="emit('previewDateChange', $event)"
      >
        <template #day="cell">
          <slot name="day" v-bind="cell">{{ cell.label }}</slot>
        </template>
      </CalendarDate>

      <CalendarMonth
        v-bind="shared"
        :year="viewYear"
        :range="merged.range"
        :model-value="viewMonth"
        :multiple="merged.multiple"
        v-else-if="view === 'month'"
        v-on:change="handleMonthSelect"
        :preview-date="props.previewDate"
        :disable-dates="merged.disableDates"
        :disable-years="merged.disableYears"
        :disable-months="merged.disableMonths"
        :selection="granularity === 'month' ? value : undefined"
        v-on:preview-date-change="emit('previewDateChange', $event)"
      />

      <CalendarYear
        v-bind="shared"
        :range="merged.range"
        :model-value="viewYear"
        :page-size="yearPageSize"
        :start-year="yearPageStart"
        v-else-if="view === 'year'"
        :multiple="merged.multiple"
        v-on:change="handleYearSelect"
        :preview-date="props.previewDate"
        :disable-dates="merged.disableDates"
        :disable-years="merged.disableYears"
        :selection="granularity === 'year' ? value : undefined"
        v-on:preview-date-change="emit('previewDateChange', $event)"
      />
    </div>
  </div>
</template>
