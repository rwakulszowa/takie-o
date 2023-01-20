import initSqlJs from "sql.js";
import { debounce } from "lodash";
import { DataTable, DbTable, DbType } from "../../lib";
import iris from "./iris.json";

let database = null;

const irisDb = new DbTable("iris", [
  { name: "id", type: DbType.Int },
  { name: "sepal_length", type: DbType.Float },
  { name: "sepal_width", type: DbType.Float },
  { name: "petal_length", type: DbType.Float },
  { name: "petal_width", type: DbType.Float },
  { name: "species", type: DbType.String },
]);

const irisDbValues = new DataTable(
  ["id", ...Object.keys(iris[0])],
  iris.map((row, i) => [i, ...Object.values(row)])
);

const irisLikesDb = new DbTable("likes", [
  { name: "irisId", type: DbType.Int },
  { name: "likeValue", type: DbType.Int },
]);

const irisLikesValues = new DataTable(
  ["irisId", "likeValue"],
  [
    [1, 4],
    [2, 3],
    [2, 5],
    [2, 3],
    [3, 6],
    [5, 7],
    [55, 13],
    [113, 2],
    [113, 5],
    [117, 14],
  ]
);

async function initSql() {
  const sql = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const db = new sql.Database();

  const createDbSql = [irisDb, irisLikesDb]
    .map((dbTable) => dbTable.createTableSql())
    .join("\n");

  const insertValuesSql = [
    { db: irisDb, values: irisDbValues },
    { db: irisLikesDb, values: irisLikesValues },
  ]
    .map(({ db, values }) => db.insertValuesSql(values))
    .join("\n");

  db.run(createDbSql);
  db.run(insertValuesSql);

  return db;
}

initSql().then((db) => {
  database = db;
  console.log("SQL initialized successfully");
  refreshOutput();
});

function runQuery(query) {
  const results = database.exec(query);
  return results.map(({ columns, values }) => new DataTable(columns, values));
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
