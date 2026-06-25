import type {
  HeroSlide,
  Book,
  Category,
  NewArrival,
  Testimonial,
} from "@/types";

export const fallbackHeroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/13278839/pexels-photo-13278839.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    title: "Discover Your Next\\nGreat Adventure",
    subtitle: "Explore thousands of titles across every genre — from thrilling mysteries to heartfelt romances.",
    cta: "Browse Collection",
    accent: "from-primary-900/80 via-primary-900/50 to-transparent",
    ctaLink: "/browse",
    secondaryCta: "Best Sellers",
    secondaryLink: "/browse?category=bestseller",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/37247960/pexels-photo-37247960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    title: "Cozy Up With\\nCurated Reads",
    subtitle: "Handpicked recommendations from our curators. Find the stories that everyone is talking about.",
    cta: "Browse Collection",
    accent: "from-stone-900/80 via-stone-900/50 to-transparent",
    ctaLink: "/browse?category=recommended",
    secondaryCta: "Learn More",
    secondaryLink: "/browse",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/19015217/pexels-photo-19015217.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    title: "New Arrivals\\nEvery Week",
    subtitle: "Stay ahead of the curve with fresh releases and exclusive pre-orders delivered to your door.",
    cta: "Shop New Arrivals",
    accent: "from-secondary-900/80 via-secondary-900/50 to-transparent",
    ctaLink: "/browse?category=preorder",
    secondaryCta: "Browse All",
    secondaryLink: "/browse",
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/6103836/pexels-photo-6103836.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    title: "A World of\\nKnowledge Awaits",
    subtitle: "From academic texts to self-help guides — unlock your potential with our non-fiction collection.",
    cta: "Explore AI Books",
    accent: "from-emerald-900/80 via-emerald-900/50 to-transparent",
    ctaLink: "/browse?category=ai",
    secondaryCta: "Learn More",
    secondaryLink: "/browse?category=ai",
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/9553514/pexels-photo-9553514.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    title: "Gift the Joy\\nof Reading",
    subtitle: "Curated gift sets, beautiful editions, and personalized recommendations for every book lover.",
    cta: "Shop Gifts",
    accent: "from-rose-900/80 via-rose-900/50 to-transparent",
    ctaLink: "/browse?category=recommended",
    secondaryCta: "Browse Manga",
    secondaryLink: "/browse?category=manga",
  },
];

