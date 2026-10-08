// ** External Imports
import { isNil } from "es-toolkit/compat";
import type { ReactNode } from "react";

// ** Local Imports
import { hasNamedSlot } from "@/Utils";
import {
  ChartContext,
  type ChartContextValue,
} from "@/Utils/Chart/ChartContext";
import type { ChartFrameState } from "@/Utils/Chart/useChartRoot";
import { LoadingSpin } from "@/Utils/LoadingSpin";

/**
 * Figure, plot, overlays, data table, and live region shared by every
 * chart root.
 */
export function ChartFrame({
  frame,
  center,
  context,
  children,
}: {
  center?: ReactNode;
  children?: ReactNode;
  context: ChartContextValue;
  frame: ChartFrameState;
}) {
  const { table, slots } = frame;

  return (
    <ChartContext.Provider value={context}>
      <div {...frame.rootBind}>
        <div {...frame.plotBind}>
          <div {...frame.hostBind} />

          {!isNil(center) && !frame.isEmpty ? (
            <div {...frame.centerBind}>{center}</div>
          ) : null}

          {frame.isLoading ? (
            <div {...frame.loadingBind}>
              {hasNamedSlot(slots, "loading") ? (
                slots?.loading
              ) : (
                <LoadingSpin />
              )}
            </div>
          ) : null}

          {frame.isEmpty ? (
            <div {...frame.emptyBind}>
              {hasNamedSlot(slots, "empty") ? slots?.empty : frame.emptyMessage}
            </div>
          ) : null}
        </div>

        {children}

        <table {...frame.tableBind}>
          <thead>
            <tr>
              {table.headers.map((header, index) => (
                <th scope="col" key={`${index}-${header}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.key}>
                {row.cells.map((cell, index) =>
                  index === 0 ? (
                    <th scope="row" key={index}>
                      {cell}
                    </th>
                  ) : (
                    <td key={index}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div {...frame.liveBind}>{frame.announcement}</div>
      </div>
    </ChartContext.Provider>
  );
}
