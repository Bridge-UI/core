// ** Local Imports
import type { ChartLineProps } from "@/Components/ChartLine/chartLine.types";
import { useChartLine } from "@/Components/ChartLine/hooks/useChartLine";
import { ChartFrame } from "@/Utils/Chart";

function ChartLine(props: ChartLineProps) {
  const { frame, context } = useChartLine(props, {
    size: "md",
    area: false,
    step: false,
    labels: false,
    animation: true,
    curve: "linear",
    showPoints: false,
    height: props.sparkline ? 48 : 280,
  });

  return (
    <ChartFrame frame={frame} context={context}>
      {props.children}
    </ChartFrame>
  );
}

export default ChartLine;
