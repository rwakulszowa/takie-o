import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

export class AppLayout extends LitElement {
  @property()
  title = "Takie O.";

  render() {
    return html`
      <div class="navbar bg-base-100">${this.title}</div>
      <main><slot></slot></main>
    `;
  }
}
customElements.define("app-layout", AppLayout);
