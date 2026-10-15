import { FC } from "react";
import * as LucideIcons from "lucide-react";
import type { ComponentType } from "react";

export type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  onClick?: () => void;
}

type LucideIconComponent = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  onClick?: () => void;
}>;

export const Icon: FC<IconProps> = ({ name, size = 20, color, className = "", strokeWidth, onClick }) => {
  const AllIcons = LucideIcons as unknown as Record<string, LucideIconComponent>;
  const IconComp = AllIcons[name];

  if (!IconComp) {
    return null;
  }

  return <IconComp size={size} color={color} strokeWidth={strokeWidth} className={className} onClick={onClick} />;
};
