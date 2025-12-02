import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LayoutDashboard, Car, Users, LogOut } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/common/PageTransition";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const sidebarLinks = [
    {
      label: "Panel de Control",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Coches",
      href: "/admin/cars",
      icon: <Car className="w-5 h-5" />,
    },
    {
      label: "Usuarios",
      href: "/admin/users",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
          <SidebarBody className="flex flex-col justify-between">
            <div>
              <div className="p-4 md:p-6">
                <h1 className="text-lg md:text-2xl text-gray-800 dark:text-gray-200">
                  Panel de Administración
                </h1>
              </div>
              <nav className="mt-4 md:mt-6 space-y-2 px-2 md:px-4">
                {sidebarLinks.map((link) => (
                  <SidebarLink
                    key={link.href}
                    link={link}
                    className={cn(
                      "rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                      location.pathname === link.href &&
                        "bg-gray-200 dark:bg-gray-700"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.href);
                    }}
                  />
                ))}
              </nav>
            </div>
            <div className="p-3 md:p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-2 md:px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-neutral-700 dark:text-neutral-200"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm">Cerrar Sesión</span>
              </button>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
