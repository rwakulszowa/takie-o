import React from "react";

import { useEffect, useState } from "react";
import { DataTable, DbTable, DbType } from "../../lib/src";
import { Table } from "./Table";

import PlaySvg from "bundle-text:./icons/play.svg";

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
      setError(null);
    } catch (error) {
      setResults(null);
      setError(error.toString());
    }
  }

  return (
    <div className="w-full h-full flex flex-row rounded-md p-4 bg-base-200">
      <div className="flex-1 p-1 border border-neutral rounded">
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
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-row bg-base-100 text-base-content p-2"
    >
      <textarea
        name="script"
        className="flex-1 resize-none"
        placeholder="select * from ..."
      ></textarea>
      <button type="submit" className="flex-none">
        <div
          className="w-8 h-8"
          dangerouslySetInnerHTML={{ __html: PlaySvg }}
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
    <div className="w-full h-full bg-base-200 text-base-content overflow-y-auto">
      {error ? (
        <pre>{error}</pre>
      ) : results ? (
        results.map((result, i) => (
          <Table
            key={i}
            label={results.length > 1 ? `Result ${i}` : null}
            data={result}
          />
        ))
      ) : null}
    </div>
  );
}
