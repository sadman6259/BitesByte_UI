"use client";
import React from "react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-customBeige p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-customGreen mb-2">
            Account Security
          </h1>
          <div className="w-24 h-1 bg-customGreen mx-auto"></div>
        </div>

        {/* Change Password */}
        <section className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-customGray mb-4 flex items-center gap-2">
            Change Password
          </h2>
          <form className="space-y-4 max-w-md">
            <div className="space-y-1">
              <label className="text-sm text-customOrange">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-customOrange">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-customOrange">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-customOrange focus:border-customOrange text-customGray"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-customGreen text-white rounded-lg hover:bg-green-600"
              >
                Update Password
              </button>
            </div>
          </form>
        </section>

        {/* 2 Step Verification */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-customGray mb-4 flex items-center gap-2">
            Two-Step Verification
          </h2>
          <p className="mb-4 text-customGray">
            Add an extra layer of security to your account by enabling two-step
            verification.
          </p>
          <button className="px-4 py-2 bg-customGreen text-white rounded-lg hover:bg-green-600">
            Enable 2-Step Verification
          </button>
        </section>
      </div>
    </div>
  );
}
