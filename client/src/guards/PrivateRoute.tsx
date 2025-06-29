import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

interface UserData {
  role: string;
}
const PrivateRoute: React.FC<{ redirectPath?: string }> = ({
  redirectPath = "/",
}) => {
  const userData = useAppSelector(
    (state) => state.user.data
  ) as UserData | null;
  const isAuthenticated =
    userData?.role === "POSTALCLERK" || userData?.role === "ADMIN";
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default PrivateRoute;

export const DeliverRoute: React.FC<{ redirectPath?: string }> = ({
  redirectPath = "/",
}) => {
  const userData = useAppSelector(
    (state) => state.user.data
  ) as UserData | null;
  const isAuthenticated = userData?.role === "MAIL_DELIVERER";
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} />;
};

export const AuthenticatedRoute: React.FC<{ redirectPath?: string }> = ({
  redirectPath = "/",
}) => {
  const userData = useAppSelector(
    (state) => state.user.data
  ) as UserData | null;

  
  const isAuthenticated =
    userData?.role === "ADMIN" ||
    userData?.role === "POSTALCLERK" ||
    userData?.role === "MAIL_DELIVERER";
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} />;
};
