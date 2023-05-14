import React from "react";

import { useEffect, useState } from "react";
import { format } from "sql-formatter";

import { DataTable, DbTable, DbType } from "../../lib/src";
import { Table } from "./Table";

import BrushSvg from "bundle-text:./icons/brush.svg";
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
