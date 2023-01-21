import initSqlJs from "sql.js";
import { debounce } from "lodash";
import { DataTable, DbTable, DbType } from "../lib";
import iris from "../../data/iris.json";
// Temporary - loading CSV doesn't work :/
import country from "../../data/Country.json";

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

const countryDb = new DbTable("country", [
  { name: "CountryCode", type: DbType.String },
  { name: "ShortName", type: DbType.String },
  { name: "TableName", type: DbType.String },
  { name: "LongName", type: DbType.String },
  { name: "Alpha2Code", type: DbType.String },
  { name: "CurrencyUnit", type: DbType.String },
  { name: "SpecialNotes", type: DbType.String },
  { name: "Region", type: DbType.String },
  { name: "IncomeGroup", type: DbType.String },
  { name: "Wb2Code", type: DbType.String },
  { name: "NationalAccountsBaseYear", type: DbType.String },
  { name: "NationalAccountsReferenceYear", type: DbType.String },
  { name: "SnaPriceValuation", type: DbType.String },
  { name: "LendingCategory", type: DbType.String },
  { name: "OtherGroups", type: DbType.String },
  { name: "SystemOfNationalAccounts", type: DbType.String },
  { name: "AlternativeConversionFactor", type: DbType.String },
  { name: "PppSurveyYear", type: DbType.String },
  { name: "BalanceOfPaymentsManualInUse", type: DbType.String },
  { name: "ExternalDebtReportingStatus", type: DbType.String },
  { name: "SystemOfTrade", type: DbType.String },
  { name: "GovernmentAccountingConcept", type: DbType.String },
  { name: "ImfDataDisseminationStandard", type: DbType.String },
  { name: "LatestPopulationCensus", type: DbType.String },
  { name: "LatestHouseholdSurvey", type: DbType.String },
  { name: "SourceOfMostRecentIncomeAndExpenditureData", type: DbType.String },
  { name: "VitalRegistrationComplete", type: DbType.String },
  { name: "LatestAgriculturalCensus", type: DbType.String },
  { name: "LatestIndustrialData", type: DbType.String },
  { name: "LatestTradeData", type: DbType.String },
  { name: "LatestWaterWithdrawalData", type: DbType.String },
]);

const countryValues = DataTable.fromJson(country);

async function initSql() {
  const sql = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const db = new sql.Database();

  const createDbSql = [irisDb, irisLikesDb, countryDb].map((dbTable) =>
    dbTable.createTableSql()
  );

  const insertValuesSql = [
    { db: irisDb, values: irisDbValues },
    { db: irisLikesDb, values: irisLikesValues },
    { db: countryDb, values: countryValues },
  ].map(({ db, values }) => db.insertValuesSql(values));

  createDbSql.forEach((sql) => db.run(sql));
  insertValuesSql.forEach((sql) => db.run(sql));

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
