import apiClient from "@/lib/axios";
import type {
  HeroSlide,
  Book,
  Category,
  NewArrival,
  Testimonial,
} from "@/types";

// ── Hero Slides ──
export const fetchHeroSlides = async (): Promise<HeroSlide[]> => {
  const { data } = await apiClient.get<HeroSlide[]>("/heroSlides");
  return data;
};

// ── Bestsellers ──
export const fetchBestsellers = async (): Promise<Book[]> => {
  const { data } = await apiClient.get<Book[]>("/bestsellers");
  return data;
};

// ── Categories ──
export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>("/categories");
  return data;
};

// ── New Arrivals ──
export const fetchNewArrivals = async (): Promise<NewArrival[]> => {
  const { data } = await apiClient.get<NewArrival[]>("/newArrivals");
  return data;
};

// ── Testimonials ──
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const { data } = await apiClient.get<Testimonial[]>("/testimonials");
  return data;
};
