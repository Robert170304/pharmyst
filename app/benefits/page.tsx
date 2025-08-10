import { CheckCircle2, Shield, Clock, MapPin } from "lucide-react";

export default function BenefitsPage() {
  const benefits = [
    {
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      title: "Reach nearby customers",
      desc: "Show up to users searching for medicines around your store.",
    },
    {
      icon: <Clock className="h-6 w-6 text-green-600" />,
      title: "Real-time inventory",
      desc: "Update stock easily and reduce phone queries about availability.",
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Verified listings",
      desc: "Stand out with a verified badge after document check.",
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />,
      title: "Simple setup",
      desc: "Create an account and list your inventory in minutes.",
    },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Benefits</h1>
        <p className="text-gray-600 mb-10 max-w-2xl">
          Pharmyst helps pharmacies connect with patients looking for specific
          medicines and saves time for both sides.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-gray-200 p-6 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-3 mb-3">
                {b.icon}
                <h3 className="font-semibold text-lg">{b.title}</h3>
              </div>
              <p className="text-gray-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
