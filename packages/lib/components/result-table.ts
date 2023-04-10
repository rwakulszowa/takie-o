import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

export class ResultTable extends LitElement {
  @property() rows: Array<{ [key: string]: string | number }> = [];

  /**
   * Disable shadow DOM.
   * Allows the parent to style the component.
   */
  createRenderRoot() {
    return this;
  }

  get headers(): Array<string> {
    return this.rows.length ? Object.keys(this.rows[0]) : [];
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
                    this.rows.map(Object.values),
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
