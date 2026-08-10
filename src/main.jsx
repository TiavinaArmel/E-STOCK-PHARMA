// Dans main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify"; // Importé
import 'react-toastify/dist/ReactToastify.css';  // Importé

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/main.scss";

import App from "./App";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        {/* Ajoute le conteneur ici */}
        <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false} 
            newestOnTop={true} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
            theme="colored"
        />
        <App />
    </React.StrictMode>
);