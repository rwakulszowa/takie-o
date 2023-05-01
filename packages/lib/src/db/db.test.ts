import { describe, expect, test } from "@jest/globals";
import { DbTable, DbType, DataTable, Database } from "./db";

describe("Database", () => {
  test("tables", () => {
    const client = {
      exec: () => [
        {
          columns: ["name", "sql"],
          values: [
            ["test", "CREATE TABLE test (ID integer primary key, Name char)"],
          ],
        },
      ],
    };
    const db = new Database(client);
    expect(db.tables()).toEqual([
      new DbTable("test", [
        { name: "ID", type: DbType.Int },
        { name: "Name", type: DbType.String },
      ]),
    ]);
  });
});

describe("DbTable", () => {
  const dbTable = new DbTable("tableA", [
    { name: "a", type: DbType.String },
    { name: "b", type: DbType.Int },
  ]);

  test("createTableSql", () => {
    expect(dbTable.createTableSql()).toBe(
      "CREATE TABLE tableA (a char, b int);"
    );
  });

  test("insertValuesSql", () => {
    const dataTable = new DataTable(
      ["a", "b"],
      [
        ["x", "1"],
        ["y", "2"],
      ]
    );
    expect(dbTable.insertValuesSql(dataTable)).toBe(
      `INSERT INTO tableA VALUES ("x", 1), ("y", 2);`
    );
  });
});
