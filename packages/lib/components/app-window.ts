import { LitElement, html, css } from "lit";

export class AppWindow extends LitElement {
  static styles = css`
    section {
      display: flex;
      flex-direction: row;
    }

    .main {
      flex: 1;
    }

    .controls {
      flex: none;
      width: 2em;
      overflow: hidden;
    }
  `;

  render() {
    return html`
      <section>
        <div class="main"><slot name="main"></slot></div>
        <div class="controls"><slot name="controls"></slot></div>
      </section>
    `;
  }
}
customElements.define("app-window", AppWindow);
