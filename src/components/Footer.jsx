import {
  Home,
  ShieldCheck,
  MapPin,
  Search,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Top Footer Section */}
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                <Search size={26} />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Tafuta
              </h2>
            </div>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
              Helping users discover suitable housing options based on their
              preferences, location needs, and budget. Tafuta makes the search
              process simpler, clearer, and more reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-white">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4 text-slate-300">
              <li>
                <a href="/" className="transition hover:text-blue-400">
                  Home
                </a>
              </li>
              <li>
                <a href="/search" className="transition hover:text-blue-400">
                  Search Housing
                </a>
              </li>
              <li>
                <a href="/preferences" className="transition hover:text-blue-400">
                  Preferences
                </a>
              </li>
              <li>
                <a href="/dashboard" className="transition hover:text-blue-400">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-semibold text-white">
              Support
            </h3>

            <ul className="mt-6 space-y-4 text-slate-300">
              <li>
                <a href="/help" className="transition hover:text-blue-400">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="transition hover:text-blue-400">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/safety" className="transition hover:text-blue-400">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="/about" className="transition hover:text-blue-400">
                  About Tafuta
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-slate-800 pt-10">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
                <Home size={24} />
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  Housing Discovery
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Find housing options that match your needs.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
                <MapPin size={24} />
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  Location-Based Search
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Explore options based on preferred areas.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  Reliable Platform
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Designed to make housing search simpler and safer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 border-t border-slate-800 pt-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">
              © {currentYear} Tafuta. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
              <a href="/terms" className="transition hover:text-blue-400">
                Terms of Service
              </a>
              <a href="/privacy" className="transition hover:text-blue-400">
                Privacy Policy
              </a>
              <a href="/cookies" className="transition hover:text-blue-400">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}