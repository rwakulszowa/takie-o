import { useEffect, useState } from "react";
import { DataTable, DbTable, DbType } from "../../lib";

export function Editor({ db }) {
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [schema, setSchema] = useState([]);

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
        [1, "x"],
        [2, "y"],
        [3, "z"],
      ]
    );
    db.runQuery(table.insertValuesSql(values));
    setSchema(db.tables());
  }, []);

  function handleSubmit(input) {
    const result = db.runQuery(input);
    setResults(JSON.stringify(result));
  }

  return (
    <div>
      <EditorInput onSubmit={handleSubmit} />
      <pre>{JSON.stringify(schema)}</pre>
      <pre>{error}</pre>
      <pre>{results}</pre>
    </div>
  );
}

function EditorInput({ onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    onSubmit(formValues.script);
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="script" placeholder="select * from ..."></textarea>
      <button type="submit">Execute</button>
    </form>
  );
}
