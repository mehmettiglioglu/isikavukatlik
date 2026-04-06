import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageLoader from "../components/ui/PageLoader";
import IsikAsistan from "../components/chatbot/IsikAsistan";

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <PageLoader />
      <Header />
      {!isHome && <div className="h-[56px] sm:h-[64px] lg:h-[88px]" />}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <IsikAsistan />
    </>
  );
}
