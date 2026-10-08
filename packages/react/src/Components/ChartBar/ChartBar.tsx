// ** Local Imports
import type { ChartBarProps } from "@/Components/ChartBar/chartBar.types";
import { useChartBar } from "@/Components/ChartBar/hooks/useChartBar";
import { ChartFrame } from "@/Utils/Charts";

function ChartBar(props: ChartBarProps) {
  const { frame, context } = useChartBar(props, {
    radius: 4,
    size: "md",
    height: 280,
    labels: false,
    animation: true,
    orientation: "vertical",
  });

  return (
    <ChartFrame frame={frame} context={context}>
      {props.children}
    </ChartFrame>
  );
}

export default ChartBar;
