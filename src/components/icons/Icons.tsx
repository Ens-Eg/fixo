import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const Globe: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    translate
  </i>
);

export const Moon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    dark_mode
  </i>
);

export const Sun: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    light_mode
  </i>
);

export const Menu: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    menu
  </i>
);

export const ArrowRight: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    arrow_forward
  </i>
);

export const ArrowLeft: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    arrow_back
  </i>
);

export const X: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    close
  </i>
);

export const Check: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    check
  </i>
);

export const Sparkles: React.FC<IconProps> = ({ size = 20, className = "", color }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size, color }}
  >
    auto_awesome
  </i>
);

export const Palette: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    palette
  </i>
);

export const BarChart3: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    bar_chart
  </i>
);

export const CreditCard: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    credit_card
  </i>
);

export const HeadphonesIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    headphones
  </i>
);

export const Building2: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    apartment
  </i>
);

export const TrendingUp: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    trending_up
  </i>
);

export const Settings: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    settings
  </i>
);

export const Languages: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    language
  </i>
);

export const Package: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    inventory_2
  </i>
);

export const ListPlus: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    playlist_add
  </i>
);

export const Share2: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    share
  </i>
);

export const Star: React.FC<IconProps> = ({ size = 20, className = "", color }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size, color }}
  >
    star
  </i>
);

export const MessageCircle: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    chat_bubble
  </i>
);

export const Send: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    send
  </i>
);

export const Mail: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    mail
  </i>
);

export const Phone: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    phone
  </i>
);

export const MapPin: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    location_on
  </i>
);

export const Heart: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    favorite
  </i>
);

export const QrCode: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    qr_code_2
  </i>
);

export const Cpu: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    memory
  </i>
);

export const Tag: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    sell
  </i>
);

export const ShoppingCart: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    shopping_cart
  </i>
);

export const Coffee: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    coffee
  </i>
);

export const Users: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    group
  </i>
);

export const Wallet: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    account_balance_wallet
  </i>
);

export const LineChart: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    show_chart
  </i>
);

export const CheckCircle2: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    check_circle
  </i>
);

export const Zap: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    bolt
  </i>
);

export const Smartphone: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    smartphone
  </i>
);

export const ShieldCheck: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    verified_user
  </i>
);

export const Layers: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    layers
  </i>
);

export const ExternalLink: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    open_in_new
  </i>
);

export const Rocket: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    rocket_launch
  </i>
);

export const Crown: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    workspace_premium
  </i>
);

export const ChevronDown: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    keyboard_arrow_down
  </i>
);

export const HelpCircle: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <i
    className={`material-symbols-outlined ${className}`}
    style={{ fontSize: size }}
  >
    help
  </i>
);
