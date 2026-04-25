import {
  ArrowRight,
  Check,
  ShoppingCart,
  Search,
  MousePointerClick,
  Menu,
  X,
} from "lucide-react";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

export const Icon = {
  Arrow: ArrowRight,
  Check,
  Cart: ShoppingCart,
  Search,
  Tap: MousePointerClick,
  Twitter: FaXTwitter,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
  YouTube: FaYoutube,
  Menu,
  Close: X,
};

export type IconName = keyof typeof Icon;
