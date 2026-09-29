// ** Local Imports
import type { ChartLegendProps } from "@/Components/ChartLegend/chartLegend.types";
import { useChartLegend } from "@/Components/ChartLegend/hooks/useChartLegend";

function ChartLegend(props: ChartLegendProps) {
  const {
    items,
    rootBind,
    labelBind,
    interactive,
    getItemBind,
    getSwatchBind,
  } = useChartLegend(props, {
    align: "center",
    interactive: true,
    position: "bottom",
  });

  return (
    <ul {...rootBind}>
      {items.map((item) => (
        <li key={item.id}>
          {interactive ? (
            <button {...getItemBind(item)}>
              <span {...getSwatchBind(item)} />
              <span {...labelBind}>{item.name}</span>
            </button>
          ) : (
            <span {...getItemBind(item)}>
              <span {...getSwatchBind(item)} />
              <span {...labelBind}>{item.name}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ChartLegend;
