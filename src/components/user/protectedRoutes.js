import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const user = localStorage.getItem("auth-token");
  if (user) {
    return true;
  } else {
    return false;
  }
};

const ProtectedRoutes = () => {
  const auth = useAuth();

  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;