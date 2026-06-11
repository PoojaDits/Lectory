const API_BASE = "http://localhost:3001";

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  coverColor: string;
  accentColor: string;
  badge?: string;
}

export interface Genre {
  name: string;
  icon: string;
  color: string;
}

export async function fetchSlides() {
  const res = await fetch(`${API_BASE}/slides`);
  if (!res.ok) throw new Error("Failed to fetch slides");
  return res.json();
}

export async function fetchFeaturedBooks(): Promise<Book[]> {
  const res = await fetch(`${API_BASE}/featuredBooks`);
  if (!res.ok) throw new Error("Failed to fetch featured books");
  return res.json();
}

export async function fetchPreOrderBooks(): Promise<Book[]> {
  const res = await fetch(`${API_BASE}/preOrderBooks`);
  if (!res.ok) throw new Error("Failed to fetch pre-order books");
  return res.json();
}

export async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch(`${API_BASE}/genres`);
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}

export async function addToCart(
  book: Pick<Book, "id" | "title" | "author" | "price">
) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...book, quantity: 1 }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${API_BASE}/cart`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}
