import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const FEATURES = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $25" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "100% protected payments" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated book experts" },
];

export default function PromoBanner() {
  return (
    <section className="bg-[#fcfaf8] py-16 relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[60%] rounded-full bg-primary-100/40 blur-[100px] mix-blend-multiply"></div>
        <div className="absolute top-[60%] -right-[10%] w-[30%] h-[50%] rounded-full bg-primary-200/30 blur-[100px] mix-blend-multiply"></div>
      </div>
      
      <div className="w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map((f, i) => (
            <div 
              key={i} 
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-5 group cursor-pointer transition-all duration-500 hover:-translate-y-2 p-6 lg:p-8 rounded-3xl bg-white border border-secondary-100/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-primary-900/5 hover:border-primary-200"
            >
              <div className="bg-primary-50 rounded-2xl p-4 flex-shrink-0 border border-primary-100/50 group-hover:bg-primary-600 group-hover:border-primary-600 transition-colors duration-500 relative overflow-hidden">
                <f.icon className="w-7 h-7 md:w-9 md:h-9 text-primary-600 group-hover:text-white transition-colors duration-500 relative z-10" />
              </div>
              <div className="flex-1 sm:pt-1">
                <h4 className="font-bold text-lg md:text-xl text-secondary-900 group-hover:text-primary-700 transition-colors duration-300 tracking-tight">{f.title}</h4>
                <p className="text-secondary-500 text-sm md:text-base mt-1.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
