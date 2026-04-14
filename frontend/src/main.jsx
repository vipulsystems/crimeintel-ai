import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/app/App";
import { Provider } from "react-redux";
import { store } from "./store/store";

import ErrorBoundary from "./shared/components/ErrorBoundary";
import { ToastProvider } from "./shared/ui/Toast";
import "leaflet/dist/leaflet.css";
import "./index.css"; // single source of truth

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);