import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MedicineCatalogProvider } from "./context/MedicineCatalogContext.jsx";
import { CartProvider } from "./context/CartContext";
import axios from "axios"; // ✅ Add this line

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <MedicineCatalogProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </MedicineCatalogProvider>
    </AuthProvider>
  </BrowserRouter>,
);
