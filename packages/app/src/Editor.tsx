import React from "react";

import { useEffect, useState } from "react";
import { DataTable, DbTable, DbType } from "../../lib/src";
import { Schema } from "./Schema";
import { Table } from "./Table";

export function Editor({ db }) {
  const [error, setError] = useState(null);
  const [results, setResults] = useState<DataTable>(null);
  const [schema, setSchema] = useState<DbTable[]>();

  useEffect(() => {
    // Generate some data right away.
    const table = new DbTable("A", [
      { name: "a", type: DbType.Int },
      { name: "b", type: DbType.String },
    ]);
    db.runQuery(table.createTableSql());
    const values = new DataTable(
      table.columns.map((c) => c.name),
      [
        ["1", "x"],
        ["2", "y"],
        ["3", "z"],
      ]
    );
    db.runQuery(table.insertValuesSql(values));
    setSchema(db.tables());
  }, []);

  function handleSubmit(input: string) {
    const result = db.runQuery(input)[0];
    setResults(result);
  }

  return (
    <div className="w-full h-full flex flex-row">
      <div className="flex-1">
        <EditorInput onSubmit={handleSubmit} />
      </div>
      {/* <Schema tables={schema || []} /> */}
      {/* <pre>{error}</pre> */}
      <div className="flex-1">
        {results && <Table label="result" data={results} />}
      </div>
    </div>
  );
}

function EditorInput({ onSubmit }) {
  function handleSubmit(e: any) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    onSubmit(formValues.script);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-row">
      <textarea
        name="script"
        className="flex-1"
        placeholder="select * from ..."
      ></textarea>
      <button type="submit" className="flex-none">
        Execute
      </button>
    </form>
  );
}
