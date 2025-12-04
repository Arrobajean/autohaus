import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const useAdminSidebar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
    // Add admin-panel class to html and body to prevent scroll
    document.documentElement.classList.add('admin-panel');
    document.body.classList.add('admin-panel');
    return () => {
      document.documentElement.classList.remove('admin-panel');
      document.body.classList.remove('admin-panel');
    };
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
    navigate("/");
  }, [navigate]);

  const sidebarLinks = useMemo(() => [
    {
      label: "Panel de Control",
      href: "/admin",
      iconKey: "dashboard" as const,
    },
    {
      label: "Coches",
      href: "/admin/cars",
      iconKey: "car" as const,
    },
    {
      label: "Usuarios",
      href: "/admin/users",
      iconKey: "users" as const,
    },
    {
      label: "Ajustes de Página",
      href: "/admin/settings",
      iconKey: "settings" as const,
    },
  ], []);

  return {
    sidebarOpen,
    setSidebarOpen,
    handleLogout,
    sidebarLinks,
  };
};

