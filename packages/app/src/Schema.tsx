import React from "react";

import { DataTable, DbTable, DbType } from "../../lib/src";
import { Table } from "./Table";

export type Props = {
  tables: DbTable[];
};

export function Schema({ tables }: Props) {
  return (
    tables && (
      <div>
        {tables.map((table) => (
          <Table
            key={table.name}
            label={table.name}
            data={columnsToDataTable(table.columns)}
          />
        ))}
      </div>
    )
  );
}

function columnsToDataTable(
  columns: { name: string; type: DbType }[]
): DataTable {
  return new DataTable(
    ["name", "type"],
    columns.map(({ name, type }) => [name, type])
  );
}
