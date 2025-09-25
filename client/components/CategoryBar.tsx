import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  ShoppingCart,
  Building,
  Calendar,
  Users,
  Settings,
  Store,
  MapPin,
  Bed,
} from "lucide-react";

interface CategoryButton {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
}

// const categoryButtons: CategoryButton[] = [
//   {
//     name: "Buy Property",
//     path: "/buy",
//     icon: Home,
//     description: "Find your dream home",
//   },
//   {
//     name: "For Sale",
//     path: "/sale",
//     icon: Store,
//     description: "Sell your property",
//   },
//   {
//     name: "Rent Property",
//     path: "/rent",
//     icon: Building,
//     description: "Rent homes & offices",
//   },
//   {
//     name: "Lease Property",
//     path: "/lease",
//     icon: Calendar,
//     description: "Long-term leasing",
//   },
//   {
//     name: "PG & Hostels",
//     path: "/pg",
//     icon: Bed,
//     description: "Paying guest accommodations",
//   },
//   {
//     name: "Other Services",
//     path: "/other-services",
//     icon: Settings,
//     description: "Property related services",
//   },
// ];

export default function CategoryBar() {
  // Intentionally render nothing to remove the category bar from all pages
  return null;
}
