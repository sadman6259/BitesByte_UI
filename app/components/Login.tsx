"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { X, Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import bcrypt from "bcryptjs";

function Login({
  onClose,
  onLoginSuccess,
}: {
  onClose: () => void;
  onLoginSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const userResponse = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BITESBYTE_API_URL
      }/getuserbyemail?email=${encodeURIComponent(email)}`
    );
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Send plain password to server - ensure you're using HTTPS!
      const hashedPassword = await bcrypt.hash(
        password,
        userResponse.data.password
      );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BITESBYTE_API_URL}/loginUser`,
        {
          email,
          password: hashedPassword, // sending plain password
        }
      );

      const data = response.data;

      if (data === false) {
        setError("Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
      document.cookie = `token=${data.token}; path=/; samesite=lax`;

      onLoginSuccess();
      setEmail("");
      setPassword("");
      onClose();
    } catch (err: unknown) {
      let errorMessage = "Registration failed. Please try again.";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 overflow-y-auto py-4">
      <div className="bg-customBeige rounded-lg shadow-lg w-full max-w-md relative mx-4 my-8 border border-customGray/20">
        <button
          className="absolute top-4 right-4 text-customGray hover:text-customOrange transition-colors p-1"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/img/logo.png"
                alt="logo"
                width={70}
                height={70}
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-customOrange font-custom tracking-custom">
              WELCOME BACK
            </h1>
            <p className="text-customGray mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-200">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-customGreen mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-customGray" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-2 border text-customGray border-customOrange rounded focus:ring-1 focus:ring-customGreen focus:border-customGreen outline-none bg-white"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-customGreen mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-customGray" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full text-customGray pl-10 pr-10 py-2 border border-customOrange rounded focus:ring-1 focus:ring-customGreen focus:border-customGreen outline-none bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-customGray hover:text-customOrange"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <button className="text-sm text-customOrange hover:text-customGreen">
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded font-medium transition-colors ${
                isLoading
                  ? "bg-customOrange/70 cursor-not-allowed"
                  : "bg-customOrange hover:bg-orange-600 text-white"
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>LOGIN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
