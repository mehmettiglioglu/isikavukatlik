import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import PublicLayout from "./public-layout";
import AdminLayout from "./admin-layout";
import AuthGuard from "./auth-guard";

const Home = lazy(() => import("../pages/home"));
const Hakkimizda = lazy(() => import("../pages/hakkimizda"));
const CalismaAlanlari = lazy(() => import("../pages/calisma-alanlari"));
const CalismaAlaniDetay = lazy(() => import("../pages/calisma-alani-detay"));
const Blog = lazy(() => import("../pages/blog"));
const BlogDetay = lazy(() => import("../pages/blog-detay"));
const Iletisim = lazy(() => import("../pages/iletisim"));
const Hesaplamalar = lazy(() => import("../pages/hesaplamalar"));
const HesaplamaDetay = lazy(() => import("../pages/hesaplama-detay"));
const NotFound = lazy(() => import("../pages/not-found"));
const ErrorPage = lazy(() => import("../pages/error-page"));

const AdminLogin = lazy(() => import("../pages/admin/login"));
const AdminBlogList = lazy(() => import("../pages/admin/blog-list"));
const AdminBlogYeni = lazy(() => import("../pages/admin/blog-yeni"));
const AdminDosyalar = lazy(() => import("../pages/admin/dosyalar"));

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: (
      <Suspense>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "hakkimizda", element: <Hakkimizda /> },
      { path: "calisma-alanlari", element: <CalismaAlanlari /> },
      { path: "calisma-alanlari/:slug", element: <CalismaAlaniDetay /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogDetay /> },
      { path: "hesaplamalar", element: <Hesaplamalar /> },
      { path: "hesaplamalar/:slug", element: <HesaplamaDetay /> },
      { path: "iletisim", element: <Iletisim /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "admin/login",
    element: (
      <Suspense>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    path: "admin",
    element: <AuthGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="blog" replace /> },
          { path: "blog", element: <AdminBlogList /> },
          { path: "blog/yeni", element: <AdminBlogYeni /> },
          { path: "dosyalar", element: <AdminDosyalar /> },
        ],
      },
    ],
  },
]);
