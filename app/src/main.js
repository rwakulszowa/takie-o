import initSqlJs from "sql.js";
import { Table } from "../../lib";

let database = null;

async function initSql() {
  const sql = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const db = new sql.Database();

  // Execute a single SQL string that contains multiple statements
  let sqlstr = `
    CREATE TABLE hello (a int, b char);
    INSERT INTO hello VALUES (0, 'hello');
    INSERT INTO hello VALUES (1, 'world');`;
  db.run(sqlstr);

  return db;
}

initSql().then((db) => {
  database = db;
  console.log("SQL initialized successfully");
  refreshOutput();
});

function runQuery(query) {
  const results = database.exec(query);
  return results.map(({ columns, values }) => new Table(columns, values));
}

document.getElementById("editor-input-text").oninput = refreshOutput;

function refreshOutput() {
  const query = document.getElementById("editor-input-text").value;
  const results = runQuery(query);
  const output = document.getElementById("editor-output-content");
  output.innerHTML = results.map(renderTable).join("\n");
}

function renderTable(table) {
  return `<table>
        <tr>
        ${table.columns.map((column) => `<th>${column}</th>`).join("\n")}
        </tr>
        ${table.rows
          .map(
            (row) =>
              `<tr>${row.map((value) => `<td>${value}</td>`).join("\n")}</tr>`
          )
          .join("\n")}
    </table>`;
}
