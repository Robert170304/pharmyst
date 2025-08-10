import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Shield,
  Search,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Smartphone,
  Star,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const testimonials: Array<{
    name: string;
    location: string;
    text: string;
    avatar: string;
    rating: number;
  }> = [
    {
      name: "Aarav",
      location: "Bengaluru",
      text: "Found my dad's medicine in minutes. The availability info was spot on.",
      avatar: "/placeholder-user.jpg",
      rating: 5,
    },
    {
      name: "Neha",
      location: "Pune",
      text: "Helps me compare stock and choose the closest pharmacy. Huge time-saver.",
      avatar: "/placeholder-user.jpg",
      rating: 4,
    },
    {
      name: "Rahul",
      location: "MedicoPlus",
      text: "As a pharmacist, listing on Pharmyst brought us many new customers.",
      avatar: "/placeholder-user.jpg",
      rating: 5,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Medicines
            <span className="text-blue-600"> Nearby</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Locate pharmacies that stock your required medicines with real-time
            availability information. Never run out of essential medications
            again.
          </p>
          <Link prefetch={true} href="/search">
            <Button size="lg" className="text-lg px-8 py-3">
              <Search className="mr-2 h-5 w-5" />
              Search Medicine
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Pharmyst?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Find Medicines Nearby</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Locate pharmacies in your area that have your required
                  medicines in stock
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Real-Time Stock Info</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get up-to-date information about medicine availability and
                  quantities
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Verified Pharmacies</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All listed pharmacies are verified and licensed for your
                  safety
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Three simple steps to locate and obtain your medicines quickly.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                    1
                  </span>
                  <CardTitle className="flex items-center gap-2">
                    Search medicine <Search className="h-5 w-5 text-blue-600" />
                  </CardTitle>
                </div>
                <CardDescription>
                  Enter the medicine name and optionally your location or allow
                  location access.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white font-semibold">
                    2
                  </span>
                  <CardTitle className="flex items-center gap-2">
                    Compare options{" "}
                    <Building2 className="h-5 w-5 text-green-600" />
                  </CardTitle>
                </div>
                <CardDescription>
                  View nearby pharmacies with availability, quantity and price
                  information.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white font-semibold">
                    3
                  </span>
                  <CardTitle className="flex items-center gap-2">
                    Visit or call{" "}
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </CardTitle>
                </div>
                <CardDescription>
                  Contact the pharmacy or navigate to the store to pick up your
                  medicine.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-gray-900">1k+</p>
              <p className="text-gray-600">Verified pharmacies</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-gray-900">25k+</p>
              <p className="text-gray-600">Medicines tracked</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-gray-900">150+</p>
              <p className="text-gray-600">Neighborhoods covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What users say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < t.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={t.avatar}
                      alt={`${t.name} avatar`}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{t.name}</div>
                      <div className="text-gray-500">{t.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="group rounded-lg border border-gray-200 p-5 open:bg-gray-50">
              <summary className="flex cursor-pointer list-none items-center justify-between text-left font-medium">
                How accurate is the stock information?
                <HelpCircle className="h-5 w-5 text-gray-500" />
              </summary>
              <p className="mt-3 text-gray-600">
                Pharmacies update their inventory via the dashboard. We surface
                the latest submitted quantities, and encourage users to call the
                store before traveling for critical medicines.
              </p>
            </details>
            <details className="group rounded-lg border border-gray-200 p-5 open:bg-gray-50">
              <summary className="flex cursor-pointer list-none items-center justify-between text-left font-medium">
                Do I need to create an account to search?
                <HelpCircle className="h-5 w-5 text-gray-500" />
              </summary>
              <p className="mt-3 text-gray-600">
                No. Searching is free for everyone. Accounts are only required
                for pharmacies that want to manage stock.
              </p>
            </details>
            <details className="group rounded-lg border border-gray-200 p-5 open:bg-gray-50">
              <summary className="flex cursor-pointer list-none items-center justify-between text-left font-medium">
                How do pharmacies get verified?
                <HelpCircle className="h-5 w-5 text-gray-500" />
              </summary>
              <p className="mt-3 text-gray-600">
                We verify license documents and contact details provided during
                registration. Only verified pharmacies are listed publicly.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-white">
                Ready to find your medicine?
              </h3>
              <p className="text-blue-100 mt-1">
                Search nearby pharmacies with real-time availability.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link prefetch={true} href="/search">
                <Button size="lg" variant="secondary" className="gap-2">
                  Search now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link prefetch={true} href="/auth/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  List your pharmacy
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Free to use
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Community verified
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Privacy-first
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
