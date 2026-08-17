// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type { DateTimeFieldProps } from "@/Components/DateTimeField/dateTimeField.types";
import { useDateTimeField } from "@/Components/DateTimeField/hooks/useDateTimeField";
import { DateTimePicker } from "@/Components/DateTimePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";

function DateTimeField(props: DateTimeFieldProps) {
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
    dateTimeOnly,
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    dateTimePickerCustomProps,
  } = useDateTimeField(props);

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
        <DateTimePicker
          fill={fill}
          value={modelValue}
          showFooter={showFooter}
          ampm={dateTimeOnly.ampm}
          readOnly={props.readonly}
          className={pickerClassName}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
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
          invalidated={formField.invalidated}
          hideMonths={dateTimeOnly.hideMonths}
          showSeconds={dateTimeOnly.showSeconds}
          defaultView={dateTimeOnly.defaultView}
          startOfWeek={dateTimeOnly.startOfWeek}
          customProps={dateTimePickerCustomProps}
          disableDates={dateTimeOnly.disableDates}
          hideWeekdays={dateTimeOnly.hideWeekdays}
          disableTimes={dateTimeOnly.disableTimes}
          disableYears={dateTimeOnly.disableYears}
          disableMonths={dateTimeOnly.disableMonths}
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

export default DateTimeField;
