import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useLenis } from "@/hooks";
import { ScrollToTop } from "@/components/common/ScrollToTop";

// Lazy load layouts
const PublicLayout = lazy(() => import("@/components/layout/PublicLayout"));

// Lazy load public pages
const Index = lazy(() => import("@/pages/site/home"));
const Cars = lazy(() => import("@/pages/site/cars"));
const CarDetail = lazy(() => import("@/pages/site/cars/detail"));
const CarDetailPreview = lazy(() => import("@/pages/site/cars/preview"));
const Contact = lazy(() => import("@/pages/site/contact"));
const Services = lazy(() => import("@/pages/site/services"));
const About = lazy(() => import("@/pages/site/about"));

// Lazy load admin pages
const Login = lazy(() => import("@/pages/admin/Login"));
const AdminLayout = lazy(() => import("@/pages/admin/Layout"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const UsersList = lazy(() => import("@/pages/admin/Users"));
const CarsList = lazy(() => import("@/pages/admin/Cars"));
const CarForm = lazy(() => import("@/pages/admin/CarForm"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const Profile = lazy(() => import("@/pages/admin/Profile"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/coches" element={<Cars />} />
                  <Route path="/coches/:slug" element={<CarDetail />} />
                  <Route path="/preview/coche" element={<CarDetailPreview />} />
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
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
