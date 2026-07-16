import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { ContentProvider } from "./context/ContentProvider.jsx";
import { initClientMonitoring } from "./utils/monitoring.js";
import "./styles.css";

initClientMonitoring();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ErrorBoundary>
            <ContentProvider>
                <App />
            </ContentProvider>
        </ErrorBoundary>
    </StrictMode>,
);
