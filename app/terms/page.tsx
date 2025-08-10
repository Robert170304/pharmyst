export default function TermsOfServicePage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Terms of Service
        </h1>
        <p className="text-gray-600 mb-6">
          By accessing or using Pharmyst you agree to the following terms. If
          you do not agree, please do not use the service.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Use of service</h2>
        <p className="text-gray-700">
          You may use the app only for lawful purposes. Pharmacies are
          responsible for the accuracy of stock information they publish.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">No medical advice</h2>
        <p className="text-gray-700">
          Pharmyst is an information service only and does not provide medical
          advice. Always consult a licensed medical professional when needed.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Liability</h2>
        <p className="text-gray-700">
          We strive for accuracy but do not guarantee availability or pricing.
          We are not liable for any damages arising from the use of the service.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Changes</h2>
        <p className="text-gray-700">
          We may update these terms from time to time. Continued use of the
          service means you accept the updated terms.
        </p>
        <p className="text-sm text-gray-500 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
}
