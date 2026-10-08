// ** Local Imports
import type { ChartScatterProps } from "@/Components/ChartScatter/chartScatter.types";
import { useChartScatter } from "@/Components/ChartScatter/hooks/useChartScatter";
import { ChartFrame } from "@/Utils/Charts";

function ChartScatter(props: ChartScatterProps) {
  const { frame, context } = useChartScatter(props, {
    size: "md",
    height: 280,
    symbolSize: 8,
    animation: true,
  });

  return (
    <ChartFrame frame={frame} context={context}>
      {props.children}
    </ChartFrame>
  );
}

export default ChartScatter;
