import React from "react";
import { Navigate, Outlet } from "react-router";

interface PrivateRouteProps {
  isRegistered: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ isRegistered }) => {
  if (isRegistered) {
    return <Outlet />;
  }

  return <Navigate to='/registration' replace />;
};
