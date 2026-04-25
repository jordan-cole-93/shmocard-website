// Social icons (Twitter, Instagram, LinkedIn, YouTube) were removed from
// lucide-react v0.400+. Using Globe as a generic social placeholder until
// custom SVGs are added. Swap these out when brand-specific icons are needed.
import {
  ArrowRight,
  Check,
  ShoppingCart,
  Search,
  MousePointerClick,
  Globe,
  Menu,
  X,
} from "lucide-react";

export const Icon = {
  Arrow: ArrowRight,
  Check,
  Cart: ShoppingCart,
  Search,
  Tap: MousePointerClick,
  Twitter: Globe,
  Instagram: Globe,
  LinkedIn: Globe,
  YouTube: Globe,
  Menu,
  Close: X,
};

export type IconName = keyof typeof Icon;
