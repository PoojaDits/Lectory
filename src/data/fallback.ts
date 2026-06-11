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
    title: "Discover Your Next\nGreat Adventure",
    subtitle: "Explore thousands of titles across every genre — from thrilling mysteries to heartfelt romances.",
    cta: "Browse Collection",
    accent: "from-amber-900/80 via-amber-900/50 to-transparent",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/37247960/pexels-photo-37247960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    title: "Cozy Up With\nBestselling Books",
    subtitle: "Handpicked recommendations from our curators. Find the stories that everyone is talking about.",
    cta: "View Bestsellers",
    accent: "from-stone-900/80 via-stone-900/50 to-transparent",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/19015217/pexels-photo-19015217.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    title: "New Arrivals\nEvery Week",
    subtitle: "Stay ahead of the curve with fresh releases and exclusive pre-orders delivered to your door.",
    cta: "Shop New Arrivals",
    accent: "from-slate-900/80 via-slate-900/50 to-transparent",
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/6103836/pexels-photo-6103836.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    title: "A World of\nKnowledge Awaits",
    subtitle: "From academic texts to self-help guides — unlock your potential with our non-fiction collection.",
    cta: "Explore Non-Fiction",
    accent: "from-emerald-900/80 via-emerald-900/50 to-transparent",
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/9553514/pexels-photo-9553514.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    title: "Gift the Joy\nof Reading",
    subtitle: "Curated gift sets, beautiful editions, and personalized recommendations for every book lover.",
    cta: "Shop Gifts",
    accent: "from-rose-900/80 via-rose-900/50 to-transparent",
  },
];

export const fallbackBestsellers: Book[] = [
  { id: 1, title: "The Midnight Library", author: "Matt Haig", price: 14.99, oldPrice: 19.99, rating: 4.8, reviews: 2340, image: "https://images.pexels.com/photos/29458840/pexels-photo-29458840.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Bestseller", badgeColor: "bg-amber-500" },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 16.99, oldPrice: 24.99, rating: 4.9, reviews: 5120, image: "https://images.pexels.com/photos/33324725/pexels-photo-33324725.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "#1 Pick", badgeColor: "bg-red-500" },
  { id: 3, title: "Where the Wild Things Are", author: "Maurice Sendak", price: 12.49, oldPrice: 16.99, rating: 4.7, reviews: 1890, image: "https://images.pexels.com/photos/9325323/pexels-photo-9325323.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Classic", badgeColor: "bg-emerald-500" },
  { id: 4, title: "Journey to the Center", author: "Jules Verne", price: 11.99, oldPrice: 15.99, rating: 4.6, reviews: 980, image: "https://images.pexels.com/photos/14097126/pexels-photo-14097126.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "New", badgeColor: "bg-blue-500" },
  { id: 5, title: "The Bookshop Chronicles", author: "Rachel Claire", price: 13.49, oldPrice: 18.99, rating: 4.5, reviews: 1230, image: "https://images.pexels.com/photos/6146118/pexels-photo-6146118.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Staff Pick", badgeColor: "bg-purple-500" },
  { id: 6, title: "Shelves of Wonder", author: "Ian Panelo", price: 19.99, oldPrice: 27.99, rating: 4.8, reviews: 3450, image: "https://images.pexels.com/photos/7116591/pexels-photo-7116591.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Trending", badgeColor: "bg-orange-500" },
  { id: 7, title: "Bookstore Diaries", author: "Halil Ibrahim", price: 15.49, oldPrice: 21.99, rating: 4.7, reviews: 2100, image: "https://images.pexels.com/photos/18051055/pexels-photo-18051055.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Popular", badgeColor: "bg-teal-500" },
  { id: 8, title: "The Canakkale Collection", author: "Ersan Yilmaz", price: 17.99, oldPrice: 23.99, rating: 4.9, reviews: 4200, image: "https://images.pexels.com/photos/31396380/pexels-photo-31396380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Award", badgeColor: "bg-yellow-500" },
  { id: 9, title: "Library of Secrets", author: "Diana S.", price: 14.99, oldPrice: 20.99, rating: 4.6, reviews: 1780, image: "https://images.pexels.com/photos/5360440/pexels-photo-5360440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Hot", badgeColor: "bg-rose-500" },
  { id: 10, title: "Cozy Corner Reads", author: "Sideesh B.", price: 12.99, oldPrice: 17.99, rating: 4.4, reviews: 920, image: "https://images.pexels.com/photos/34014834/pexels-photo-34014834.png?auto=compress&cs=tinysrgb&fit=crop&h=500&w=340", badge: "Cozy", badgeColor: "bg-indigo-500" },
];

export const fallbackCategories: Category[] = [
  { id: 1, name: "Fiction", count: "2,340+", icon: "BookOpen", gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200", bg: "bg-blue-50" },
  { id: 2, name: "Romance", count: "1,820+", icon: "Heart", gradient: "from-rose-500 to-pink-600", shadow: "shadow-rose-200", bg: "bg-rose-50" },
  { id: 3, name: "Self-Help", count: "980+", icon: "Lightbulb", gradient: "from-amber-500 to-orange-600", shadow: "shadow-amber-200", bg: "bg-amber-50" },
  { id: 4, name: "Academic", count: "3,100+", icon: "GraduationCap", gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200", bg: "bg-emerald-50" },
  { id: 5, name: "Sci-Fi", count: "1,540+", icon: "Rocket", gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-200", bg: "bg-violet-50" },
  { id: 6, name: "Art & Design", count: "760+", icon: "Palette", gradient: "from-cyan-500 to-sky-600", shadow: "shadow-cyan-200", bg: "bg-cyan-50" },
];

export const fallbackNewArrivals: NewArrival[] = [
  { id: 1, title: "Cherry Blossom Dreams", author: "Sabahattin Ali", price: 13.99, image: "https://images.pexels.com/photos/20409066/pexels-photo-20409066.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 2, title: "Parisian Tales", author: "Claude Laurent", price: 18.49, image: "https://images.pexels.com/photos/37917407/pexels-photo-37917407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 3, title: "The Green Collection", author: "Andy Lee", price: 22.99, image: "https://images.pexels.com/photos/12391379/pexels-photo-12391379.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
  { id: 4, title: "Sakura Memoirs", author: "Rahime Gül", price: 15.99, image: "https://images.pexels.com/photos/20409059/pexels-photo-20409059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=280" },
];

export const fallbackTestimonials: Testimonial[] = [
  { id: 1, name: "Sarah Johnson", role: "Avid Reader", avatar: "👩‍💼", rating: 5, text: "My Book Store has completely transformed my reading experience. The curated recommendations are always spot-on, and their delivery is lightning fast!" },
  { id: 2, name: "Michael Chen", role: "Book Club Leader", avatar: "👨‍🏫", rating: 5, text: "I've been ordering books for our club for years. The selection is unmatched, and their customer service is exceptional. Truly a book lover's paradise." },
  { id: 3, name: "Emma Williams", role: "Literature Student", avatar: "👩‍🎓", rating: 5, text: "As a student, I appreciate the academic section and the student discounts. Found rare editions I couldn't find anywhere else. Highly recommended!" },
];
