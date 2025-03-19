
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LicenseProvider } from "./context/LicenseContext";

import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import LicenseUpload from "./pages/LicenseUpload";
import ManagerApproval from "./pages/ManagerApproval";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

// Cork City Council theme colors - adding primary color that matches their logo
import "./App.css";

const queryClient = new QueryClient();

// PrivateRoute component for protected routes
const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LicenseProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/license-upload" 
                element={
                  <PrivateRoute>
                    <LicenseUpload />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/manager-approval" 
                element={
                  <PrivateRoute requiredRole="manager">
                    <ManagerApproval />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/notifications" 
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LicenseProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
