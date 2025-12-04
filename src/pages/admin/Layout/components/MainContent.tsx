import { Outlet } from "react-router-dom";
import { PageTransition } from "@/components/common/PageTransition";

export const MainContent = () => {
  return (
    <main
      className="flex-1 bg-[#0a0a0a] overflow-y-auto overflow-x-hidden"
      style={{ 
        backgroundColor: '#0a0a0a !important',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
      data-admin-main
    >
      <div className="p-4 md:p-6 flex-1 min-h-0">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
    </main>
  );
};

