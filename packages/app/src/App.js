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

  if (error) return <pre>{error.toString()}</pre>;
  else if (!db) return <pre>Loading...</pre>;
  else return <Editor db={db} />;
}
