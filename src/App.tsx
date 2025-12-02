import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PublicLayout from "@/components/layout/PublicLayout";
import Index from "@/pages/site/home";
import Cars from "@/pages/site/cars";
import CarDetail from "@/pages/site/cars/detail";
import Contact from "@/pages/site/contact";
import Services from "@/pages/site/services";
import About from "@/pages/site/about";
import Login from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/Layout";
import Dashboard from "@/pages/admin/Dashboard";
import UsersList from "@/pages/admin/Users";
import CarsList from "@/pages/admin/Cars";
import CarForm from "@/pages/admin/CarForm";
import { useLenis } from "@/hooks";
import { ScrollToTop } from "@/components/common/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  useLenis();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/coches" element={<Cars />} />
                <Route path="/coches/:slug" element={<CarDetail />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/nosotros" element={<About />} />
                <Route path="/contacto" element={<Contact />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="cars" element={<CarsList />} />
                  <Route path="cars/new" element={<CarForm />} />
                  <Route path="cars/:id" element={<CarForm />} />
                  <Route path="users" element={<UsersList />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
