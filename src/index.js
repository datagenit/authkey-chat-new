import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/app.css";
import "./assets/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./assets/css/icons.min.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import AllProvider from "./context/AllProviders";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
     
        <ChatContextProvider>
          <AllProvider>
            <App />
          </AllProvider>
        </ChatContextProvider>
     
    </AuthContextProvider>
  </React.StrictMode>
);
