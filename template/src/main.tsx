import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./styles/reset.css";
import "./index.css";
import React from "react";

// 生产环境关闭console警告
if (import.meta.env.PROD) {
  console.warn = () => {};
  console.error = () => {};
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
