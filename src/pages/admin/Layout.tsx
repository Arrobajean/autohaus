import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  IconLayoutDashboard,
  IconCar,
  IconUsers,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import {
  SidebarProvider,
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/common/PageTransition";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const MainContent = () => {
  return (
    <main 
      className="flex-1 overflow-y-auto overflow-x-auto bg-[#0a0a0a] p-4 md:p-6" 
      style={{ backgroundColor: '#0a0a0a !important' }}
      data-admin-main
    >
      <PageTransition>
        <Outlet />
      </PageTransition>
    </main>
  );
};

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
      icon: <IconLayoutDashboard className="w-5 h-5 text-white" />,
    },
    {
      label: "Coches",
      href: "/admin/cars",
      icon: <IconCar className="w-5 h-5 text-white" />,
    },
    {
      label: "Usuarios",
      href: "/admin/users",
      icon: <IconUsers className="w-5 h-5 text-white" />,
    },
    {
      label: "Configuración",
      href: "/admin/settings",
      icon: <IconSettings className="w-5 h-5 text-white" />,
    },
  ];

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
    // Add admin-panel class to body for dark theme
    document.body.classList.add('admin-panel');
    return () => {
      document.body.classList.remove('admin-panel');
    };
  }, []);

  return (
    <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
      <div 
        data-admin-layout
        className="flex h-screen w-full md:flex-row overflow-hidden bg-[#0a0a0a]" 
        style={{ backgroundColor: '#0a0a0a !important' }}
      >
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
          <SidebarContent
            sidebarLinks={sidebarLinks}
            location={location}
            navigate={navigate}
            handleLogout={handleLogout}
          />
        </Sidebar>
        <MainContent />
      </div>
    </SidebarProvider>
  );
};

const SidebarContent = ({
  sidebarLinks,
  location,
  navigate,
  handleLogout,
}: {
  sidebarLinks: Array<{ label: string; href: string; icon: React.ReactNode }>;
  location: { pathname: string };
  navigate: (path: string) => void;
  handleLogout: () => void;
}) => {
  const { open, animate, setOpen } = useSidebar();
  const { user, userProfile } = useAuth();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(href);
    // Close mobile sidebar after navigation
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  const getUserInitials = () => {
    // Prioridad: user.displayName (Google) > userProfile.displayName > email
    const displayName = user?.displayName || userProfile?.displayName;
    if (displayName) {
      return displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      // Si no hay displayName, usar las primeras dos letras del email
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    // Prioridad: user.displayName (Google) > userProfile.displayName > email prefix
    return user?.displayName || userProfile?.displayName || user?.email?.split('@')[0] || 'Usuario';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  const getUserPhotoURL = () => {
    // Priorizar photoURL de Firebase Auth (Google) sobre cualquier otra fuente
    // Firebase Auth siempre tiene la foto más actualizada de Google
    return user?.photoURL || undefined;
  };

  const getUserRole = () => {
    // Obtener el rol del perfil de Firestore
    return userProfile?.role || null;
  };

  return (
    <SidebarBody className="flex flex-col justify-between gap-10 h-full overflow-hidden">
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {/* Logo/Header - Desktop only or mobile when open */}
        <div className="flex items-center px-4 py-4">
          {open ? (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-medium text-white whitespace-nowrap"
            >
              Panel de Administración
            </motion.h1>
          ) : (
            <div className="h-6 w-6 rounded-lg bg-[#2a2a2a]" />
          )}
        </div>

        {/* User Profile */}
        <div className="px-2 py-3 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-start gap-2 px-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={getUserPhotoURL()} />
              <AvatarFallback className="bg-[#2a2a2a] text-white text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <motion.span
              animate={{
                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
              className="text-sm font-medium text-white whitespace-nowrap truncate"
            >
              {getUserName()}
            </motion.span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-4 flex flex-col gap-2 px-2">
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.href}
              link={link}
              className={location.pathname === link.href ? "bg-[#2a2a2a]" : ""}
              onClick={(e) => handleLinkClick(e, link.href)}
            />
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-2 pb-4">
        <button
          onClick={() => {
            handleLogout();
            if (window.innerWidth < 768) {
              setOpen(false);
            }
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-[#2a2a2a] transition-colors text-gray-200"
        >
          <IconLogout className="h-5 w-5 shrink-0 text-white" />
          <motion.span
            animate={{
              display: animate ? (open ? "inline-block" : "none") : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            className="text-sm whitespace-nowrap"
          >
            Cerrar Sesión
          </motion.span>
        </button>
      </div>
    </SidebarBody>
  );
};

export default AdminLayout;
