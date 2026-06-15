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
export type BookStatus = "Pending Approval" | "Approved" | "Rejected";
export type OrderStatus =
  | "Created"
  | "Accepted"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type EntityId = number | string;

// ── Marketplace: Master Book record (unique ISBN, exists once) ──
export interface MarketBook {
  id: EntityId;
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  description?: string;
  coverImage?: string;
  status: BookStatus;
  createdBySellerId?: EntityId;
  createdAt: string;
  reviewedAt?: string;
}

export interface BookInput {
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  description?: string;
  coverImage?: string;
}

// ── Marketplace: Seller Listing (a seller's offer for a book) ──
export interface Listing {
  id: EntityId;
  bookId: EntityId;
  sellerId: EntityId;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Listing enriched with its parent book + seller for display
export interface ListingWithRefs extends Listing {
  book?: MarketBook;
  seller?: Seller;
}

export interface ListingInput {
  bookId: EntityId;
  sellerId: EntityId;
  price: number;
  stock: number;
}

// ── Cart ──
export interface Cart {
  id: EntityId;
  customerId: EntityId;
}

export interface CartItem {
  id: EntityId;
  cartId: EntityId;
  listingId: EntityId;
  bookId: EntityId;
  sellerId: EntityId;
  quantity: number;
  // snapshot of price at add-to-cart time
  price: number;
  createdAt: string;
}

// Cart item enriched for rendering
export interface CartItemWithRefs extends CartItem {
  book?: MarketBook;
  seller?: Seller;
  listing?: Listing;
}

// ── Orders ──
export interface Order {
  id: EntityId;
  customerId: EntityId;
  sellerId: EntityId;
  status: OrderStatus;
  shippingAddress: string;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: EntityId;
  orderId: EntityId;
  listingId: EntityId;
  bookId: EntityId;
  sellerId: EntityId;
  quantity: number;
  price: number;
  titleSnapshot: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  seller?: Seller;
  customer?: Customer;
}

// ── Admin dashboard summary ──
export interface DashboardSummary {
  totalSellers: number;
  totalCustomers: number;
  totalBooks: number;
  totalOrders: number;
  pendingSellers: number;
  pendingBooks: number;
}

// ── Generic paginated result ──
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Customer {
  id?: EntityId;
  firstName: string;
  lastName: string;
  email: string;
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

// ── Auth ──
export type UserRole = "customer" | "seller" | "admin";

export interface Admin {
  id?: EntityId;
  email: string;
  name?: string;
  role: "admin";
  createdAt?: string;
}

export interface AuthUser {
  id?: EntityId;
  email: string;
  role: UserRole;
  name?: string;
  // Seller-specific (present when role === "seller")
  businessName?: string;
  contactPerson?: string;
  mobileNumber?: string;
  status?: SellerStatus;
  createdAt?: string;
  reviewedAt?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ── Generic async state ──
export interface AsyncState {
  isLoading: boolean;
  error: string | null;
}
