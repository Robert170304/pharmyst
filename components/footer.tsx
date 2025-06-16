import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MediFinder</h3>
            <p className="text-gray-400">
              Find nearby pharmacies that stock your required medicines with real-time availability.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Users</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/search" className="hover:text-white">
                  Search Medicines
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Pharmacies</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/auth/register" className="hover:text-white">
                  Register Pharmacy
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white">
                  Pharmacy Login
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Benefits
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MediFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
