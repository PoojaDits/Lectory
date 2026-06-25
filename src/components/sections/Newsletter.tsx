import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { notify } from "@/lib/toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      notify.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      notify.success(`Subscribed! Welcome, ${trimmed}`);
      setEmail("");
      setLoading(false);
    }, 400);
  };

  return (
    <section className="py-16 md:py-24 bg-white  md:px-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-amber-950 rounded-3xl p-8 md:p-16 overflow-hidden">
          {/* BG blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-primary-200 text-sm font-medium">
                Join 50,000+ Book Lovers
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Never Miss a Good Read
            </h2>
            <p className="text-primary-200/80 text-lg mb-8 max-w-lg mx-auto">
              Subscribe to our newsletter for personalized recommendations,
              exclusive deals, and early access to new arrivals.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-400/30 shadow-lg"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-primary-600/30 whitespace-nowrap disabled:opacity-60"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
            <p className="text-amber-300/50 text-xs mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
