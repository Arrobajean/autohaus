import { Outlet } from "react-router-dom";
import Navigation from "./navigation";
import Footer from "./Footer";
import { PageTransition } from "@/components/common/PageTransition";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
