/**
 * Wrapper around the data type returned from sql.js.
 */
export class Table {
  columns: Array<string>;
  rows: Array<Array<string>>;
  
  constructor(columns: Array<string>, rows: Array<Array<string>>) {
    this.columns = columns;
    this.rows = rows;
  }
}
