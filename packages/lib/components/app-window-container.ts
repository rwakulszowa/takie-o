import { LitElement, html, css } from "lit";

/**
 * Container for AppWindow elements.
 *
 * Doesn't do much now, but it will eventually handle:
 * - dynamically hiding / showing N windows based on size
 * - showing controls if necessary
 */
export class AppWindowContainer extends LitElement {
  static styles = css`
    .container {
      display: flex;
      flex-direction: row;
      gap: 1rem;

      height: 100%;
      width: 100%;
    }

    ::slotted(*) {
      flex: 1;
    }
  `;

  render() {
    return html`
      <div class="container">
        <slot name="left"></slot>
        <slot name="right"></slot>
      </div>
    `;
  }
}
customElements.define("app-window-container", AppWindowContainer);
