"use client"

import policies, { siteMetadata } from "./PolicyConfig";

export default function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Website Terms and Policies</h1>
      <p className="text-sm text-gray-200 mb-8">
        Last Updated: {siteMetadata.lastUpdated}
      </p>

      {policies.map((policy) => (
        <section key={policy.id} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{policy.title}</h2>
          <ul className="space-y-3">
            {policy.subPolicies.map((subPolicy) => (
              <li key={subPolicy.id} className="text-gray-100">
                • {subPolicy.content}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
        <p className="text-gray-200 mb-8">
          By accessing and using this website, you acknowledge that you have read,
          understood, and agree to be bound by these policies. If you do not agree
          with any part of these terms, you must not use this website.
        </p>

        <h2 className="text-xl font-semibold mb-4">Contact</h2>
        <p className="text-gray-200">
          For any questions regarding these policies, please contact:{" "}
          <a
            href={`mailto:${siteMetadata.contactEmail}`}
            className="text-blue-600 hover:underline"
          >
            {siteMetadata.contactEmail}
          </a>
        </p>
      </footer>
    </div>
  );
}