"use client";

import "remixicon/fonts/remixicon.css";
import "material-symbols"; // Material symbols used in Navbar (above fold)
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Sparkles,
  Cpu,
  Tag,
  Menu,
  X,
  Moon,
  Sun,
  Globe,
} from "@/components/icons/Icons";
import { Logo } from "@/components/common/Logo";
import { Icon } from "@iconify/react";

// Variants for staggered children
const menuVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    transition: {
      when: "afterChildren" as const,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren" as const,
      staggerChildren: 0.1,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, x: 5 },
  visible: { opacity: 1, y: 0, x: 0 },
};

// NavLink Component
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.FC<{ size?: number; className?: string }>;
  delay?: number;
  onClick?: () => void;
}



const svgIcons = {
  USA: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 512 512" xml:space="preserve">
<path style="fill:#F5F5F5;" d="M473.655,88.276H38.345C17.167,88.276,0,105.443,0,126.621V385.38  c0,21.177,17.167,38.345,38.345,38.345h435.31c21.177,0,38.345-17.167,38.345-38.345V126.621  C512,105.443,494.833,88.276,473.655,88.276z"/>
<g>
	<path style="fill:#FF4B55;" d="M2.109,114.08H509.89c-5.196-15.017-19.452-25.804-36.235-25.804H38.345   C21.561,88.276,7.306,99.063,2.109,114.08z"/>
	<rect y="191.49" style="fill:#FF4B55;" width="512" height="25.803"/>
	<rect y="139.88" style="fill:#FF4B55;" width="512" height="25.803"/>
	<path style="fill:#FF4B55;" d="M0,260.074c0,4.875,3.953,8.828,8.828,8.828H512v-25.804H0V260.074z"/>
	<rect y="346.32" style="fill:#FF4B55;" width="512" height="25.804"/>
	<path style="fill:#FF4B55;" d="M509.891,397.92H2.109c5.197,15.017,19.453,25.804,36.236,25.804h435.31   C490.439,423.724,504.694,412.937,509.891,397.92z"/>
	<rect y="294.71" style="fill:#FF4B55;" width="512" height="25.803"/>
</g>
<path style="fill:#41479B;" d="M8.828,268.902h220.69c4.875,0,8.828-3.953,8.828-8.828V97.103c0-4.876-3.953-8.828-8.828-8.828  H38.345C17.167,88.276,0,105.443,0,126.621v133.453C0,264.95,3.953,268.902,8.828,268.902z"/>
<g>
	<path style="fill:#F5F5F5;" d="M24.789,108.537l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.669   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928L24,122.841l-5.025,3.592c-0.651,0.466-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.669c-0.643-0.476-0.312-1.496,0.488-1.502l6.177-0.047l1.954-5.86C23.463,107.778,24.535,107.778,24.789,108.537z"/>
	<path style="fill:#F5F5F5;" d="M24.789,139.191l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928L24,153.496l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C23.463,138.433,24.535,138.433,24.789,139.191z"/>
	<path style="fill:#F5F5F5;" d="M24.789,169.846l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928L24,184.151l-5.025,3.592c-0.651,0.465-1.518-0.165-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C23.463,169.087,24.535,169.087,24.789,169.846z"/>
	<path style="fill:#F5F5F5;" d="M24.789,200.5l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928L24,214.805l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.474-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C23.463,199.741,24.535,199.741,24.789,200.5z"/>
	<path style="fill:#F5F5F5;" d="M24.789,231.154l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928L24,245.459l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C23.463,230.396,24.535,230.396,24.789,231.154z"/>
	<path style="fill:#F5F5F5;" d="M48.582,123.566l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C47.256,122.808,48.329,122.808,48.582,123.566z"/>
	<path style="fill:#F5F5F5;" d="M48.582,154.221l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.165-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.474-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C47.256,153.462,48.329,153.462,48.582,154.221z"/>
	<path style="fill:#F5F5F5;" d="M48.582,184.875l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C47.256,184.116,48.329,184.116,48.582,184.875z"/>
	<path style="fill:#F5F5F5;" d="M48.582,215.529l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.466-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C47.256,214.771,48.329,214.771,48.582,215.529z"/>
	<path style="fill:#F5F5F5;" d="M72.375,108.537l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.669   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.466-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.669c-0.643-0.476-0.312-1.496,0.488-1.502l6.177-0.047l1.954-5.86C71.049,107.778,72.122,107.778,72.375,108.537z"/>
	<path style="fill:#F5F5F5;" d="M72.375,139.191l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C71.049,138.433,72.122,138.433,72.375,139.191z"/>
	<path style="fill:#F5F5F5;" d="M72.375,169.846l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.165-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C71.049,169.087,72.122,169.087,72.375,169.846z"/>
	<path style="fill:#F5F5F5;" d="M72.375,200.5l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.474-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C71.049,199.741,72.122,199.741,72.375,200.5z"/>
	<path style="fill:#F5F5F5;" d="M72.375,231.154l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C71.049,230.396,72.122,230.396,72.375,231.154z"/>
	<path style="fill:#F5F5F5;" d="M96.169,123.566l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C94.842,122.808,95.916,122.808,96.169,123.566z"/>
	<path style="fill:#F5F5F5;" d="M96.169,154.221l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.165-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.474-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C94.842,153.462,95.916,153.462,96.169,154.221z"/>
	<path style="fill:#F5F5F5;" d="M96.169,184.875l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C94.842,184.116,95.916,184.116,96.169,184.875z"/>
	<path style="fill:#F5F5F5;" d="M96.169,215.529l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.466-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C94.842,214.771,95.916,214.771,96.169,215.529z"/>
	<path style="fill:#F5F5F5;" d="M119.962,108.537l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.669   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.026-3.591l-5.025,3.592c-0.651,0.466-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.669c-0.643-0.476-0.312-1.496,0.488-1.502l6.177-0.047l1.954-5.86C118.636,107.778,119.709,107.778,119.962,108.537z"/>
	<path style="fill:#F5F5F5;" d="M119.962,139.191l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.026-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C118.636,138.433,119.709,138.433,119.962,139.191z"/>
	<path style="fill:#F5F5F5;" d="M119.962,169.846l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.026-3.593l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C118.636,169.087,119.709,169.087,119.962,169.846z"/>
	<path style="fill:#F5F5F5;" d="M119.962,200.5l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.026-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.474-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C118.636,199.741,119.709,199.741,119.962,200.5z"/>
	<path style="fill:#F5F5F5;" d="M119.962,231.154l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.026-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C118.636,230.396,119.709,230.396,119.962,231.154z"/>
	<path style="fill:#F5F5F5;" d="M143.755,123.566l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C142.43,122.808,143.502,122.808,143.755,123.566z"/>
	<path style="fill:#F5F5F5;" d="M143.755,154.221l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.165-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.474-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C142.43,153.462,143.502,153.462,143.755,154.221z"/>
	<path style="fill:#F5F5F5;" d="M143.755,184.875l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C142.43,184.116,143.502,184.116,143.755,184.875z"/>
	<path style="fill:#F5F5F5;" d="M143.755,215.529l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.466-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C142.43,214.771,143.502,214.771,143.755,215.529z"/>
	<path style="fill:#F5F5F5;" d="M167.549,108.537l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.669   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.466-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.669c-0.643-0.476-0.312-1.496,0.488-1.502l6.177-0.047l1.954-5.86C166.222,107.778,167.296,107.778,167.549,108.537z"/>
	<path style="fill:#F5F5F5;" d="M167.549,139.191l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C166.222,138.433,167.296,138.433,167.549,139.191z"/>
	<path style="fill:#F5F5F5;" d="M167.549,169.846l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.165-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C166.222,169.087,167.296,169.087,167.549,169.846z"/>
	<path style="fill:#F5F5F5;" d="M167.549,200.5l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.474-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C166.222,199.741,167.296,199.741,167.549,200.5z"/>
	<path style="fill:#F5F5F5;" d="M167.549,231.154l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C166.222,230.396,167.296,230.396,167.549,231.154z"/>
	<path style="fill:#F5F5F5;" d="M191.342,123.566l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C190.016,122.808,191.089,122.808,191.342,123.566z"/>
	<path style="fill:#F5F5F5;" d="M191.342,154.221l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.165-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.474-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C190.016,153.462,191.089,153.462,191.342,154.221z"/>
	<path style="fill:#F5F5F5;" d="M191.342,184.875l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C190.016,184.116,191.089,184.116,191.342,184.875z"/>
	<path style="fill:#F5F5F5;" d="M191.342,215.529l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.466-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C190.016,214.771,191.089,214.771,191.342,215.529z"/>
	<path style="fill:#F5F5F5;" d="M215.136,108.537l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.669   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.466-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.669c-0.643-0.476-0.312-1.496,0.488-1.502l6.177-0.047l1.954-5.86C213.81,107.778,214.882,107.778,215.136,108.537z"/>
	<path style="fill:#F5F5F5;" d="M215.136,139.191l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C213.81,138.433,214.882,138.433,215.136,139.191z"/>
	<path style="fill:#F5F5F5;" d="M215.136,169.846l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.165-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C213.81,169.087,214.882,169.087,215.136,169.846z"/>
	<path style="fill:#F5F5F5;" d="M215.136,200.5l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.027,0.488,1.502l-4.969,3.67l1.864,5.889   c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889l-4.969-3.67   c-0.643-0.474-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C213.81,199.741,214.882,199.741,215.136,200.5z"/>
	<path style="fill:#F5F5F5;" d="M215.136,231.154l1.954,5.86l6.177,0.047c0.8,0.007,1.131,1.026,0.488,1.502l-4.969,3.67   l1.864,5.889c0.242,0.762-0.627,1.394-1.278,0.928l-5.025-3.592l-5.025,3.592c-0.651,0.465-1.518-0.166-1.278-0.928l1.864-5.889   l-4.969-3.67c-0.643-0.476-0.312-1.495,0.488-1.502l6.177-0.047l1.954-5.86C213.81,230.396,214.882,230.396,215.136,231.154z"/>
</g>
</svg>`,
  UAE: `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 512.001 512.001" xml:space="preserve">
<path style="fill:#73AF00;" d="M473.655,88.276H158.897v111.816H512v-73.471C512,105.443,494.833,88.276,473.655,88.276z"/>
<path style="fill:#464655;" d="M158.897,423.724h314.759c21.177,0,38.345-17.167,38.345-38.345v-73.471H158.897V423.724z"/>
<rect x="158.9" y="200.09" style="fill:#F5F5F5;" width="353.1" height="111.81"/>
<path style="fill:#FF4B55;" d="M38.345,88.276C17.167,88.276,0,105.443,0,126.621V385.38c0,21.177,17.167,38.345,38.345,38.345  h120.552V88.276H38.345z"/>
</svg>`
}
const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  icon: Icon,
  delay = 0,
  onClick,
}) => (
  <a
    href={href}
    onClick={(e) => {
      e.preventDefault();
      onClick?.();
    }}
    className="relative group text-slate-600 dark:text-slate-300 text-[14px] font-bold transition-colors duration-300 py-1 flex items-center gap-1.5 cursor-pointer"
  >
    <Icon
      size={16}
      className="text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
    />
    <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
      {children}
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-600 dark:bg-purple-400 transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
  </a>
);

const Navbar = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("navbar");
  const whatsapp = +971586551491;
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}` : null;
  const isRTL = locale === "ar";

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.toggle("dark", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const cleanPath = pathname.replace(/^\/(ar|en)/, "") || "/";
    window.location.href = `/${locale === "ar" ? "en" : "ar"}${cleanPath}`;
  };

  const withLocale = (path: string) =>
    path.startsWith("#") ? path : `/${locale}${path}`;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Navbar height offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsOpen(false); // Close mobile menu
    }
  };

  const navLinks = [
    { name: t("features"), href: "#features", icon: Sparkles, sectionId: "features" },
    { name: t("useCases"), href: "#use-cases", icon: Cpu, sectionId: "use-cases" },
    { name: t("pricing"), href: "#pricing", icon: Tag, sectionId: "pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "backdrop-blur-xl bg-white/70 dark:bg-[#0d1117]/70 py-3 shadow-sm border-b border-purple-100 dark:border-purple-900"
        : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href={`/${locale}`}>
          <Logo />
        </Link>

        <div className="hidden lg:flex items-center  gap-10 lg:gap-5 xl:gap-10">
          {navLinks.map((link, idx) => (
            <NavLink
              key={link.name}
              href={link.href}
              icon={link.icon}
              delay={idx * 0.1}
              onClick={() => scrollToSection(link.sectionId)}
            >
              {link.name}
            </NavLink>
          ))}
          {whatsapp &&
            <a
              href={whatsappUrl || ""}
              target="_blank"
              className="relative group text-slate-600 dark:text-slate-300 text-[14px] font-bold transition-colors duration-300 py-1 flex items-center gap-1.5 cursor-pointer"
            >
              <Icon
                icon="ri-whatsapp-fill"
                width={16}
                height={16}
                className="text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
              />
              <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {t("contact")}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-600 dark:bg-purple-400 transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
            </a>
          }
        </div>

        <div className="flex items-center ms-auto lg:ms-0 gap-1 lg:gap-2 xl:gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="w-9 h-9 flex items-center justify-center rounded-full font-bold text-[14px] text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all"
          >
            <span dangerouslySetInnerHTML={{ __html: locale !== "ar" ? svgIcons.UAE : svgIcons.USA }}></span>

          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-full font-bold text-[14px] text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Sign In Button */}
          <button
            className="px-5 hidden lg:block py-2 rounded-full font-bold text-[14px] text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all"
          >
            <Link href={`/${locale}/authentication/sign-in`}>
              {locale === "ar" ? "دخول" : "Sign In"}
            </Link>
          </button>

          {/* Sign Up Button */}
          <div className="hidden lg:block">
            <Link
              href={`/${locale}/authentication/sign-up`}
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 text-white font-bold text-[14px] shadow-lg shadow-purple-200 dark:shadow-purple-900/50 transition-all hover:shadow-xl"
            >
              {locale === "ar" ? "ابدأ الآن" : "Start Now"}
            </Link>
          </div>
        </div>

        <button
          className="lg:hidden flex items-center justify-center text-slate-900 dark:text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 backdrop-blur-xl bg-white/90 dark:bg-[#0d1117]/90 shadow-2xl p-8 lg:hidden flex flex-col gap-3 text-center border-t border-purple-50 dark:border-purple-900"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.sectionId);
              }}
              className="py-4 text-lg font-bold text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-center gap-4 cursor-pointer"
            >
              <link.icon size={22} className="text-purple-500" />
              {link.name}
            </a>
          ))}



          <div className="pt-4 flex flex-col gap-3">
            <Link
              href={`/${locale}/authentication/sign-in`}
              className="block w-full py-3 rounded-2xl border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 font-bold text-base hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all"
            >
              {locale === "ar" ? "دخول" : "Sign In"}
            </Link>
            <Link
              href={`/${locale}/authentication/sign-up`}
              className="block w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 text-white font-bold text-base"
            >
              {locale === "ar" ? "ابدأ الآن" : "Start Now"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
