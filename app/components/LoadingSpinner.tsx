// components/LoadingSpinner.tsx
"use client";
import { useLoading } from "../context/LoadingContext";
import Image from "next/image"; // If using Next.js Image component

export const LoadingSpinner = () => {
  const { isLoading } = useLoading();

  console.log("LoadingSpinner render, isLoading:", isLoading); // Debug log

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Replace with your logo - example using Next.js Image */}
        <div className="animate-pulse scale-110 animate-scale">
          <Image
            src="/img/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
          {/* Or use a simple div if you don't have an image */}
          {/* <div className="w-20 h-20 bg-orange-500 rounded-lg animate-pulse"></div> */}
        </div>
      </div>
    </div>
  );
};
