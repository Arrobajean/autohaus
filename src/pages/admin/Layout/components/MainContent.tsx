import { Outlet } from "react-router-dom";
import { PageTransition } from "@/components/common/PageTransition";

export const MainContent = () => {
  return (
    <main
      className="flex-1 bg-[#0a0a0a] p-4 md:p-6"
      style={{ 
        backgroundColor: '#0a0a0a !important', 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        maxHeight: '100vh'
      }}
      data-admin-main
    >
      <PageTransition>
        <Outlet />
      </PageTransition>
    </main>
  );
};

