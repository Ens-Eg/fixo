import React from "react";
import { Icon } from "@iconify/react";

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Material Symbols icon mappings to @iconify/react
// This removes the 3.4MB Material Symbols font dependency
const createIcon = (iconName: string) => {
  return ({ size = 20, className = "", color }: IconProps) => (
    <Icon
      icon={`material-symbols:${iconName}`}
      width={size}
      height={size}
      className={className}
      style={{ color }}
    />
  );
};

export const Globe = createIcon("translate");
export const Moon = createIcon("dark-mode");
export const Sun = createIcon("light-mode");
export const Menu = createIcon("menu");
export const ArrowRight = createIcon("arrow-forward");
export const ArrowLeft = createIcon("arrow-back");
export const X = createIcon("close");
export const Check = createIcon("check");
export const Sparkles = createIcon("auto-awesome");
export const Palette = createIcon("palette");
export const BarChart3 = createIcon("bar-chart");
export const CreditCard = createIcon("credit-card");
export const HeadphonesIcon = createIcon("headphones");
export const Building2 = createIcon("apartment");
export const TrendingUp = createIcon("trending-up");
export const Settings = createIcon("settings");
export const Languages = createIcon("language");
export const Package = createIcon("inventory-2");
export const ListPlus = createIcon("playlist-add");
export const Share2 = createIcon("share");
export const Star = createIcon("star");
export const MessageCircle = createIcon("chat-bubble");
export const Send = createIcon("send");
export const Mail = createIcon("mail");
export const Phone = createIcon("phone");
export const MapPin = createIcon("location-on");
export const Heart = createIcon("favorite");
export const QrCode = createIcon("qr-code-2");
export const Cpu = createIcon("memory");
export const Tag = createIcon("sell");
export const ShoppingCart = createIcon("shopping-cart");
export const Coffee = createIcon("coffee");
export const Users = createIcon("group");
export const Wallet = createIcon("account-balance-wallet");
export const LineChart = createIcon("show-chart");
export const CheckCircle2 = createIcon("check-circle");
export const Zap = createIcon("bolt");
export const Smartphone = createIcon("smartphone");
export const ShieldCheck = createIcon("verified-user");
export const Layers = createIcon("layers");
export const ExternalLink = createIcon("open-in-new");
export const Rocket = createIcon("rocket-launch");
export const Crown = createIcon("workspace-premium");
export const ChevronDown = createIcon("keyboard-arrow-down");
export const HelpCircle = createIcon("help");
