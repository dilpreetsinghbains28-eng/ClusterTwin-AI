import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthLayout from '../components/layout/AuthLayout';
import MarketingLayout from '../components/layout/MarketingLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Auth Pages
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const SignUpPage = React.lazy(() => import('../pages/auth/SignUpPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/auth/ForgotPasswordPage'));

// Marketing Pages
const LandingPage = React.lazy(() => import('../pages/marketing/LandingPage'));

// Dashboard Pages
const OverviewPage = React.lazy(() => import('../pages/dashboard/OverviewPage'));
const ClustersPage = React.lazy(() => import('../pages/dashboard/ClustersPage'));
const EnergyPage = React.lazy(() => import('../pages/dashboard/EnergyPage'));
const SimulationPage = React.lazy(() => import('../pages/dashboard/SimulationPage'));
const DigitalTwinPage = React.lazy(() => import('../pages/dashboard/DigitalTwinPage'));
const PredictivePage = React.lazy(() => import('../pages/dashboard/PredictivePage'));
const LogisticsPage = React.lazy(() => import('../pages/dashboard/LogisticsPage'));
const ReportsPage = React.lazy(() => import('../pages/dashboard/ReportsPage'));
const GovernmentPage = React.lazy(() => import('../pages/dashboard/GovernmentPage'));
const PricingPage = React.lazy(() => import('../pages/dashboard/PricingPage'));
const SettingsPage = React.lazy(() => import('../pages/dashboard/SettingsPage'));
const SupportPage = React.lazy(() => import('../pages/dashboard/SupportPage'));
const DocumentationPage = React.lazy(() => import('../pages/dashboard/DocumentationPage'));
const StatusPage = React.lazy(() => import('../pages/dashboard/StatusPage'));
const AlertsPage = React.lazy(() => import('../pages/dashboard/AlertsPage'));

// 404
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));

// Simple fallback loader
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Marketing Routes */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Dashboard Routes (Top Level but wrapped in DashboardLayout) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<OverviewPage />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/factories" element={<ClustersPage />} />
          <Route path="/clusters" element={<LogisticsPage />} />
          <Route path="/energy" element={<EnergyPage />} />
          <Route path="/ai-insights" element={<PredictivePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/government" element={<GovernmentPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          </Route>
        </Route>
        
        {/* Fallback 404 for unhandled root routes */}
        <Route path="*" element={
          <DashboardLayout>
            <NotFoundPage />
          </DashboardLayout>
        } />
      </Routes>
    </Suspense>
  );
}
