import * as React from "react";

declare global {
  // Register custom elements.
  namespace JSX {
    interface IntrinsicElements {
      ["code-input"]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { name: string };
    }
  }
}
