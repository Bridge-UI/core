// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type { DateTimeRangeFieldProps } from "@/Components/DateTimeRangeField/dateTimeRangeField.types";
import { useDateTimeRangeField } from "@/Components/DateTimeRangeField/hooks/useDateTimeRangeField";
import { DateTimeRangePicker } from "@/Components/DateTimeRangePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";

function DateTimeRangeField(props: DateTimeRangeFieldProps) {
  const resolveMessage = useResolveMessage();

  const {
    open,
    fill,
    daySlot,
    overlay,
    formField,
    inputBind,
    clearBind,
    footerSlot,
    clearValue,
    modelValue,
    showFooter,
    orientation,
    dateTimeOnly,
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    dateTimeRangePickerCustomProps,
  } = useDateTimeRangeField(props);

  return (
    <>
      <FormField field={formField}>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <input {...inputBind} />

          {showClearIcon ? (
            <span
              {...clearBind}
              onClick={() => clearValue()}
              aria-label={resolveMessage("Clear")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  clearValue();
                }
              }}
            >
              <Icon
                icon="clear"
                size={clearIconSize}
                {...props.customProps?.clearIcon}
              />
            </span>
          ) : null}
        </div>
      </FormField>

      <FieldOverlay
        show={open}
        overlay={overlay}
        onShowChange={handleOpenChange}
        customProps={overlayCustomProps}
      >
        <DateTimeRangePicker
          fill={fill}
          value={modelValue}
          showFooter={showFooter}
          ampm={dateTimeOnly.ampm}
          readOnly={props.readonly}
          orientation={orientation}
          className={pickerClassName}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
          error={formField.invalidated}
          maxDate={dateTimeOnly.maxDate}
          maxTime={dateTimeOnly.maxTime}
          minDate={dateTimeOnly.minDate}
          minTime={dateTimeOnly.minTime}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          timeZone={dateTimeOnly.timeZone}
          interval={dateTimeOnly.interval}
          hideYears={dateTimeOnly.hideYears}
          rounded={formField.merged.rounded}
          hideMonths={dateTimeOnly.hideMonths}
          showSeconds={dateTimeOnly.showSeconds}
          startOfWeek={dateTimeOnly.startOfWeek}
          disableDates={dateTimeOnly.disableDates}
          hideWeekdays={dateTimeOnly.hideWeekdays}
          disableTimes={dateTimeOnly.disableTimes}
          disableYears={dateTimeOnly.disableYears}
          disableMonths={dateTimeOnly.disableMonths}
          customProps={dateTimeRangePickerCustomProps}
          hideOutsideDays={dateTimeOnly.hideOutsideDays}
          slots={
            daySlot || footerSlot
              ? { day: daySlot, footer: footerSlot }
              : undefined
          }
        />
      </FieldOverlay>
    </>
  );
}

export default DateTimeRangeField;
