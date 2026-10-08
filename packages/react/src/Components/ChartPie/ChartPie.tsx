// ** Local Imports
import type { ChartPieProps } from "@/Components/ChartPie/chartPie.types";
import { useChartPie } from "@/Components/ChartPie/hooks/useChartPie";
import { ChartFrame } from "@/Utils/Charts";

function ChartPie(props: ChartPieProps) {
  const { frame, center, variant, context } = useChartPie(props, {
    size: "md",
    minAngle: 2,
    height: 280,
    labels: false,
    thickness: 0.3,
    variant: "pie",
    animation: true,
  });

  return (
    <ChartFrame
      frame={frame}
      context={context}
      center={variant === "donut" ? center : undefined}
    >
      {props.children}
    </ChartFrame>
  );
}

export default ChartPie;
