import initSqlJs from "sql.js";
import { debounce } from "lodash";
import { DataTable } from "../lib";
import worldBankData from "url:../../data/world-development-indicators.sqlite";

function installServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(new URL("service-worker.js", import.meta.url), {
        type: "module",
      })
      .then((serviceWorker) => {
        console.log("Service Worker registered: ", serviceWorker);
      })
      .catch((error) => {
        console.error("Error registering the Service Worker: ", error);
      });
  }
}

installServiceWorker();

let database = null;

async function initSql() {
  const sqlPromise = initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const dataPromise = fetch(worldBankData).then((res) => res.arrayBuffer());
  const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
  const db = new SQL.Database(new Uint8Array(buf));

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
