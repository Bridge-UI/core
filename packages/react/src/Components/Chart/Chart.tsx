// ** Local Imports
import type { ChartProps } from "@/Components/Chart/chart.types";
import { ChartContext } from "@/Components/Chart/ChartContext";
import { useChart } from "@/Components/Chart/hooks/useChart";
import { hasNamedSlot } from "@/Utils";
import { LoadingSpin } from "@/Utils/LoadingSpin";

function Chart(props: ChartProps) {
  const {
    table,
    slots,
    isEmpty,
    children,
    hostBind,
    plotBind,
    rootBind,
    liveBind,
    emptyBind,
    isLoading,
    tableBind,
    loadingBind,
    announcement,
    contextValue,
    emptyMessage,
  } = useChart(props, {
    size: "md",
    height: 280,
    animation: true,
  });

  return (
    <ChartContext.Provider value={contextValue}>
      <div {...rootBind}>
        <div {...plotBind}>
          <div {...hostBind} />

          {isLoading ? (
            <div {...loadingBind}>
              {hasNamedSlot(slots, "loading") ? (
                slots?.loading
              ) : (
                <LoadingSpin />
              )}
            </div>
          ) : null}

          {isEmpty ? (
            <div {...emptyBind}>
              {hasNamedSlot(slots, "empty") ? slots?.empty : emptyMessage}
            </div>
          ) : null}
        </div>

        {children}

        <table {...tableBind}>
          <thead>
            <tr>
              <th scope="col">{table.categoryLabel}</th>
              {table.series.map((item) => (
                <th scope="col" key={item.id}>
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.category}>
                <th scope="row">{row.category}</th>
                {row.values.map((value, index) => (
                  <td key={table.series[index]?.id ?? index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div {...liveBind}>{announcement}</div>
      </div>
    </ChartContext.Provider>
  );
}

export default Chart;
