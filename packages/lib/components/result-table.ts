import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

export class ResultTable extends LitElement {
  @property() data: Array<{ [key: string]: string | number }> = [
    { a: 1, b: 42 },
    { a: 2, b: 33 },
  ];

  /**
   * Disable shadow DOM.
   * Allows the parent to style the component.
   */
  createRenderRoot() {
    return this;
  }

  get headers(): Array<string> {
    return this.data.length ? Object.keys(this.data[0]) : [];
  }

  get rows(): Array<Array<string | number>> {
    return this.data.map(Object.values);
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
            ${repeat(this.headers, (item: string) => html`<th>${item}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${repeat(
            this.rows,
            (row: Array<string | number>) =>
              html`
                <tr>
                  ${repeat(
                    row,
                    (datum: string | number) => html`<td>${datum}</td>`
                  )}
                </tr>
              `
          )}
        </tbody>
      </table>
    `;
  }
}
customElements.define("result-table", ResultTable);
