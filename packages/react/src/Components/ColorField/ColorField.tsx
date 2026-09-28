// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type { ColorFieldProps } from "@/Components/ColorField/colorField.types";
import { useColorField } from "@/Components/ColorField/hooks/useColorField";
import { ColorPicker } from "@/Components/ColorPicker";
import { FieldOverlay } from "@/Components/FieldOverlay";
import { FormField } from "@/Components/FormField";
import { Icon } from "@/Components/Icon";

function ColorField(props: ColorFieldProps) {
  const resolveMessage = useResolveMessage();

  const {
    open,
    fill,
    format,
    overlay,
    colorOnly,
    formField,
    inputBind,
    clearBind,
    swatchBind,
    footerSlot,
    clearValue,
    modelValue,
    showFooter,
    showSwatch,
    clearIconSize,
    showClearIcon,
    swatchFillBind,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    colorPickerCustomProps,
  } = useColorField(props);

  return (
    <>
      <FormField field={formField}>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {showSwatch ? (
            <span {...swatchBind}>
              <span {...swatchFillBind} />
            </span>
          ) : null}

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
        <ColorPicker
          fill={fill}
          format={format}
          value={modelValue}
          alpha={colorOnly.alpha}
          showFooter={showFooter}
          readOnly={props.readonly}
          className={pickerClassName}
          swatches={colorOnly.swatches}
          onChange={handlePickerChange}
          onCancel={handlePickerCancel}
          color={formField.merged.color}
          disabled={formField.isDisabled}
          rounded={formField.merged.rounded}
          customProps={colorPickerCustomProps}
          slots={footerSlot ? { footer: footerSlot } : undefined}
        />
      </FieldOverlay>
    </>
  );
}

export default ColorField;
