import { BookOpen, Globe, Camera, MessageCircle, Play } from "lucide-react";

const LINK_GROUPS = [
  {
    title: "Shop",
    links: ["Fiction", "Non-Fiction", "Children's Books", "Textbooks", "E-Books"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Press", "Partners"],
  },
  {
    title: "Support",
    links: ["Help Center", "Order Tracking", "Returns", "Shipping Info", "Contact Us"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"],
  },
];

const SOCIAL_ICONS = [Globe, Camera, MessageCircle, Play];

export default function Footer() {
  return (
    <footer id="about" className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl p-2">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Lectory</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted destination for books of every genre. Serving readers
              worldwide since 2020.
            </p>
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-amber-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-amber-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 My Book Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>🔒 Secure Payments</span>
            <span>📦 Free Shipping $25+</span>
            <span>⭐ 4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
