// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Local Imports
import type { ChartTooltipProps } from "@/Components/ChartTooltip/chartTooltip.types";
import { useChartTooltip } from "@/Components/ChartTooltip/hooks/useChartTooltip";

function ChartTooltip(props: ChartTooltipProps) {
  const {
    slots,
    isOpen,
    context,
    itemBind,
    noteBind,
    rootBind,
    labelBind,
    titleBind,
    valueBind,
    percentBind,
    formatValue,
    formatPercent,
    getSwatchBind,
  } = useChartTooltip(props);

  if (!isOpen || isNil(context)) {
    return null;
  }

  return (
    <div {...rootBind}>
      {slots?.content ? (
        slots.content(context)
      ) : (
        <>
          {context.title.length > 0 ? (
            <div {...titleBind}>
              {context.color ? (
                <span {...getSwatchBind(context.color)} />
              ) : null}
              {context.title}
            </div>
          ) : null}

          {context.items.map((item) => {
            const percent = formatPercent(item);

            return (
              <div key={item.id} {...itemBind}>
                {item.color ? <span {...getSwatchBind(item.color)} /> : null}
                <span {...labelBind}>{item.name}</span>
                <span {...valueBind}>{formatValue(item)}</span>
                {item.note ? <span {...noteBind}>{item.note}</span> : null}
                {isNil(percent) ? null : (
                  <span {...percentBind}>{percent}</span>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default ChartTooltip;
