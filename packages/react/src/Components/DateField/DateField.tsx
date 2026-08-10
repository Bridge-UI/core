// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type { DateFieldProps } from "@/Components/DateField/dateField.types";
import { useDateField } from "@/Components/DateField/hooks/useDateField";
import { DatePicker } from "@/Components/DatePicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";

function DateField(props: DateFieldProps) {
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
    clearIconSize,
    showClearIcon,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    datePickerCustomProps,
  } = useDateField(props);

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
        <DatePicker
          value={modelValue}
          range={dateOnly.range}
          showFooter={showFooter}
          readOnly={props.readonly}
          maxDate={dateOnly.maxDate}
          minDate={dateOnly.minDate}
          className={pickerClassName}
          multiple={dateOnly.multiple}
          timeZone={dateOnly.timeZone}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
          hideYears={dateOnly.hideYears}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          hideMonths={dateOnly.hideMonths}
          defaultView={dateOnly.defaultView}
          startOfWeek={dateOnly.startOfWeek}
          rounded={formField.merged.rounded}
          customProps={datePickerCustomProps}
          disableDates={dateOnly.disableDates}
          hideWeekdays={dateOnly.hideWeekdays}
          disableYears={dateOnly.disableYears}
          disableMonths={dateOnly.disableMonths}
          hideOutsideDays={dateOnly.hideOutsideDays}
          slots={daySlot ? { day: daySlot } : undefined}
        />
      </FieldOverlay>
    </>
  );
}

export default DateField;
