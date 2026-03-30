import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageLoader from "../components/ui/PageLoader";

export default function PublicLayout() {
  return (
    <>
      <PageLoader />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
