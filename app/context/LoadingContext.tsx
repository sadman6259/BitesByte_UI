// context/LoadingContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type LoadingContextType = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  forceStopLoading: () => void; // Emergency stop
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Auto-stop after 8 seconds as fallback
  useEffect(() => {
    if (isLoading) {
      const id = setTimeout(() => {
        console.warn("Loading timeout - forcing stop");
        setIsLoading(false);
      }, 5000);
      setTimeoutId(id);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [isLoading]);

  const startLoading = () => {
    console.log("Starting loading...");
    // Clear any existing timeout
    if (timeoutId) clearTimeout(timeoutId);
    setIsLoading(true);
  };

  const stopLoading = () => {
    console.log("Stopping loading...");
    if (timeoutId) clearTimeout(timeoutId);
    setIsLoading(false);
  };

  const forceStopLoading = () => {
    console.warn("Force stopping loading...");
    if (timeoutId) clearTimeout(timeoutId);
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, startLoading, stopLoading, forceStopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
