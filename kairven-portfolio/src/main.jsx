import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LEGACY_REDIRECTS, ROUTE_METADATA } from "./routeMetadata.js";

const root = document.getElementById("root");
const route = window.location.pathname.replace(/\/+$/, "") || "/";
const redirect = LEGACY_REDIRECTS[route];

if (redirect) {
  window.location.replace(redirect);
} else if (route !== "/") {
  import("./SecondaryPages.jsx")
    .then(({ SecondaryPages }) => renderApp(SecondaryPages))
    .catch((error) => {
      console.error("Kairven's requested page could not be loaded.", error);
      showLoadFailure();
    });
} else {
  renderApp();
}

function renderApp(RoutePagesComponent) {
  const app = (
    <StrictMode>
      <App RoutePagesComponent={RoutePagesComponent} />
    </StrictMode>
  );
  const hasPrerenderedRoute = route === "/" || Object.hasOwn(ROUTE_METADATA, route);

  if (root.hasChildNodes() && hasPrerenderedRoute) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}

function showLoadFailure() {
  if (!root) return;
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent = "This Kairven page could not be loaded. Please refresh or return home.";
  root.replaceChildren(message);
}
