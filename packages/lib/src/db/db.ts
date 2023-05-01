import _ from "lodash";

/**
 * Database value types.
 * Not a 1:1 mapping to SQLite names.
 */
export enum DbType {
  Int = "Int",
  Float = "Float",
  String = "String",
}

function dbTypeToSqlite(dbType: DbType): string {
  switch (dbType) {
    case DbType.Int:
      return "int";
    case DbType.Float:
      return "float";
    case DbType.String:
      return "char";
  }
}

function sqliteTypeToDbType(sqliteType: string): DbType {
  switch (sqliteType) {
    case "int":
      return DbType.Int;
    case "integer":
      return DbType.Int;
    case "float":
      return DbType.Float;
    case "char":
      return DbType.String;
  }
  throw new Error(`Unknown type: ${sqliteType}`);
}

/**
 * Instance of a database.
 */
export class Database {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  runQuery(query: string): Array<DataTable> {
    const results: any[] = this.client.exec(query);
    return results.map((r) => new DataTable(r.columns, r.values));
  }

  tables(): Array<DbTable> {
    const result = this.runQuery(`
SELECT 
    name, sql
FROM 
    sqlite_schema
WHERE 
    type ='table' AND 
    name NOT LIKE 'sqlite_%';`)[0];

    return result.rows.map(
      ([name, sql]) => new DbTable(name, this.parseCreateTableSql(sql))
    );
  }

  /**
   * Parse table definition from a "CREATE TABLE A (ID integer, ...)" sql string.
   */
  private parseCreateTableSql(sql: string): { name: string; type: DbType }[] {
    const columnDefs = /\((?<x>.*)\)/.exec(sql);
    if (!columnDefs) {
      return [];
    }
    const nameTypePairs = columnDefs
      .groups!.x.split(", ")
      .map((colExpr: string) => {
        const [name, type] = colExpr.split(" ");
        return { name, type: sqliteTypeToDbType(type) };
      });
    return nameTypePairs;
  }
}

/**
 * An SQL-ish table definition.
 */
export class DbTable {
  name: string;
  columns: Array<{ name: string; type: DbType }>;

  constructor(name: string, columns: Array<{ name: string; type: DbType }>) {
    this.name = name;
    this.columns = columns;
  }

  createTableSql(): string {
    const columnsFragment = this.columns
      .map((c) => `${c.name} ${dbTypeToSqlite(c.type)}`)
      .join(", ");
    return `CREATE TABLE ${this.name} (${columnsFragment});`;
  }

  /**
   * INSERT INTO ... query.
   * Data must match table schema.
   */
  insertValuesSql(values: DataTable): string {
    const cols = this.columns.map((c) => c.name);

    const processValue = (value: any, index: number) => {
      const dbType = this.columns[index].type;
      if (dbType === DbType.String) {
        return `"${value}"`;
      }
      return value;
    };

    if (!_.isEqual(values.columns, cols)) {
      throw new Error(
        `Values don't match schema: columns=${values.columns} schema=${cols})`
      );
    }

    return `INSERT INTO ${this.name} VALUES ${values.rows
      .map((row) => `(${row.map(processValue).join(", ")})`)
      .join(", ")};`;
  }
}

/**
 * Wrapper around the data type returned from sql.js.
 */
export class DataTable {
  columns: Array<string>;
  rows: Array<Array<string>>;

  constructor(columns: Array<string>, rows: Array<Array<string>>) {
    this.columns = columns;
    this.rows = rows;
  }

  static fromObjects(input: Array<object>): DataTable {
    const columns = Object.keys(input[0]);
    const rows = input.map(Object.values);
    return new DataTable(columns, rows);
  }
}
