import { FC } from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white p-4">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
};
