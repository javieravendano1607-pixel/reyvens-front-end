import { FC } from "react";

interface BadgeProps {
  count?: number;
  show?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Badge: FC<BadgeProps> = ({ count, show = true, className = "", children }) => {
  if (!show) return <>{children}</>;
  return (
    <span className={`relative inline-flex ${className}`}>
      {children}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );
};
