/**
 * Seed real books + multi-seller listings into db.json.
 *
 * Real book metadata (title / author / publisher / ISBN) is curated and
 * accurate. Real cover images are served by Open Library by ISBN
 * (https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg) — verified to exist.
 *
 * Each book is given 2–3 seller listings (different sellers, prices, stock)
 * so the marketplace's "multiple sellers per book" rule is demonstrable.
 *
 * Usage:  node scripts/seed-books.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../db.json");

// Open Library cover URL by ISBN (real cover art).
const cover = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

/**
 * Curated catalog. `price` is a baseline MRP used to derive per-seller prices.
 * `cat` tags drive the storefront sections. All ISBNs are real and have a
 * confirmed Open Library cover image.
 */
const CATALOG = [
  // ── Best sellers ──
  { isbn: "9781847941831", title: "Atomic Habits", author: "James Clear", publisher: "Random House", price: 449, rating: 4.8, pages: 320, year: "2018", cat: ["bestseller"], desc: "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results." },
  { isbn: "9780857197689", title: "The Psychology of Money", author: "Morgan Housel", publisher: "Harriman House", price: 299, rating: 4.7, pages: 256, year: "2020", cat: ["bestseller"], desc: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't about what you know." },
  { isbn: "9780062316097", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", publisher: "Harper", price: 499, rating: 4.6, pages: 464, year: "2014", cat: ["bestseller"], desc: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution." },
  { isbn: "9780525559474", title: "The Midnight Library", author: "Matt Haig", publisher: "Viking", price: 399, rating: 4.3, pages: 304, year: "2020", cat: ["bestseller"], desc: "Between life and death there is a library, and within that library, the shelves go on forever." },
  { isbn: "9780735219090", title: "Where the Crawdads Sing", author: "Delia Owens", publisher: "G.P. Putnam's Sons", price: 359, rating: 4.6, pages: 384, year: "2018", cat: ["bestseller"], desc: "A coming-of-age mystery set in the marshes of North Carolina. A #1 New York Times bestseller." },
  { isbn: "9781250301697", title: "The Silent Patient", author: "Alex Michaelides", publisher: "Celadon Books", price: 329, rating: 4.4, pages: 336, year: "2019", cat: ["bestseller"], desc: "A shocking psychological thriller of a woman's act of violence against her husband." },
  { isbn: "9780593135204", title: "Project Hail Mary", author: "Andy Weir", publisher: "Ballantine Books", price: 479, rating: 4.7, pages: 496, year: "2021", cat: ["bestseller", "preorder"], desc: "From the bestselling author of The Martian comes a lone astronaut must save the earth from disaster." },
  { isbn: "9780307277671", title: "The Da Vinci Code", author: "Dan Brown", publisher: "Anchor Books", price: 349, rating: 4.2, pages: 489, year: "2003", cat: ["bestseller"], desc: "A murder in the Louvre reveals a sinister plot to uncover a secret that has been protected since the days of Christ." },

  // ── Recommended (literary fiction & classics) ──
  { isbn: "9780593318171", title: "Klara and the Sun", author: "Kazuo Ishiguro", publisher: "Knopf", price: 429, rating: 4.1, pages: 320, year: "2021", cat: ["recommended", "bestseller", "preorder"], desc: "The first novel by the Nobel laureate since Never Let Me Go — a thrilling new story of what it means to love." },
  { isbn: "9780062315007", title: "The Alchemist", author: "Paulo Coelho", publisher: "HarperCollins", price: 279, rating: 4.5, pages: 208, year: "1993", cat: ["recommended", "bestseller"], desc: "A timeless fable about following your dream. An inspirational classic." },
  { isbn: "9780061120084", title: "To Kill a Mockingbird", author: "Harper Lee", publisher: "Harper Perennial", price: 299, rating: 4.7, pages: 384, year: "1960", cat: ["recommended"], desc: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it." },
  { isbn: "9780547928227", title: "The Hobbit", author: "J.R.R. Tolkien", publisher: "Mariner Books", price: 399, rating: 4.8, pages: 320, year: "1937", cat: ["recommended"], desc: "The fantasy classic that introduced Bilbo Baggins, Gandalf, and the One Ring." },
  { isbn: "9780743273565", title: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Scribner", price: 249, rating: 4.3, pages: 180, year: "1925", cat: ["recommended"], desc: "The authentic edition of the timeless masterpiece about the dark side of the American Dream." },
  { isbn: "9780316769488", title: "The Catcher in the Rye", author: "J.D. Salinger", publisher: "Little, Brown", price: 289, rating: 4.2, pages: 288, year: "1951", cat: ["recommended"], desc: "The hero-narrator's voice of an adolescent at odds with the world, in a modern classic." },
  { isbn: "9781594633669", title: "The Girl on the Train", author: "Paula Hawkins", publisher: "Riverhead", price: 319, rating: 4.1, pages: 336, year: "2015", cat: ["recommended", "preorder"], desc: "A psychological thriller that follows the intertwined lives of three women." },
  { isbn: "9781984822178", title: "Normal People", author: "Sally Rooney", publisher: "Hogarth", price: 309, rating: 4.0, pages: 288, year: "2018", cat: ["recommended"], desc: "A story of mutual fascination, friendship and a complex, enduring first love." },

  // ── Artificial Intelligence ──
  { isbn: "9780374257835", title: "Artificial Intelligence: A Guide for Thinking Humans", author: "Melanie Mitchell", publisher: "Farrar, Straus and Giroux", price: 459, rating: 4.5, pages: 352, year: "2019", cat: ["ai"], desc: "A penetrating assessment of what AI can and cannot do, from a leading computer scientist." },
  { isbn: "9780198739838", title: "Superintelligence: Paths, Dangers, Strategies", author: "Nick Bostrom", publisher: "Oxford University Press", price: 529, rating: 4.3, pages: 390, year: "2014", cat: ["ai"], desc: "A foundational analysis of the future of machine intelligence and the existential questions it raises." },
  { isbn: "9780262533058", title: "Introduction to Algorithms", author: "Thomas H. Cormen et al.", publisher: "The MIT Press", price: 1499, rating: 4.7, pages: 1312, year: "2009", cat: ["ai"], desc: "The widely used CLRS textbook covering a broad range of algorithms in depth, with rigor and clarity." },

  // ── Graphic novels ──
  { isbn: "9780930289232", title: "Watchmen", author: "Alan Moore", publisher: "DC Comics", price: 699, rating: 4.6, pages: 416, year: "1986", cat: ["manga"], desc: "A graphic novel masterpiece that redefined the superhero genre for a generation." },
  { isbn: "9781607066019", title: "Saga, Vol. 1", author: "Brian K. Vaughan", publisher: "Image Comics", price: 379, rating: 4.7, pages: 160, year: "2012", cat: ["manga", "preorder"], desc: "An epic space opera/fantasy from the award-winning creators of Y: The Last Man." },
  { isbn: "9780394747231", title: "Maus I: A Survivor's Tale", author: "Art Spiegelman", publisher: "Pantheon", price: 549, rating: 4.8, pages: 160, year: "1986", cat: ["manga"], desc: "The Pulitzer Prize-winning graphic novel about the Holocaust, told with Jews as mice and Nazis as cats." },
  { isbn: "9780375714573", title: "Persepolis", author: "Marjane Satrapi", publisher: "Pantheon", price: 419, rating: 4.6, pages: 160, year: "2003", cat: ["manga"], desc: "A memoir-in-comics of growing up during the Iranian Revolution." },
  { isbn: "9781582406725", title: "The Walking Dead, Vol. 1: Days Gone Bye", author: "Robert Kirkman", publisher: "Image Comics", price: 349, rating: 4.5, pages: 144, year: "2006", cat: ["manga"], desc: "The beginning of the acclaimed zombie survival epic." },
];

// ── Listings ──
// Approved sellers that actually hold stock.
const SELLERS = [
  { id: 1, name: "BookWorld Distributors" },
  { id: 2, name: "PageTurner Books" },
  { id: 3, name: "ReadMore Traders" },
];

/** Deterministic pseudo-random in [0,1) from a string seed. */
const seeded = (seed) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
};

/**
 * Build 2–3 listings per book. The first seller gets the baseline price,
 * others are priced ±10–15% to create real comparison shopping. One listing
 * is occasionally at stock 0 to exercise the out-of-stock edge case.
 *
 * `priceByBookId` maps the generated book id → its catalog baseline price.
 */
function buildListings(books, priceByBookId) {
  const listings = [];
  let id = 1;
  for (const book of books) {
    const basePrice = priceByBookId[book.id];
    const r1 = seeded(book.isbn + "a");
    const r2 = seeded(book.isbn + "b");
    // how many sellers carry this book: 2 or 3
    const count = r1 < 0.4 ? 2 : 3;
    const chosen = SELLERS.slice(0, count);

    chosen.forEach((seller, idx) => {
      const jitter = idx === 0 ? 1 : 0.85 + r2 * 0.35; // ±~15%
      const price = Math.max(49, Math.round((basePrice * jitter) / 10) * 10 - 1);
      // stock: mostly available; ~1 in 6 listings out of stock
      const stockRoll = seeded(book.isbn + seller.id);
      const stock = stockRoll < 0.16 ? 0 : Math.floor(stockRoll * 20) + 3;

      listings.push({
        id: id++,
        bookId: book.id,
        sellerId: seller.id,
        price,
        stock,
        active: true,
        createdAt: "2026-06-08T09:00:00.000Z",
      });
    });
  }
  return listings;
}

// ── Build & merge into db.json ──
const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));

const books = CATALOG.map((c, i) => ({
  id: i + 1,
  isbn: c.isbn,
  title: c.title,
  author: c.author,
  publisher: c.publisher,
  description: c.desc,
  coverImage: cover(c.isbn),
  status: "Approved",
  createdAt: "2026-06-01T09:00:00.000Z",
  reviewedAt: "2026-06-02T09:00:00.000Z",
  categories: c.cat,
  rating: c.rating,
  pageCount: c.pages,
  publishedDate: c.year,
}));

const listings = buildListings(
  books,
  Object.fromEntries(books.map((b, i) => [b.id, CATALOG[i].price]))
);

db.books = books;
db.listings = listings;
db.cartItems = []; // clear any stale cart lines

// Tidy: write with a trailing newline.
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2) + "\n");

const inStock = listings.filter((l) => l.stock > 0).length;
console.log(`✅ Seeded ${books.length} real books (Open Library covers)`);
console.log(`✅ Seeded ${listings.length} seller listings (${inStock} in stock, ${listings.length - inStock} out of stock)`);
const perBook = books.length
  ? (listings.length / books.length).toFixed(1)
  : 0;
console.log(`   ≈ ${perBook} sellers per book`);
console.log("   Sections: bestseller, recommended, ai, manga");
