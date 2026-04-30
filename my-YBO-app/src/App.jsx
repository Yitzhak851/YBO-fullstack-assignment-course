import React from "react";
import ToolbarComponent from "./components/ToolbarComponent";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      {/* Toolbar למעלה */}
      <ToolbarComponent />

      {/* עמוד הבית */}
      <HomePage />
    </>
  );
}

export default App;