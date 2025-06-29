import React from "react";
import { useAppSelector } from "@/app/hooks";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export const ProtectedLayout: React.FC = () => {
  const user = useAppSelector((state) => state.user.data);

  if (!user) return <Outlet />; // no sidebar for guests (login, signup)

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 w-full min-h-screen bg-gray-100">
          <SidebarTrigger />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};
