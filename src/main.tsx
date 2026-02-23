import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

const container = document.getElementById("root");
const root = createRoot(container!);

const isMobile = Capacitor.isNativePlatform();

root.render(
  <React.StrictMode>
    {isMobile ? (
      <HashRouter>
        <App />
      </HashRouter>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>
);