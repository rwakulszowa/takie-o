import initSqlJs from "sql.js";
import { debounce } from "lodash";
import { Table } from "../../lib";
import data from "./iris.json";

let database = null;

async function initSql() {
  const sql = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const db = new sql.Database();

  // Create the iris database
  const createDbSql = `
    CREATE TABLE iris (id int, sepal_length float, sepal_width float, petal_length float, petal_width float, species char);
  `;
  db.run(createDbSql);

  const insertIrisSql = data
    .map(
      (d, i) =>
        `INSERT INTO iris VALUES (${i}, ${d.sepal_length}, ${d.sepal_width}, ${d.petal_length}, ${d.petal_width}, "${d.species}");`
    )
    .join("\n");
  db.run(insertIrisSql);

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

document.getElementById("editor-input-text").oninput = debounce(
  refreshOutput,
  250
);

function refreshOutput() {
  const query = document.getElementById("editor-input-text").value;
  const outputContent = document.getElementById("editor-output-content");
  const outputPopup = document.getElementById("editor-output-popup");
  try {
    const results = runQuery(query);
    delete outputPopup.dataset.up;
    outputContent.innerHTML = results.map(renderTable).join("\n");
  } catch (e) {
    outputPopup.dataset.up = true;
    outputPopup.innerHTML = e.message;
  }
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
