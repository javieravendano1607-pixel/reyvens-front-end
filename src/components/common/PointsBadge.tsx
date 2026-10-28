import { FC } from "react";
import { Icon } from "../ui/Icon";

interface PointsBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
  variant?: "inline" | "badge";
}

export const PointsBadge: FC<PointsBadgeProps> = ({ points, size = "md", variant = "inline" }) => {
  const sizeClasses = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  if (variant === "badge") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-primary-800 px-1.5 py-0.5 font-bold text-white">
        <Icon name="Award" size={iconSizes[size]}  />
        <span className={`${sizeClasses[size]}`}>{points}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary-50 px-1.5 py-0.5 font-medium text-primary-900">
      <Icon name="Award" size={iconSizes[size]}  />
      <span className={sizeClasses[size]}>+{points} pts</span>
    </span>
  );
};
