import React from "react";

import { useEffect, useState } from "react";
import { DataTable, DbTable, DbType } from "../../lib/src";
import { Table } from "./Table";
const PlayIcon = new URL("icons/play.svg", import.meta.url);

export function Editor({ db }) {
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<DataTable[]>([]);
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
    try {
      setResults(db.runQuery(input));
    } catch (error) {
      setError(error.toString());
    }
  }

  return (
    <div className="w-full h-full flex flex-row">
      <div className="flex-1">
        <EditorInput onSubmit={handleSubmit} />
      </div>
      {/* Schema is not displayed yet. Pending layout changes. */}
      {/* <Schema tables={schema || []} /> */}
      <div className="flex-1">
        <EditorOutput error={error} results={results} />
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
        <img
          className="w-8"
          title="Evaluate the input."
          src={PlayIcon as any}
          alt="Evaluate"
        />
      </button>
    </form>
  );
}

function EditorOutput({
  results,
  error,
}: {
  results: DataTable[];
  error: string;
}) {
  return (
    <div className="w-full h-full">
      {error ? (
        <pre>{error}</pre>
      ) : results ? (
        results.map((result, i) => (
          <Table key={i} label={i.toString()} data={result} />
        ))
      ) : null}
    </div>
  );
}
