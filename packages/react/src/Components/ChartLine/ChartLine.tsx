// ** Local Imports
import type { ChartLineProps } from "@/Components/ChartLine/chartLine.types";
import { useChartLine } from "@/Components/ChartLine/hooks/useChartLine";
import { ChartFrame } from "@/Utils/Charts";

function ChartLine(props: ChartLineProps) {
  const { frame, context } = useChartLine(props, {
    size: "md",
    area: false,
    step: false,
    height: 280,
    labels: false,
    animation: true,
    curve: "linear",
    showPoints: false,
  });

  return (
    <ChartFrame frame={frame} context={context}>
      {props.children}
    </ChartFrame>
  );
}

export default ChartLine;
