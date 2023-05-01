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

/**
 * Instance of a database.
 */
export class Database {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  tables(): Array<DbTable> {
    return this.runQuery(`
SELECT 
    name, sql
FROM 
    sqlite_schema
WHERE 
    type ='table' AND 
    name NOT LIKE 'sqlite_%';`);
  }

  runQuery(query: string): Array<DbTable> {
    const results = this.client.exec(query);
    return results.map(({ columns, values }) => new DataTable(columns, values));
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
      .map(({ name, type }) => `${name} ${dbTypeToSqlite(type)}`)
      .join(", ");
    return `CREATE TABLE ${this.name} (${columnsFragment});`;
  }

  /**
   * INSERT INTO ... query.
   * Data must match table schema.
   */
  insertValuesSql(values: DataTable): string {
    const cols = this.columns.map((c) => c.name);

    const processValue = (value, index) => {
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
