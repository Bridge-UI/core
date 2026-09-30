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
    formatValue,
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
          <div {...titleBind}>{context.category}</div>

          {context.items.map((item) => (
            <div key={item.id} {...itemBind}>
              <span {...getSwatchBind(item)} />
              <span {...labelBind}>{item.name}</span>
              <span {...valueBind}>{formatValue(item)}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default ChartTooltip;
