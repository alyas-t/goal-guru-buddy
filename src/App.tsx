
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Settings from "./pages/Settings";

// Layouts
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsFirstLoad(false), 500);
    }
  }, [loading]);

  if (loading || isFirstLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-muted-foreground animate-pulse">Loading<span className="loading-dots"></span></p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="settings" element={<Settings />} />
            <Route path="onboarding" element={<Onboarding />} />
          </Route>
          <Route path="/auth/*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth/signin" replace />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
