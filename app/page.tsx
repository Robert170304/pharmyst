import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Shield, Search } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Medicines
            <span className="text-blue-600"> Nearby</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Locate pharmacies that stock your required medicines with real-time availability information. Never run out
            of essential medications again.
          </p>
          <Link href="/search">
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
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MediFinder?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Find Medicines Nearby</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Locate pharmacies in your area that have your required medicines in stock
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Real-Time Stock Info</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Get up-to-date information about medicine availability and quantities</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Verified Pharmacies</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>All listed pharmacies are verified and licensed for your safety</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
