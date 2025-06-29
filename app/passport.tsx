"use client";

import React, { createContext, useContext, useState } from "react";

interface PasswordContextType {
  plainPassword: string;
  setPlainPassword: (password: string) => void;
}

const PasswordContext = createContext<PasswordContextType>({
  plainPassword: "",
  setPlainPassword: () => {},
});

export const PasswordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [plainPassword, setPlainPassword] = useState("");

  return (
    <PasswordContext.Provider value={{ plainPassword, setPlainPassword }}>
      {children}
    </PasswordContext.Provider>
  );
};

export const usePassword = () => useContext(PasswordContext);
