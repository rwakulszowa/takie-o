import React from "react";

import { useEffect, useState } from "react";
import { format } from "sql-formatter";

import { DataTable, DbTable, DbType } from "../../lib/src";
import { Table } from "./Table";

import BrushSvg from "bundle-text:./icons/brush.svg";
import PlaySvg from "bundle-text:./icons/play.svg";
import HealthWorkers from "../data/health_workers.json";

export function Editor({ db }) {
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<DataTable[]>([]);
  const [schema, setSchema] = useState<DbTable[]>();

  useEffect(() => {
    // Insert health workers data.

    // Main values table.
    const valuesTable = new DbTable("health_workers", [
      { name: "time", type: DbType.Int },
      { name: "geo", type: DbType.String },
      { name: "unit", type: DbType.String },
      { name: "isco08", type: DbType.String },
      { name: "freq", type: DbType.String },
      { name: "value", type: DbType.Float },
    ]);

    db.runQuery(valuesTable.createTableSql());
    const values = new DataTable(
      valuesTable.columns.map((c) => c.name),
      HealthWorkers.values.map(([dims, value]) => [
        ...Object.values(dims),
        value,
      ])
    );
    db.runQuery(valuesTable.insertValuesSql(values));

    // Metadata tables.
    // Contain descriptions of IDs used in the main table.
    for (const [key, data] of Object.entries(HealthWorkers)) {
      // Already handled above.
      if (key !== "values") {
        if (data.length > 0) {
          const keys = Object.keys(data[0]);
          const values = data.map(Object.values);
          const table = new DbTable(
            key,
            keys.map((k) => ({ name: k, type: DbType.String }))
          );
          const dataTable = new DataTable(keys, values);
          db.runQuery(table.createTableSql());
          db.runQuery(table.insertValuesSql(dataTable));
        }
      }
    }

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
      <div className="flex-1 overflow-x-auto">
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

  function fix() {
    const userInput: any = document.querySelector(
      "#editor-input-form textarea"
    );
    userInput.value = format(userInput.value, {
      keywordCase: "lower",
      tabWidth: 2,
    });
    userInput.dispatchEvent(new Event("input"));
  }

  return (
    <form
      id="editor-input-form"
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-row bg-base-100 text-base-content p-2"
    >
      <div className="flex-1 resize-none">
        <code-input
          name="script"
          lang="sql"
          placeholder="select * from ..."
        ></code-input>
      </div>
      <div className="flex-none flex flex-col gap-4">
        <button type="submit">
          <div
            className="w-6 h-6"
            dangerouslySetInnerHTML={{ __html: PlaySvg }}
          />
        </button>
        <button type="button" onClick={fix}>
          <div
            className="w-6 h-6"
            dangerouslySetInnerHTML={{ __html: BrushSvg }}
          />
        </button>
      </div>
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
