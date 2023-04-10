export { AppWindow } from "lib/components/app-window";
export { AppWindowContainer } from "lib/components/app-window-container";
export { ResultTable } from "lib/components/result-table";

function evaluateInput() {
  const editorInput = document.getElementById("editor-input");
  const resultTable = document.getElementById("result-table");
  resultTable.rows = JSON.parse(editorInput.value);
}

window.evaluateInput = evaluateInput;
