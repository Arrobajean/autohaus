import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { useAdminSidebar } from "@/hooks/useAdminSidebar";
import { MainContent } from "./components/MainContent";
import { SidebarContent } from "./components/SidebarContent";

const AdminLayout = () => {
  const { sidebarOpen, setSidebarOpen, handleLogout, sidebarLinks } =
    useAdminSidebar();

  return (
    <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
      <div
        data-admin-layout
        className="flex h-screen w-full md:flex-row bg-[#0a0a0a] overflow-hidden"
        style={{ backgroundColor: "#0a0a0a !important" }}
      >
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
          <SidebarContent sidebarLinks={sidebarLinks} onLogout={handleLogout} />
        </Sidebar>
        <MainContent />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
