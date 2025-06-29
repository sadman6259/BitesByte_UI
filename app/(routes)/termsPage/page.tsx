import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-customOrange">
        Terms & Conditions
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-customOrange">
          1. Introduction
        </h2>
        <p className="text-gray-700">
          Welcome to our website. By accessing or using our services, you agree
          to be bound by these Terms and Conditions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-customOrange">
          2. Intellectual Property
        </h2>
        <p className="text-gray-700">
          All content on this site, including text, graphics, logos, and images,
          is the property of the company and protected by copyright laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
        <p className="text-gray-700">
          Users agree not to misuse the services or access content in any
          unauthorized way. You must not use the website for unlawful purposes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-customOrange">
          4. Limitation of Liability
        </h2>
        <p className="text-gray-700">
          We are not liable for any damages arising from your use of the website
          or any services provided, including but not limited to indirect or
          consequential damages.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-customOrange">
          5. Changes to Terms
        </h2>
        <p className="text-gray-700">
          We reserve the right to update or change these terms at any time.
          Continued use of the service after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-customOrange">
          6. Contact Us
        </h2>
        <p className="text-gray-700">
          If you have any questions about these Terms, please contact us at{" "}
          <a
            href="mailto:support@example.com"
            className="text-blue-600 underline"
          >
            support@example.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
