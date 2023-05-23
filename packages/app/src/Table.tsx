import React from "react";

import { DataTable } from "../../lib/src";

export type Props = {
  label: string;
  data: DataTable;
};

export function Table({ label, data }: Props) {
  return (
    <div className="overflow-x-auto p-4">
      {label && <p className="text-xs text-base-content/75">{label}</p>}
      <table className="table w-full">
        <thead>
          <tr>
            {data.columns.map((col, i) => (
              // Relative layout disables weird DaisyUI sticky th style.
              <th key={i} style={{ position: "relative" }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i}>
              {row.map((d, j) => (
                <td key={i + j}>{d}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
