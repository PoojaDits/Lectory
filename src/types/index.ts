// ── Hero Slide ──
export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  accent: string;
}

// ── Book ──
export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  image?: string;
  coverColor?: string;
  accentColor?: string;
  badge?: string;
  badgeColor?: string;
}

// ── Category ──
export interface Category {
  id: number;
  name: string;
  count: string;
  icon: string;
  gradient: string;
  shadow: string;
  bg: string;
}

// ── New Arrival ──
export interface NewArrival {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
}

// ── Testimonial ──
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

// ── Registration ──
export type SellerStatus = "Pending Approval" | "Approved" | "Rejected";

export type EntityId = number | string;

export interface Customer {
  id?: EntityId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "customer";
  createdAt: string;
}

export interface Seller {
  id?: EntityId;
  businessName: string;
  contactPerson: string;
  email: string;
  mobileNumber: string;
  status: SellerStatus;
  role: "seller";
  createdAt: string;
  reviewedAt?: string;
}

export interface CustomerRegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SellerRegistrationInput {
  businessName: string;
  contactPerson: string;
  email: string;
  mobileNumber: string;
}

// ── Generic async state ──
export interface AsyncState {
  isLoading: boolean;
  error: string | null;
}
