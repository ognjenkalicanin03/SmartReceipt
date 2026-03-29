import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ProcessingReceipt from "./pages/ProcessingReceipt";
import Receipts from "./pages/Receipts";
import HowItWorks from "./pages/HowItWorks";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import ManualEntry from "./pages/ManualEntry";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

                <Route path="/home" element={<Home />} />
                <Route path="/processing" element={<ProcessingReceipt />} />
                <Route path="/manual-entry" element={<ManualEntry />} />
                <Route path="/receipts" element={<Receipts />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/profile" element={<ProfileSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