export const fallbackCategories: Category[] = [
  { id: 1, name: "Fiction", count: "2,340+", icon: "BookOpen", gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200", bg: "bg-blue-50" },
  { id: 2, name: "Romance", count: "1,820+", icon: "Heart", gradient: "from-rose-500 to-pink-600", shadow: "shadow-rose-200", bg: "bg-rose-50" },
  { id: 3, name: "Self-Help", count: "980+", icon: "Lightbulb", gradient: "from-amber-500 to-orange-600", shadow: "shadow-primary-200", bg: "bg-primary-50" },
  { id: 4, name: "Academic", count: "3,100+", icon: "GraduationCap", gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200", bg: "bg-emerald-50" },
  { id: 5, name: "Sci-Fi", count: "1,540+", icon: "Rocket", gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-200", bg: "bg-violet-50" },
  { id: 6, name: "Art & Design", count: "760+", icon: "Palette", gradient: "from-cyan-500 to-sky-600", shadow: "shadow-cyan-200", bg: "bg-cyan-50" },
];

export const fallbackNewArrivals: NewArrival[] = [
  { id: 1, title: "Cherry Blossom Dreams", author: "Sabahattin Ali", price: 13.99, image: "https://images.pexels.com/photos/20409066/pexels-photo-20409066.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 2, title: "Parisian Tales", author: "Claude Laurent", price: 18.49, image: "https://images.pexels.com/photos/37917407/pexels-photo-37917407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 3, title: "The Green Collection", author: "Andy Lee", price: 22.99, image: "https://images.pexels.com/photos/12391379/pexels-photo-12391379.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 4, title: "Sakura Memoirs", author: "Rahime Gül", price: 15.99, image: "https://images.pexels.com/photos/20409059/pexels-photo-20409059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 5, title: "The Last Letter", author: "Rebecca Yarros", price: 16.99, image: "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 6, title: "The Women", author: "Kristin Hannah", price: 17.49, image: "https://images.pexels.com/photos/29458840/pexels-photo-29458840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 7, title: "Funny Story", author: "Emily Henry", price: 14.99, image: "https://images.pexels.com/photos/3756476/pexels-photo-3756476.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 8, title: "The Frozen River", author: "Ariel Lawhon", price: 15.49, image: "https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
];

export const fallbackPreOrderBooks: Book[] = [
  { id: 101, title: "Metro 2035", author: "Dmitry Glukhovsky", price: 559, originalPrice: 699, image: "https://images.pexels.com/photos/302640/pexels-photo-302640.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Pre-Order", badgeColor: "bg-cyan-100 text-cyan-800" },
  { id: 102, title: "The Housemaid's Wedding", author: "Freida McFadden", price: 239, originalPrice: 299, image: "https://images.pexels.com/photos/5904932/pexels-photo-5904932.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Pre-Order", badgeColor: "bg-rose-100 text-rose-800" },
  { id: 103, title: "A Deal With The Elf King", author: "Elise Kova", price: 720, originalPrice: 899, image: "https://images.pexels.com/photos/3747416/pexels-photo-3747416.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Pre-Order", badgeColor: "bg-emerald-100 text-emerald-800" },
  { id: 104, title: "Kid Detectives: Skyscraper", author: "Adam Bushnell", price: 399, originalPrice: 599, image: "https://images.pexels.com/photos/159711/book-pages-open-pages-159711.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Pre-Order", badgeColor: "bg-primary-100 text-primary-800" },
  { id: 105, title: "The Women", author: "Kristin Hannah", price: 449, originalPrice: 599, image: "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Pre-Order", badgeColor: "bg-pink-100 text-pink-800" },
  { id: 106, title: "The Frozen River", author: "Ariel Lawhon", price: 399, originalPrice: 549, image: "https://images.pexels.com/photos/29458840/pexels-photo-29458840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Pre-Order", badgeColor: "bg-blue-100 text-blue-800" },
  { id: 107, title: "The Hunter", author: "Tana French", price: 519, originalPrice: 699, image: "https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Pre-Order", badgeColor: "bg-teal-100 text-teal-800" },
  { id: 108, title: "The Ministry of Time", author: "Kaliane Bradley", price: 379, originalPrice: 499, image: "https://images.pexels.com/photos/3756476/pexels-photo-3756476.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Pre-Order", badgeColor: "bg-violet-100 text-violet-800" },
];

export const fallbackBestSellers: Book[] = [
  { id: 201, title: "The Midnight Library", author: "Matt Haig", price: 399, originalPrice: 599, image: "https://images.pexels.com/photos/29458840/pexels-photo-29458840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Best Seller", badgeColor: "bg-primary-100 text-primary-800" },
  { id: 202, title: "Atomic Habits", author: "James Clear", price: 479, originalPrice: 799, image: "https://images.pexels.com/photos/33324725/pexels-photo-33324725.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Best Seller", badgeColor: "bg-red-100 text-red-800" },
  { id: 203, title: "Sapiens", author: "Yuval Noah Harari", price: 499, originalPrice: 799, image: "https://images.pexels.com/photos/1005324/pexels-photo-1005324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Best Seller", badgeColor: "bg-indigo-100 text-indigo-800" },
  { id: 204, title: "Where the Crawdads Sing", author: "Delia Owens", price: 359, originalPrice: 559, image: "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Best Seller", badgeColor: "bg-emerald-100 text-emerald-800" },
  { id: 205, title: "The Silent Patient", author: "Alex Michaelides", price: 299, originalPrice: 449, image: "https://images.pexels.com/photos/159711/book-pages-open-pages-159711.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Best Seller", badgeColor: "bg-secondary-100 text-secondary-800" },
  { id: 206, title: "Daisy Jones & The Six", author: "Taylor Jenkins Reid", price: 319, originalPrice: 499, image: "https://images.pexels.com/photos/3756476/pexels-photo-3756476.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Popular", badgeColor: "bg-purple-100 text-purple-800" },
  { id: 207, title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", price: 329, originalPrice: 499, image: "https://images.pexels.com/photos/5904932/pexels-photo-5904932.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Best Seller", badgeColor: "bg-pink-100 text-pink-800" },
  { id: 208, title: "Project Hail Mary", author: "Andy Weir", price: 429, originalPrice: 699, image: "https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Best Seller", badgeColor: "bg-teal-100 text-teal-800" },
  { id: 209, title: "Klara and the Sun", author: "Kazuo Ishiguro", price: 399, originalPrice: 549, image: "https://images.pexels.com/photos/3756476/pexels-photo-3756476.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Popular", badgeColor: "bg-violet-100 text-violet-800" },
  { id: 210, title: "Educated", author: "Tara Westover", price: 379, originalPrice: 599, image: "https://images.pexels.com/photos/1005324/pexels-photo-1005324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Best Seller", badgeColor: "bg-primary-100 text-primary-800" },
];

export const fallbackRecommendedBooks: Book[] = [
  { id: 301, title: "A Little Life", author: "Hanya Yanagihara", price: 349, originalPrice: 499, image: "https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Recommended", badgeColor: "bg-violet-100 text-violet-800", rating: 4.9 },
  { id: 302, title: "Project Hail Mary", author: "Andy Weir", price: 429, originalPrice: 699, image: "https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Recommended", badgeColor: "bg-teal-100 text-teal-800", rating: 4.7 },
  { id: 303, title: "The Alchemist", author: "Paulo Coelho", price: 249, originalPrice: 399, image: "https://images.pexels.com/photos/897633/pexels-photo-897633.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Recommended", badgeColor: "bg-primary-100 text-primary-800", rating: 4.8 },
  { id: 304, title: "Klara and the Sun", author: "Kazuo Ishiguro", price: 399, originalPrice: 549, image: "https://images.pexels.com/photos/3756476/pexels-photo-3756476.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Recommended", badgeColor: "bg-rose-100 text-rose-800", rating: 4.6 },
  { id: 305, title: "The Silent Patient", author: "Alex Michaelides", price: 299, originalPrice: 449, image: "https://images.pexels.com/photos/159711/book-pages-open-pages-159711.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Recommended", badgeColor: "bg-secondary-100 text-secondary-800", rating: 4.5 },
  { id: 306, title: "Daisy Jones & The Six", author: "Taylor Jenkins Reid", price: 319, originalPrice: 499, image: "https://images.pexels.com/photos/3756476/pexels-photo-3756476.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Staff Pick", badgeColor: "bg-purple-100 text-purple-800", rating: 4.8 },
  { id: 307, title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", price: 329, originalPrice: 499, image: "https://images.pexels.com/photos/5904932/pexels-photo-5904932.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Recommended", badgeColor: "bg-pink-100 text-pink-800", rating: 4.9 },
  { id: 308, title: "Where the Crawdads Sing", author: "Delia Owens", price: 359, originalPrice: 559, image: "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Reader Favorite", badgeColor: "bg-emerald-100 text-emerald-800", rating: 4.7 },
  { id: 309, title: "Sapiens", author: "Yuval Noah Harari", price: 499, originalPrice: 799, image: "https://images.pexels.com/photos/1005324/pexels-photo-1005324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Recommended", badgeColor: "bg-indigo-100 text-indigo-800", rating: 4.6 },
];

export const fallbackMangaBooks: Book[] = [
  { id: 401, title: "One Piece Vol. 101", author: "Eiichiro Oda", price: 299, originalPrice: 399, image: "https://images.pexels.com/photos/5904932/pexels-photo-5904932.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-blue-100 text-blue-800" },
  { id: 402, title: "Naruto Vol. 72", author: "Masashi Kishimoto", price: 279, originalPrice: 379, image: "https://images.pexels.com/photos/270410/pexels-photo-270410.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-orange-100 text-orange-800" },
  { id: 403, title: "Demon Slayer Vol. 23", author: "Koyoharu Gotouge", price: 319, originalPrice: 419, image: "https://images.pexels.com/photos/159711/book-pages-open-pages-159711.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-rose-100 text-rose-800" },
  { id: 404, title: "Attack on Titan Vol. 34", author: "Hajime Isayama", price: 329, originalPrice: 449, image: "https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-gray-100 text-gray-800" },
  { id: 405, title: "Jujutsu Kaisen Vol. 18", author: "Gege Akutami", price: 289, originalPrice: 399, image: "https://images.pexels.com/photos/270410/pexels-photo-270410.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-red-100 text-red-800" },
  { id: 406, title: "My Hero Academia Vol. 35", author: "Kohei Horikoshi", price: 279, originalPrice: 379, image: "https://images.pexels.com/photos/5904932/pexels-photo-5904932.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-emerald-100 text-emerald-800" },
  { id: 407, title: "Chainsaw Man Vol. 12", author: "Tatsuki Fujimoto", price: 299, originalPrice: 399, image: "https://images.pexels.com/photos/159711/book-pages-open-pages-159711.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-orange-100 text-orange-800" },
  { id: 408, title: "Spy x Family Vol. 10", author: "Tatsuya Endo", price: 269, originalPrice: 349, image: "https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-pink-100 text-pink-800" },
  { id: 409, title: "Solo Leveling Vol. 8", author: "Chugong", price: 319, originalPrice: 429, image: "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-violet-100 text-violet-800" },
  { id: 410, title: "Blue Lock Vol. 15", author: "Muneyuki Kaneshiro", price: 289, originalPrice: 379, image: "https://images.pexels.com/photos/29458840/pexels-photo-29458840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Manga", badgeColor: "bg-cyan-100 text-cyan-800" },
];

export const fallbackAiBooks: Book[] = [
  { id: 501, title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", price: 899, originalPrice: 1099, image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "AI", badgeColor: "bg-secondary-100 text-secondary-800", rating: 4.9 },
  { id: 502, title: "Deep Learning", author: "Ian Goodfellow", price: 799, originalPrice: 999, image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "AI", badgeColor: "bg-cyan-100 text-cyan-800", rating: 4.8 },
  { id: 503, title: "Machine Learning Yearning", author: "Andrew Ng", price: 499, originalPrice: 599, image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "AI", badgeColor: "bg-green-100 text-green-800", rating: 4.7 },
  { id: 504, title: "AI Superpowers", author: "Kai-Fu Lee", price: 549, originalPrice: 699, image: "https://images.pexels.com/photos/3861963/pexels-photo-3861963.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "AI", badgeColor: "bg-indigo-100 text-indigo-800", rating: 4.5 },
  { id: 505, title: "The Alignment Problem", author: "Brian Christian", price: 649, originalPrice: 899, image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "AI", badgeColor: "bg-primary-100 text-primary-800", rating: 4.6 },
  { id: 506, title: "Human Compatible", author: "Stuart Russell", price: 729, originalPrice: 999, image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "AI", badgeColor: "bg-teal-100 text-teal-800", rating: 4.8 },
  { id: 507, title: "Life 3.0", author: "Max Tegmark", price: 499, originalPrice: 699, image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "AI", badgeColor: "bg-violet-100 text-violet-800", rating: 4.4 },
  { id: 508, title: "The Coming Wave", author: "Mustafa Suleyman", price: 599, originalPrice: 799, image: "https://images.pexels.com/photos/3861963/pexels-photo-3861963.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "AI", badgeColor: "bg-red-100 text-red-800", rating: 4.7 },
  { id: 509, title: "Co-Intelligence", author: "Ethan Mollick", price: 449, originalPrice: 599, image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "AI", badgeColor: "bg-emerald-100 text-emerald-800", rating: 4.5 },
];

export const fallbackTestimonials: Testimonial[] = [
  { id: 1, name: "Sarah Johnson", role: "Avid Reader", avatar: "👩‍💼", rating: 5, text: "My Book Store has completely transformed my reading experience. The curated recommendations are always spot-on, and their delivery is lightning fast!" },
  { id: 2, name: "Michael Chen", role: "Book Club Leader", avatar: "👨‍🏫", rating: 5, text: "I've been ordering books for our club for years. The selection is unmatched, and their customer service is exceptional. Truly a book lover's paradise." },
  { id: 3, name: "Emma Williams", role: "Literature Student", avatar: "👩‍🎓", rating: 5, text: "As a student, I appreciate the academic section and the student discounts. Found rare editions I couldn't find anywhere else. Highly recommended!" },
];
