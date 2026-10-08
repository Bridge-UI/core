// ** Local Imports
import type { ChartFunnelProps } from "@/Components/ChartFunnel/chartFunnel.types";
import { useChartFunnel } from "@/Components/ChartFunnel/hooks/useChartFunnel";
import { ChartFrame } from "@/Utils/Charts";

function ChartFunnel(props: ChartFunnelProps) {
  const { frame, context } = useChartFunnel(props, {
    size: "md",
    height: 280,
    align: "center",
    animation: true,
    labels: "inside",
    sort: "descending",
  });

  return (
    <ChartFrame frame={frame} context={context}>
      {props.children}
    </ChartFrame>
  );
}

export default ChartFunnel;
