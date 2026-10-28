import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ConnectivityNotice } from "../components/common/ConnectivityNotice";

export const AuthLayout: FC = () => <div className="min-h-screen bg-surface-50"><ConnectivityNotice /><Outlet /></div>;
