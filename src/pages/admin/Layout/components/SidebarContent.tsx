import React, { useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconCar,
  IconUsers,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import {
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { getUserInitials, getUserName, getUserPhotoURL } from "../../features/users/helpers/userHelpers";

interface SidebarContentProps {
  sidebarLinks: Array<{ label: string; href: string; iconKey: string }>;
  onLogout: () => void;
}

const iconMap = {
  dashboard: IconLayoutDashboard,
  car: IconCar,
  users: IconUsers,
  settings: IconSettings,
};

const SidebarContentComponent = ({ sidebarLinks, onLogout }: SidebarContentProps) => {
  const { open, animate, setOpen } = useSidebar();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Memoizar la ruta activa para evitar re-renderizados innecesarios
  const activePath = useMemo(() => location.pathname, [location.pathname]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(href);
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [navigate, setOpen]);

  const handleProfileClick = useCallback(() => {
    navigate("/admin/profile");
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [navigate, setOpen]);

  const handleLogoutClick = useCallback(() => {
    onLogout();
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [onLogout, setOpen]);

  // Memoizar valores del usuario para evitar re-renderizados
  const userInitials = useMemo(() => getUserInitials(user, userProfile), [user, userProfile]);
  const userName = useMemo(() => getUserName(user, userProfile), [user, userProfile]);
  const userPhotoURL = useMemo(() => getUserPhotoURL(user), [user]);

  return (
    <SidebarBody className="flex flex-col justify-between gap-10 h-full">
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {/* Logo/Header */}
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
          <button
            onClick={handleProfileClick}
            className="flex items-center justify-start gap-2 px-3 w-full hover:bg-[#2a2a2a] rounded-md transition-colors"
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={userPhotoURL} />
              <AvatarFallback className="bg-[#2a2a2a] text-white text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <motion.span
              animate={{
                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
              className="text-sm font-medium text-white whitespace-nowrap truncate"
            >
              {userName}
            </motion.span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mt-4 flex flex-col gap-2 px-2">
          {sidebarLinks.map((link) => {
            const IconComponent = iconMap[link.iconKey as keyof typeof iconMap];
            return (
              <SidebarLink
                key={link.href}
                link={{
                  ...link,
                  icon: <IconComponent className="w-5 h-5 text-white" />,
                }}
                className={activePath === link.href ? "bg-[#2a2a2a]" : ""}
                onClick={(e) => handleLinkClick(e, link.href)}
              />
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-2 pb-4">
        <button
          onClick={handleLogoutClick}
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

// Memoizar el componente para evitar re-renderizados innecesarios
// El componente se re-renderizará solo cuando cambien las props o la ruta (via useLocation)
// pero las funciones y valores memoizados evitarán re-renderizados de sub-componentes
export const SidebarContent = React.memo(SidebarContentComponent);

