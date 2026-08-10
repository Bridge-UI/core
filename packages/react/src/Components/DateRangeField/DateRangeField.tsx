// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type { DateRangeFieldProps } from "@/Components/DateRangeField/dateRangeField.types";
import { useDateRangeField } from "@/Components/DateRangeField/hooks/useDateRangeField";
import { DateRangePicker } from "@/Components/DateRangePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";

function DateRangeField(props: DateRangeFieldProps) {
  const resolveMessage = useResolveMessage();

  const {
    open,
    daySlot,
    overlay,
    dateOnly,
    formField,
    inputBind,
    clearBind,
    clearValue,
    modelValue,
    showFooter,
    orientation,
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    dateRangePickerCustomProps,
  } = useDateRangeField(props);

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
        <DateRangePicker
          value={modelValue}
          showFooter={showFooter}
          readOnly={props.readonly}
          orientation={orientation}
          maxDate={dateOnly.maxDate}
          minDate={dateOnly.minDate}
          className={pickerClassName}
          timeZone={dateOnly.timeZone}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
          hideYears={dateOnly.hideYears}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          hideMonths={dateOnly.hideMonths}
          startOfWeek={dateOnly.startOfWeek}
          rounded={formField.merged.rounded}
          disableDates={dateOnly.disableDates}
          hideWeekdays={dateOnly.hideWeekdays}
          disableYears={dateOnly.disableYears}
          disableMonths={dateOnly.disableMonths}
          customProps={dateRangePickerCustomProps}
          hideOutsideDays={dateOnly.hideOutsideDays}
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </FieldOverlay>
    </>
  );
}

export default DateRangeField;
