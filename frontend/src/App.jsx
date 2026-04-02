import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import "./index.css";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import Home from "./pages/Home";
import CategoryMedicines from "./pages/CategoryMedicines";

import AdminLogin from "./pages/AdminLogin";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import { useAuth } from "./context/AuthContext";
import useGetCity from "./hooks/useGetCity";
import { getDefaultRouteByRole } from "./utils/roleRoutes";
import AdminDashboard from "./components/AdminDashboard";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";

export const serverUrl =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const { user, adminSession } = useAuth();
  useGetCurrentUser();
  useGetCity();
  return (
    <Routes>
      <Route
        path="/signup"
        element={
          !user ? (
            <SignUp />
          ) : (
            <Navigate to={getDefaultRouteByRole(user?.role)} />
          )
        }
      />
      <Route
        path="/signin"
        element={
          !user ? (
            <SignIn />
          ) : (
            <Navigate to={getDefaultRouteByRole(user?.role)} />
          )
        }
      />
      <Route
        path="/admin/login"
        element={
          adminSession ? <Navigate to="/admin" replace /> : <AdminLogin />
        }
      />
      <Route
        path="/admin"
        element={
          adminSession ? <AdminDashboard /> : <Navigate to="/admin/login" />
        }
      />
      <Route
        path="/"
        element={
          user ? (
            user?.role === "delivery" || user?.role === "rider" ? (
              <Navigate to={getDefaultRouteByRole(user?.role)} />
            ) : (
              <Home />
            )
          ) : (
            <Navigate to={"/signin"} />
          )
        }
      />
      <Route
        path="/category/:categoryName"
        element={
          user ? (
            user?.role === "delivery" || user?.role === "rider" ? (
              <Navigate to={getDefaultRouteByRole(user?.role)} />
            ) : (
              <CategoryMedicines />
            )
          ) : (
            <Navigate to={"/signin"} />
          )
        }
      />
      <Route
        path="/delivery"
        element={
          user ? (
            user?.role === "delivery" || user?.role === "rider" ? (
              <DeliveryDashboard />
            ) : (
              <Navigate to={getDefaultRouteByRole(user?.role)} />
            )
          ) : (
            <Navigate to={"/signin"} />
          )
        }
      />
      <Route
        path="/cart"
        element={user ? <Cart /> : <Navigate to="/signin" />}
      />
      <Route
        path="/orders"
        element={user ? <Orders /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;
