export default function PrivacyPolicyPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">
          We respect your privacy. This policy explains what information we
          collect and how we use it. By using Pharmyst, you agree to this
          policy.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Information we collect
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Account details provided by pharmacies for verification.</li>
          <li>
            Search queries and location (when you grant permission) to show
            nearby results.
          </li>
          <li>Usage analytics to improve product performance.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">
          How we use information
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Provide search results and manage pharmacy listings.</li>
          <li>Detect abuse and maintain platform security.</li>
          <li>Improve features and user experience.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">
          Data retention & control
        </h2>
        <p className="text-gray-700">
          You can request deletion of your account data at any time. We retain
          some records as required by law or for fraud prevention.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
        <p className="text-gray-700">
          For privacy questions, contact us at support@pharmyst.example.
        </p>
        <p className="text-sm text-gray-500 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
}
