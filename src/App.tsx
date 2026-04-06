import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";

const DashboardOverview = lazy(() => import("./pages/dashboard/Overview.tsx"));
const AIAdvisor = lazy(() => import("./pages/dashboard/AIAdvisor.tsx"));
const GSTFiling = lazy(() => import("./pages/dashboard/GSTFiling.tsx"));
const Documents = lazy(() => import("./pages/dashboard/Documents.tsx"));
const Reports = lazy(() => import("./pages/dashboard/Reports.tsx"));
const Clients = lazy(() => import("./pages/dashboard/Clients.tsx"));
const Settings = lazy(() => import("./pages/dashboard/Settings.tsx"));
const Subscription = lazy(() => import("./pages/dashboard/Subscription.tsx"));
const Checkout = lazy(() => import("./pages/dashboard/Checkout.tsx"));
const PaymentSuccess = lazy(() => import("./pages/dashboard/PaymentSuccess.tsx"));
const PaymentFailed = lazy(() => import("./pages/dashboard/PaymentFailed.tsx"));
const Billing = lazy(() => import("./pages/dashboard/Billing.tsx"));

const Login = lazy(() => import("./pages/auth/Login.tsx"));
const Register = lazy(() => import("./pages/auth/Register.tsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.tsx"));
const OAuthSuccess = lazy(() => import("./pages/OAuthSuccess.tsx"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Suspense fallback={<Loading />}><Login /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<Loading />}><Register /></Suspense>} />
            <Route path="/forgot-password" element={<Suspense fallback={<Loading />}><ForgotPassword /></Suspense>} />
            <Route path="/reset-password" element={<Suspense fallback={<Loading />}><ResetPassword /></Suspense>} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Suspense fallback={<Loading />}><DashboardOverview /></Suspense>} />
              <Route path="ai" element={<Suspense fallback={<Loading />}><AIAdvisor /></Suspense>} />
              <Route path="gst" element={<Suspense fallback={<Loading />}><GSTFiling /></Suspense>} />
              <Route path="documents" element={<Suspense fallback={<Loading />}><Documents /></Suspense>} />
              <Route path="reports" element={<Suspense fallback={<Loading />}><Reports /></Suspense>} />
              <Route path="clients" element={<Suspense fallback={<Loading />}><Clients /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<Loading />}><Settings /></Suspense>} />
              <Route path="subscription" element={<Suspense fallback={<Loading />}><Subscription /></Suspense>} />
              <Route path="checkout" element={<Suspense fallback={<Loading />}><Checkout /></Suspense>} />
              <Route path="payment-success" element={<Suspense fallback={<Loading />}><PaymentSuccess /></Suspense>} />
              <Route path="payment-failed" element={<Suspense fallback={<Loading />}><PaymentFailed /></Suspense>} />
              <Route path="billing" element={<Suspense fallback={<Loading />}><Billing /></Suspense>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
