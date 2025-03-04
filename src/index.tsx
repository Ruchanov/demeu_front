import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./app/locales/i18n";
import "virtual:svg-icons-register";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "471947220496-3kc6ch0lg83ovckebiju092uurv4p0e1.apps.googleusercontent.com"; // Замените на реальный Google Client ID

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
