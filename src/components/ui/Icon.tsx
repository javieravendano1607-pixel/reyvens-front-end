import { FC } from "react";
import {
  AlertCircle, ArrowLeft, ArrowRight, ArrowUp, Award, Bell, Camera, Check, CheckCircle,
  CheckCircle2, ChevronLeft, ChevronRight, CircleCheck, CircleX, Clock3,
  CreditCard, Crown, Gift, Heart, History, Home, ImageOff, Info, LayoutGrid,
  LockKeyhole, LogOut, Mail, MapPin, Medal, Minus, PartyPopper, Plus,
  RefreshCw, Search, ShieldCheck, ShoppingBag, ShoppingCart, Star, Trash2,
  UserRound, Store, Wallet, Wifi, WifiOff, X, XCircle,
} from "lucide-react";

const iconMap = {
  AlertCircle, ArrowLeft, ArrowRight, ArrowUp, Award, Bell, Camera, Check, CheckCircle,
  CheckCircle2, ChevronLeft, ChevronRight, CircleCheck, CircleX, Clock3,
  CreditCard, Crown, Gift, Heart, History, Home, ImageOff, Info, LayoutGrid,
  LockKeyhole, LogOut, Mail, MapPin, Medal, Minus, PartyPopper, Plus,
  RefreshCw, Search, ShieldCheck, ShoppingBag, ShoppingCart, Star, Trash2,
  UserRound, Store, Wallet, Wifi, WifiOff, X, XCircle,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  onClick?: () => void;
}

export const Icon: FC<IconProps> = ({ name, size = 20, color, className = "", strokeWidth, onClick }) => {
  const IconComp = iconMap[name as IconName];

  if (!IconComp) {
    return null;
  }

  return <IconComp size={size} color={color} strokeWidth={strokeWidth} className={className} onClick={onClick} />;
};
