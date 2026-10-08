// ** Local Imports
import type { ChartTooltipProps } from "@/Components/ChartTooltip/chartTooltip.types";
import { useChartTooltip } from "@/Components/ChartTooltip/hooks/useChartTooltip";

function ChartTooltip(props: ChartTooltipProps) {
  const {
    slots,
    isOpen,
    context,
    itemBind,
    rootBind,
    labelBind,
    titleBind,
    valueBind,
    percentBind,
    formatValue,
    formatPercent,
    getSwatchBind,
  } = useChartTooltip(props);

  if (!isOpen || context === null) {
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
                {percent === null ? null : (
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
