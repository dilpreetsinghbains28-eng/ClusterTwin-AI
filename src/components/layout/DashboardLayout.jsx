import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "../../components/Footer";
import AICopilot from "../../components/ui/AICopilot";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-base antialiased overflow-x-hidden">
      <Navbar />
      <Sidebar />
      <main className="flex-1 md:ml-64 mt-16 p-container-padding-mobile md:p-container-padding-desktop min-h-[calc(100vh-64px)] relative">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      
      {/* Global AI Copilot */}
      <AICopilot />
    </div>
  );
}
