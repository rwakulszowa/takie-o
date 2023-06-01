import { createRoot } from "react-dom/client";
import { App } from "./App";

function installServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(new URL("service-worker.js", import.meta.url), {
        type: "module",
      })
      .then((serviceWorker) => {
        console.log("Service Worker registered: ", serviceWorker);
      })
      .catch((error) => {
        console.error("Error registering the Service Worker: ", error);
      });
  }
}

installServiceWorker();

// Code highlighting setup.
codeInput.registerTemplate(
  "syntax-highlighted",
  codeInput.templates.custom(
    function (resultElement) {
      const parens = new Set("()");
      resultElement.innerHTML = resultElement.innerText
        .split("")
        .map((char) =>
          parens.has(char) ? `<span class="editor-paren">${char}</span>` : char
        )
        .join("");
    },
    true,
    true,
    false,
    []
  )
);

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
