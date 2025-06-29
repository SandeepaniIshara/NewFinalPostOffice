import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "@/pages/auth/SignIn";
import SignUpPage from "@/pages/auth/SignUp";

import { ProtectedLayout } from "@/layout/ProtectedLayout";
import DashboardPage from "@/pages/dashbord/Dashboard";
import MailsPage from "@/pages/dashbord/mail/MailsPage";
import CustomerPage from "@/pages/dashbord/customer/CustomersPage";
import RoutingAreaPage from "@/pages/dashbord/routingArea/routingAreaPage";
import EmployeesPage from "@/pages/dashbord/employee/EmployeesPage";
import BillsPage from "@/pages/dashbord/bill/BillsPage";
import PrivateRoute, { AuthenticatedRoute } from "@/guards/PrivateRoute";
import DeliverPage from "@/pages/deliver/page";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Private Routes */}

      <Route element={<AuthenticatedRoute />}>
        <Route element={<PrivateRoute />}>
          <Route element={<ProtectedLayout />}>
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
            <Route path="/dashboard/mails" element={<MailsPage />} />
            <Route
              path="/dashboard/routingareas"
              element={<RoutingAreaPage />}
            />
            <Route path="/dashboard/customers" element={<CustomerPage />} />
            <Route path="/dashboard/employees" element={<EmployeesPage />} />
            <Route path="/dashboard/bills" element={<BillsPage />} />

            <Route
              path="/dashboard"
              element={<Navigate to="/dashboard/mails" replace />}
            />

            <Route index element={<DashboardPage />} />
          </Route>
        </Route>
        <Route path="/deliverer" element={<DeliverPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
