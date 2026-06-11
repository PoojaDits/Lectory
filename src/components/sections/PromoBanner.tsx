import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const FEATURES = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $25" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "100% protected payments" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated book experts" },
];

export default function PromoBanner() {
  return (
    <section className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3 md:gap-4">
              <div className="bg-white/15 rounded-xl p-2.5 md:p-3 flex-shrink-0">
                <f.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-200" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm md:text-base">{f.title}</h4>
                <p className="text-amber-200/70 text-xs md:text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
