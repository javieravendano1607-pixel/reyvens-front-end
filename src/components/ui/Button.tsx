import { FC, ReactNode } from "react";
import { Icon } from "./Icon";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: string | ReactNode;
  rightIcon?: string | ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const renderIcon = (icon: string | ReactNode | undefined, size: number) => {
  if (!icon) return null;
  if (typeof icon === "string") {
    return <Icon name={icon} size={size} />;
  }
  return icon;
};

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) => {
  const base = "flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg active:scale-95 focus:ring-primary-500",
    outline: "border-2 border-primary-600 bg-transparent text-primary-600 hover:bg-primary-50 active:scale-95 focus:ring-primary-500",
    ghost: "bg-transparent text-surface-600 hover:bg-surface-100 active:scale-95 focus:ring-surface-400",
    gold: "bg-gold-400 hover:bg-gold-500 text-white shadow-md hover:shadow-lg active:scale-95 focus:ring-gold-400",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;
  const width = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
    >
      {renderIcon(leftIcon, iconSize)}
      {children}
      {renderIcon(rightIcon, iconSize)}
    </button>
  );
};

interface IconButtonProps {
  icon: string | ReactNode;
  onClick?: () => void;
  label?: string;
  variant?: "ghost" | "primary" | "outline";
  size?: "sm" | "md" | "lg";
  badge?: number;
  className?: string;
}

export const IconButton: FC<IconButtonProps> = ({
  icon,
  onClick,
  label,
  variant = "ghost",
  size = "md",
  badge,
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 24,
  };

  const variantClasses = {
    ghost: "bg-transparent text-surface-600 hover:bg-surface-100",
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    outline: "border border-surface-300 bg-transparent text-surface-700 hover:bg-surface-100",
  };

  const iconNode = typeof icon === "string" ? <Icon name={icon} size={iconSizes[size]} /> : icon;

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={label}
    >
      {iconNode}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
};

