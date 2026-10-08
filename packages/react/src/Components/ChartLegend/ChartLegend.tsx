// ** Local Imports
import type { ChartLegendProps } from "@/Components/ChartLegend/chartLegend.types";
import { useChartLegend } from "@/Components/ChartLegend/hooks/useChartLegend";
import type { ChartLegendItem } from "@/Utils/Chart";

function ChartLegend(props: ChartLegendProps) {
  const {
    items,
    rootBind,
    getValue,
    labelBind,
    valueBind,
    getPercent,
    interactive,
    percentBind,
    getItemBind,
    getSwatchBind,
  } = useChartLegend(props, {
    align: "center",
    showValue: false,
    interactive: true,
    showPercent: false,
    position: "bottom",
  });

  const renderContent = (item: ChartLegendItem) => {
    const value = getValue(item);
    const percent = getPercent(item);

    return (
      <>
        <span {...getSwatchBind(item)} />
        <span {...labelBind}>{item.name}</span>
        {value === null ? null : <span {...valueBind}>{value}</span>}
        {percent === null ? null : <span {...percentBind}>{percent}</span>}
      </>
    );
  };

  return (
    <ul {...rootBind}>
      {items.map((item) => (
        <li key={item.id}>
          {interactive ? (
            <button {...getItemBind(item)}>{renderContent(item)}</button>
          ) : (
            <span {...getItemBind(item)}>{renderContent(item)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ChartLegend;
