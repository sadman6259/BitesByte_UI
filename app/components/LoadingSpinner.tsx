// components/LoadingSpinner.tsx
"use client";
import Image from "next/image";

interface LoadingSpinnerProps {
  isLoading: boolean;
}

export const LoadingSpinner = ({ isLoading }: LoadingSpinnerProps) => {
  console.log("LoadingSpinner render, isLoading:", isLoading); // Debug log

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse scale-110 animate-scale">
          <Image
            src="/img/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};
