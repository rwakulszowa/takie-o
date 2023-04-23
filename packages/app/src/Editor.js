import { useState } from "react";

export function Editor({ db }) {
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  function handleSubmit(input) {
    console.log(input);
    setResults(input);
  }

  return (
    <div>
      <EditorInput onSubmit={handleSubmit} />
      <pre>{error}</pre>
      <pre>{results}</pre>
    </div>
  );
}

function EditorInput({ onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    onSubmit(formValues.script);
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="script" placeholder="select * from ..."></textarea>
      <button type="submit">Execute</button>
    </form>
  );
}
