import { LitElement, html } from "lit";

export class AppWindow extends LitElement {
  render() {
    return html`
      <section class="flex flex-row">
        <div class="flex-auto"><slot name="main"></slot></div>
        <div class="flex-none"><slot name="controls"></slot></div>
      </section>
    `;
  }
}
customElements.define("app-window", AppWindow);
