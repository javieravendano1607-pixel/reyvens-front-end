import { FC } from "react";
import { Outlet } from "react-router-dom";
import { AppBar } from "../components/common/AppBar";
import { BottomBar } from "../components/common/BottomBar";

export const MainLayout: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <AppBar />
      <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom))] pt-2 overflow-y-auto">
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
};
