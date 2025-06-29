"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

type LoadingContextType = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  forceStopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-stop after 5 seconds as fallback
  useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        console.warn("Loading timeout - forcing stop");
        setIsLoading(false);
      }, 5000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isLoading]);

  const clearCurrentTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startLoading = () => {
    console.log("Starting loading...");
    clearCurrentTimeout();
    setIsLoading(true);
  };

  const stopLoading = () => {
    console.log("Stopping loading...");
    clearCurrentTimeout();
    setIsLoading(false);
  };

  const forceStopLoading = () => {
    console.warn("Force stopping loading...");
    clearCurrentTimeout();
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
