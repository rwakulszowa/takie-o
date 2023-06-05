import { Database } from "../../lib";
import React, { useState, useEffect } from "react";
import initSqlJs from "sql.js";
import { Editor } from "./Editor";

import sqlWasm from "url:sql.js/dist/sql-wasm.wasm";

export function App() {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);

  async function initSql() {
    try {
      const SQL = await initSqlJs({ locateFile: () => sqlWasm });
      setDb(new Database(new SQL.Database()));
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    initSql();
  }, []);

  return (
    <div className="w-full h-full overflow-none bg-neutral text-neutral-content">
      {error ? (
        <pre>{error.toString()}</pre>
      ) : db ? (
        <Editor db={db} />
      ) : (
        <pre>Loading...</pre>
      )}
    </div>
  );
}
