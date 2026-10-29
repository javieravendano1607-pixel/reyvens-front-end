import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { Home } from "../pages/home/Home";
import { Categories } from "../pages/home/Categories";
import { ProductDetail } from "../pages/products/ProductDetail";
import { Store } from "../pages/stores/Store";
import { Rewards } from "../pages/rewards/Rewards";
import { Cart } from "../pages/cart/Cart";
import { History } from "../pages/history/History";
import { Receipt } from "../pages/receipt/Receipt";
import { Wallet } from "../pages/wallet/Wallet";
import { Search } from "../pages/Search";
import { Login } from "../pages/auth/Login";
import { Welcome } from "../pages/auth/Welcome";
import { Location } from "../pages/auth/Location";
import { GoogleLoginCallback } from "../pages/auth/GoogleLoginCallback";
import { AccountSecurity } from "../pages/account/AccountSecurity";
import { AccountHome } from "../pages/account/AccountHome";
import type { ReactNode } from "react";
import { SessionSkeleton } from "../components/common/LoadingPatterns";

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <SessionSkeleton />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <SessionSkeleton />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const protectedPage = (element: ReactNode) => <RequireAuth>{element}</RequireAuth>;

export function AppRoutes() {
  return <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/location" element={<Location />} />
      <Route path="/auth/google/callback" element={<GoogleLoginCallback />} />
    </Route>
    <Route element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/store/:id" element={<Store />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/cart" element={protectedPage(<Cart />)} />
      <Route path="/history" element={protectedPage(<History />)} />
      <Route path="/receipt/:id" element={protectedPage(<Receipt />)} />
      <Route path="/wallet" element={protectedPage(<Wallet />)} />
      <Route path="/account" element={protectedPage(<AccountHome />)} />
      <Route path="/account/security" element={protectedPage(<AccountSecurity />)} />
      <Route path="/search" element={<Search />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>;
}
