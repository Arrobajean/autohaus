"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  const { className, children, ...restProps } = props;
  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <DesktopSidebar className={className} {...restProps}>
        {children}
      </DesktopSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full py-4 hidden md:flex md:flex-col bg-[#1a1a1a] w-[300px] shrink-0 overflow-hidden border-r border-[#2a2a2a]",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "80px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div className="md:hidden">
      {/* Mobile Menu Button - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 h-14 px-4 flex items-center bg-[#1a1a1a] w-full z-40 border-b border-[#2a2a2a]">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-white hover:bg-[#2a2a2a] px-3 py-2 rounded-md transition-colors"
        >
          <IconMenu2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">Panel Admin</span>
        </button>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Mobile Sidebar Panel - Slides in when open */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay - Click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[90]"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#1a1a1a] z-[100] flex flex-col shadow-2xl"
            >
              {/* Header with close button */}
              <div className="h-14 px-4 flex items-center justify-between bg-[#1a1a1a] border-b border-[#2a2a2a]">
                <span className="text-sm font-medium text-white">
                  Menú de Navegación
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:bg-[#2a2a2a] p-1.5 rounded"
                >
                  <IconX className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div
                className={cn("flex-1 overflow-hidden", className)}
                {...props}
              >
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick,
  ...props
}: {
  link: Links;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const { open, animate } = useSidebar();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  const isActive = className?.includes("bg-[#2a2a2a]");

  return (
    <a
      href={link.href}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-md hover:bg-[#2a2a2a] transition-colors",
        // Estado activo: fondo siempre visible cuando está activo
        isActive && "bg-[#2a2a2a]"
      )}
      {...props}
    >
      <span className="h-5 w-5 shrink-0 flex items-center justify-center">
        {link.icon}
      </span>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-gray-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </a>
  );
};
