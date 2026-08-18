// ** Core Imports
import { parseColor, toCssRgba } from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { Button } from "@/Components/Button";
import type { ColorPickerProps } from "@/Components/ColorPicker/colorPicker.types";
import { useColorPicker } from "@/Components/ColorPicker/hooks/useColorPicker";

function ColorPicker(props: ColorPickerProps) {
  const {
    merged,
    hueBind,
    rootBind,
    areaBind,
    alphaBind,
    showAlpha,
    footerBind,
    applyLabel,
    showFooter,
    previewBind,
    contentBind,
    handleApply,
    cancelLabel,
    swatchesBind,
    handleCancel,
    hueThumbBind,
    areaThumbBind,
    alphaFillBind,
    formattedValue,
    alphaThumbBind,
    presetSwatches,
    isSwatchSelected,
    applyButtonProps,
    previewSwatchBind,
    handleSwatchClick,
    swatchButtonClass,
    cancelButtonProps,
    swatchSelectedClass,
    previewSwatchFillBind,
  } = useColorPicker(props, {
    rounded: "md",
    format: "hex",
    color: "primary",
  });

  return (
    <div {...rootBind}>
      <div className={contentBind}>
        <div {...areaBind}>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(to right, #fff, transparent)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(to top, #000, transparent)",
            }}
          />
          <span {...areaThumbBind} />
        </div>

        <div {...hueBind}>
          <span {...hueThumbBind} />
        </div>

        {showAlpha ? (
          <div {...alphaBind}>
            <span {...alphaFillBind} />
            <span {...alphaThumbBind} />
          </div>
        ) : null}

        <div {...previewBind}>
          <span {...previewSwatchBind}>
            <span {...previewSwatchFillBind} />
          </span>
          <span className="min-w-0 truncate text-sm text-dark-700 dark:text-dark-100">
            {formattedValue}
          </span>
        </div>

        {presetSwatches.length > 0 ? (
          <div {...swatchesBind}>
            {presetSwatches.map((swatch) => {
              const parsed = parseColor(swatch);
              const selected = isSwatchSelected(swatch);

              return (
                <button
                  key={swatch}
                  type="button"
                  aria-label={swatch}
                  aria-pressed={selected}
                  onClick={() => handleSwatchClick(swatch)}
                  disabled={merged.disabled || merged.readOnly}
                  className={cn({
                    [swatchButtonClass]: true,
                    [swatchSelectedClass]: selected,
                  })}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      backgroundColor: parsed ? toCssRgba(parsed) : undefined,
                    }}
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {showFooter && (
        <div {...footerBind}>
          {props.slots?.footer ? (
            props.slots.footer({ apply: handleApply, cancel: handleCancel })
          ) : (
            <>
              <Button
                variant="flat"
                color="secondary"
                onClick={handleCancel}
                {...cancelButtonProps}
              >
                {cancelLabel}
              </Button>

              <Button
                color="primary"
                onClick={handleApply}
                {...applyButtonProps}
              >
                {applyLabel}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
