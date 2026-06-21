import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const FEATURES = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $25" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "100% protected payments" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated book experts" },
];

export default function PromoBanner() {
  return (
    <section className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-800 via-amber-900 to-amber-950 py-8 border-t border-amber-700/50 shadow-inner relative overflow-hidden">
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full duration-1000 transition-transform"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-4 text-white/95 group cursor-pointer transition-all duration-300 hover:-translate-y-1">
              <div className="bg-white/10 rounded-xl p-3 flex-shrink-0 shadow-[0_0_15px_rgba(253,230,140,0.1)] group-hover:bg-white/20 group-hover:shadow-[0_0_20px_rgba(253,230,140,0.25)] transition-all duration-300">
                <f.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-200 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-semibold text-sm md:text-base text-amber-50 group-hover:text-white transition-colors">{f.title}</h4>
                <p className="text-amber-200/60 text-xs md:text-sm group-hover:text-amber-200/80 transition-colors">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
