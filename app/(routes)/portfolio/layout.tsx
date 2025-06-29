"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/store/menuQuantityStore";
import {
  LayoutDashboard,
  ListOrdered,
  Menu as MenuIcon,
  ShoppingCart,
  LogOut,
  ChevronDown,
  ChevronUp,
  User,
  User as ProfileIcon,
  Wallet as MoneyIcon,
  Home as AddressIcon,
  Shield as SafetyIcon,
  UserCircle as BioIcon,
  Utensils as FoodIcon,
} from "lucide-react";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [cart] = useAtom(cartAtom);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const userDropdownLinks = [
    {
      href: "/portfolio",
      label: "My Profile",
      icon: <ProfileIcon className="w-4 h-4" />,
    },
    {
      href: "/portfolio/money",
      label: "My Money",
      icon: <MoneyIcon className="w-4 h-4" />,
    },
    {
      href: "/portfolio/address",
      label: "My Address",
      icon: <AddressIcon className="w-4 h-4" />,
    },
    {
      href: "/portfolio/safety",
      label: "My Safety",
      icon: <SafetyIcon className="w-4 h-4" />,
    },
    {
      href: "/portfolio/bio",
      label: "Bio Data",
      icon: <BioIcon className="w-4 h-4" />,
    },
    {
      href: "/portfolio/food",
      label: "Food",
      icon: <FoodIcon className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalCartItems(total);
  }, [cart]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  const links = [
    {
      href: "/portfolio/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: "/portfolio/menu",
      label: "Menu",
      icon: <ListOrdered className="w-5 h-5" />,
    },
    {
      href: "/cart",
      label: <>{totalCartItems > 0 && "Cart"}</>,
      icon: (
        <>
          {totalCartItems > 0 && (
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />

              <span className="text-white text-xs absolute -top-2 -right-2 bg-customOrange w-5 h-5 flex items-center justify-center rounded-full">
                {totalCartItems}
              </span>
            </div>
          )}
        </>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
    window.location.href = "/";

    router.push("/");
  };

  return (
    <div className="flex h-screen bg-customBeige">
      {/* Sidebar - Fixed Position */}
      <aside
        className={`fixed top-0 h-full ${
          isSidebarOpen ? "w-50" : "w-20"
        } bg-white text-customGray transition-all duration-300 ease-in-out p-4 flex flex-col border-r border-customGray shadow-sm z-10`}
      >
        <div className="flex justify-between items-center mb-4">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/portfolio/menu">
              <Image
                src="/img/logo.png"
                alt="logo"
                width={isSidebarOpen ? 70 : 40}
                height={70}
                className="rounded-full transition-all duration-300"
              />
            </Link>
          </div>
          {/* Toggle */}
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* User Profile Accordion */}
        <div className="mb-4 overflow-hidden">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              showUserDropdown ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className=" p-2 rounded-full">
                <User className="w-5 h-5 " />
              </div>
              {isSidebarOpen && (
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm font-medium">My Account</span>
                  {showUserDropdown ? (
                    <ChevronUp className="w-4 h-4 transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 transition-transform" />
                  )}
                </div>
              )}
            </div>
          </button>

          {/* User Dropdown Menu */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              showUserDropdown && isSidebarOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-1">
              <ul className="space-y-1">
                {userDropdownLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                        pathname === link.href
                          ? "bg-orange-100 text-customOrange"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <span
                        className={` mr-2 ${
                          pathname === link.href
                            ? "text-customOrange"
                            : "text-gray-500"
                        }`}
                      >
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Links */}
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 text-sm font-medium px-3 py-3 rounded-lg transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-orange-100 text-customOrange"
                    : "text-customGray hover:bg-gray-100"
                }`}
              >
                <span
                  className={`${
                    pathname === link.href
                      ? "text-customOrange"
                      : "text-customGray"
                  }`}
                >
                  {link.icon}
                </span>
                {isSidebarOpen && (
                  <span className="transition-opacity duration-300 opacity-100">
                    {link.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-sm font-medium px-3 py-3 mt-4 rounded-lg transition-colors duration-300 ${
            isSidebarOpen
              ? "text-red-600 hover:bg-red-50"
              : "justify-center bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          <LogOut
            className={`w-5 h-5 ${
              isSidebarOpen ? "text-red-500" : "text-white"
            }`}
          />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Content - Adjusted for fixed sidebar */}
      <main
        className={`flex-1 ml-0 ${
          isSidebarOpen ? "md:ml-52" : "md:ml-20"
        } transition-all duration-300 p-6 bg-customBeige ${
          pathname === "/portfolio/menu" ? "overflow-y-auto" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
