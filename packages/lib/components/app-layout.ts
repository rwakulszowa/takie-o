import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

export class AppLayout extends LitElement {
  @property()
  title = "Takie O.";

  render() {
    return html`
      <p>${this.title}</p>
      <main><slot></slot></main>
    `;
  }
}
customElements.define("app-layout", AppLayout);
