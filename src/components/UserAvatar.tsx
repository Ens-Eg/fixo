"use client";

import React, { useState } from "react";

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showBorder?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-2xl",
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = "md",
  className = "",
  showBorder = false,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitial = (name?: string): string => {
    if (!name || name.trim().length === 0) return "?";
    // Get first character, support both Arabic and English
    return name.trim().charAt(0).toUpperCase();
  };

  const initial = getInitial(name);
  const sizeClass = sizeClasses[size];
  const borderClass = showBorder ? "border-2 border-primary-200" : "";

  // Generate a consistent color based on the name
  const getColorFromName = (name?: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    
    // Handle empty or undefined names
    if (!name || name.trim().length === 0) {
      return colors[0]; // Return default color
    }
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getColorFromName(name);

  // Show image only if src exists, is not empty, and didn't fail to load
  const shouldShowImage = src && src.trim() !== "" && !imageError;

  if (shouldShowImage) {
    // Check if it's an external URL (Google, Facebook, backend API, etc.)
    // Use regular img tag for all external URLs (including backend API images)
    const isExternalImage = src.startsWith('http://') || src.startsWith('https://');
    
    return (
      <div
        className={`relative rounded-full overflow-hidden ${sizeClass} ${borderClass} ${className} ${
          onClick ? "cursor-pointer" : ""
        }`}
        onClick={onClick}
      >
        {/* Use regular img tag for all external images (Google, backend API, etc.) */}
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("❌ Image failed to load:", src);
            setImageError(true);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full ${sizeClass} ${borderClass} ${avatarColor} text-white font-bold ${className} ${
        onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
      }`}
      onClick={onClick}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;

