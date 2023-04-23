import { describe, expect, test } from "@jest/globals";
import { DbTable, DbType, DataTable } from "./db";

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
