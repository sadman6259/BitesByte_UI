"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { cartAtom } from "../store/menuQuantityStore";
import Link from "next/link";
import ChooseMenuModal from "./ChooseMenuModal";
import { useRouter } from "next/navigation";
import Login from "./Login";
import {
  Menu,
  X,
  ShoppingCart,
  ChevronRight,
  Info,
  Camera,
  FileText,
  Phone,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChooseMenuModalOpen, setIsChooseMenuModalOpen] = useState(false);
  //const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [cart] = useAtom(cartAtom);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

  // Update total items in cart whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalCartItems(total);
  }, [cart]);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const syncLogout = () => {
      setIsLoggedIn(false);
    };

    window.addEventListener("logout", syncLogout);
    return () => window.removeEventListener("logout", syncLogout);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");

    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // setShowUserDropdown(false);
    window.location.href = "/";
  };

  // const userDropdownLinks = [
  //   { href: "/portfolio", label: "My Profile" },
  //   { href: "/portfolio/money", label: "My Money" },
  //   { href: "/portfolio/address", label: "My Address" },
  //   { href: "/portfolio/safety", label: "My Safety" },
  //   { href: "/portfolio/bio", label: "Bio Data" },
  //   { href: "/portfolio/food", label: "Food" },
  // ];
  const sidebarLinks = [
    { href: "/lernMore", icon: Info, label: "Learn More" },
    { href: "/media", icon: Camera, label: "Media" },
    { href: "/termsPage", icon: FileText, label: "Terms" },
    { href: "/contact", icon: Phone, label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`flex  items-center px-8 py-6 bg-customBeige
        ${!isLoggedIn ? "justify-between" : "justify-end"}
      `}
      >
        {!isLoggedIn && (
          <Link href="/" className="text-2xl font-bold text-green-600">
            <Image src="/img/logo.png" alt="logo" width={70} height={70} />
          </Link>
        )}

        <div className="flex items-center relative">
          {/* Cart icon with item count */}

          {!isLoggedIn && totalCartItems > 0 && (
            <a
              href="/cart"
              className="pe-8 relative hover:underline cursor-pointer"
              onClick={(e) => {
                if (totalCartItems === 0) {
                  e.preventDefault(); // Prevent navigation if cart is empty
                  setShowEmptyCartModal(true);
                }
                // If cart has items, default anchor behavior will proceed to /cart
              }}
            >
              <ShoppingCart className="w-6 h-6 text-customGreen" />
              <span className="text-white text-xs absolute -top-2 left-[10px] bg-customOrange w-5 h-5 flex items-center justify-center rounded-full">
                {totalCartItems}
              </span>
            </a>
          )}
          {/* Guest access */}
          {!isLoggedIn && (
            <span
              className="text-customOrange pe-8 hover:underline cursor-pointer"
              onClick={() => setIsChooseMenuModalOpen(true)}
            >
              Guest
            </span>
          )}

          {/* Login or User dropdown */}
          {!isLoggedIn ? (
            <span
              onClick={() => setIsLoginModalOpen(true)}
              className="text-customOrange pe-8 hover:underline cursor-pointer"
            >
              Login
            </span>
          ) : (
            <div className="relative"></div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-customGreen p-2"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Enhanced Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <Link href="/" onClick={() => setIsSidebarOpen(false)}>
              <Image
                src="/img/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Navigation Links */}
            <ul className="space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-customBeige/50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <link.icon className="w-5 h-5 text-customOrange mr-3" />
                      <span className="font-medium text-gray-700 group-hover:text-customOrange transition-colors">
                        {link.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-customOrange transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="font-medium">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="w-full p-3 rounded-lg bg-customGreen text-white hover:bg-green-700 transition-colors font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Overlay */}
      {isSidebarOpen && (
        <div
          className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Empty Cart Modal */}
      {showEmptyCartModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-customOrange mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-700 mb-6">
              Please add items to your cart before proceeding to checkout.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEmptyCartModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowEmptyCartModal(false);
                  router.push("/");
                }}
                className="px-4 py-2 bg-customOrange text-white rounded-lg hover:bg-orange-600"
              >
                Home page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <Login
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setIsLoginModalOpen(false);
            router.push("/portfolio/menu");
          }}
        />
      )}

      {/* Choose Menu Modal */}
      {isChooseMenuModalOpen && (
        <ChooseMenuModal onClose={() => setIsChooseMenuModalOpen(false)} />
      )}

      {/* Spacer to prevent content from being hidden under fixed navbar */}
    </>
  );
}
