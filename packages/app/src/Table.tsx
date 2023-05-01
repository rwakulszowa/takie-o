import React from "react";

import { DataTable } from "../../lib/src";

export type Props = {
  label: string;
  data: DataTable;
};

export function Table({ label, data }: Props) {
  return (
    <div>
      <p>{label}</p>
      <table>
        <thead>
          <tr>
            {data.columns.map((col, i) => (
              <th key={i}>{col}</th>
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
