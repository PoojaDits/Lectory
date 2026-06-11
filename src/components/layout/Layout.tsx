import Navbar from "./Navbar"

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {/* Footer */}
      <footer className="bg-amber-950 text-amber-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-800 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">Lectory</span>
              </div>
              <p className="text-sm text-amber-200/70 leading-relaxed">
                Your destination for curated books across genres. Discover stories that inspire, educate, and entertain.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {["About Us", "Contact", "Shipping Policy", "Returns & Refunds"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-amber-200/70 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Categories
              </h4>
              <ul className="space-y-2">
                {["Fiction", "Non-Fiction", "Children's Books", "Academic", "Rare Collections"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-amber-200/70 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Stay in Touch
              </h4>
              <p className="text-sm text-amber-200/70 mb-3">
                Subscribe for updates on new arrivals, events, and exclusive offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm rounded-md bg-amber-900 text-white placeholder-amber-400/50 border border-amber-800 outline-none focus:border-amber-400"
                />
                <button className="px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white rounded-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-amber-800 mt-8 pt-6 text-center text-xs text-amber-300/50">
            &copy; {new Date().getFullYear()} Lectory. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}