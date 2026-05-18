// This is the entry point of the React application. 
// It sets up the React application by rendering the App component inside a BrowserRouter and an AuthProvider context. 
// The global styles are also imported here.
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Importing the main App component 
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);