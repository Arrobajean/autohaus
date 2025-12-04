import { Outlet } from "react-router-dom";
import { PageTransition } from "@/components/common/PageTransition";

export const MainContent = () => {
  return (
    <main
      className="flex-1 bg-[#0a0a0a] overflow-hidden"
      style={{ 
        backgroundColor: '#0a0a0a !important',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        maxHeight: '100%'
      }}
      data-admin-main
    >
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6"
        style={{
          minHeight: 0,
          maxHeight: '100%'
        }}
      >
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
    </main>
  );
};

