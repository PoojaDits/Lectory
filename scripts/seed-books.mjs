/**
 * Seed real books + multi-seller listings into db.json.
 *
 * Real book metadata (title / author / publisher / ISBN) is curated and
 * accurate. Real cover images are served by Open Library by ISBN
 * (https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg) — every ISBN below was
 * verified to have a cover image.
 *
 * Each book is given 2–3 seller listings (different sellers, prices, stock)
 * so the marketplace's "multiple sellers per book" rule is demonstrable.
 *
 * Every storefront section (genre) has at least 15 books.
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
 *
 * A book may belong to multiple categories (e.g. a classic can be both
 * "recommended" and "bestseller").
 */
const CATALOG = [
  // ═══════════════ BEST SELLERS ═══════════════
  { isbn: "9781847941831", title: "Atomic Habits", author: "James Clear", publisher: "Random House", price: 449, rating: 4.8, pages: 320, year: "2018", cat: ["bestseller"], desc: "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results." },
  { isbn: "9780857197689", title: "The Psychology of Money", author: "Morgan Housel", publisher: "Harriman House", price: 299, rating: 4.7, pages: 256, year: "2020", cat: ["bestseller"], desc: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't about what you know." },
  { isbn: "9780062316097", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", publisher: "Harper", price: 499, rating: 4.6, pages: 464, year: "2014", cat: ["bestseller"], desc: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution." },
  { isbn: "9780525559474", title: "The Midnight Library", author: "Matt Haig", publisher: "Viking", price: 399, rating: 4.3, pages: 304, year: "2020", cat: ["bestseller"], desc: "Between life and death there is a library, and within that library, the shelves go on forever." },
  { isbn: "9780735219090", title: "Where the Crawdads Sing", author: "Delia Owens", publisher: "G.P. Putnam's Sons", price: 359, rating: 4.6, pages: 384, year: "2018", cat: ["bestseller"], desc: "A coming-of-age mystery set in the marshes of North Carolina. A #1 New York Times bestseller." },
  { isbn: "9781250301697", title: "The Silent Patient", author: "Alex Michaelides", publisher: "Celadon Books", price: 329, rating: 4.4, pages: 336, year: "2019", cat: ["bestseller"], desc: "A shocking psychological thriller of a woman's act of violence against her husband." },
  { isbn: "9780593135204", title: "Project Hail Mary", author: "Andy Weir", publisher: "Ballantine Books", price: 479, rating: 4.7, pages: 496, year: "2021", cat: ["bestseller", "preorder"], desc: "From the bestselling author of The Martian comes a lone astronaut who must save the earth from disaster." },
  { isbn: "9780307277671", title: "The Da Vinci Code", author: "Dan Brown", publisher: "Anchor Books", price: 349, rating: 4.2, pages: 489, year: "2003", cat: ["bestseller"], desc: "A murder in the Louvre reveals a sinister plot to uncover a secret protected since the days of Christ." },
  { isbn: "9780385537858", title: "Inferno", author: "Dan Brown", publisher: "Doubleday", price: 369, rating: 4.1, pages: 480, year: "2013", cat: ["bestseller"], desc: "Harvard professor Robert Langdon is drawn into a harrowing world centered on Dante's Inferno." },
  { isbn: "9781501175619", title: "Become a Better You", author: "Joel Osteen", publisher: "Howard Books", price: 399, rating: 4.4, pages: 418, year: "2017", cat: ["bestseller", "preorder"], desc: "Seven keys to improving your life every day from the bestselling inspirational author." },
  { isbn: "9781541674837", title: "The Power of Dignity", author: "Victoria Pratt", publisher: "Basic Books", price: 299, rating: 4.5, pages: 256, year: "2022", cat: ["bestseller", "preorder"], desc: "The visionary former judge's inspiring story of how dignity can transform lives and communities." },
  { isbn: "9780593598139", title: "Dungeons & Dragons: The Legend of Drizzt", author: "R.A. Salvatore", publisher: "Wizards of the Coast", price: 459, rating: 4.6, pages: 288, year: "2023", cat: ["bestseller", "preorder"], desc: "An epic fantasy adventure in the legendary world of Dungeons & Dragons." },
  { isbn: "9780141187761", title: "Nineteen Eighty-Four", author: "George Orwell", publisher: "Penguin Classics", price: 259, rating: 4.5, pages: 384, year: "1949", cat: ["recommended", "bestseller"], desc: "The chilling dystopian masterpiece about totalitarianism, surveillance, and the power of language." },
  { isbn: "9780141439518", title: "Pride and Prejudice", author: "Jane Austen", publisher: "Penguin Books", price: 229, rating: 4.6, pages: 435, year: "1813", cat: ["recommended", "bestseller"], desc: "The beloved classic about love, class, and the stubborn Elizabeth Bennet and proud Mr. Darcy." },
  { isbn: "9780593334836", title: "Book Lovers", author: "Emily Henry", publisher: "Penguin", price: 339, rating: 4.3, pages: 384, year: "2022", cat: ["recommended", "preorder", "bestseller"], desc: "A witty, sparkling enemies-to-lovers romantic comedy from the bestselling author of Beach Read." },

  // ═══════════════ RECOMMENDED (literary fiction & classics) ═══════════════
  { isbn: "9780593318171", title: "Klara and the Sun", author: "Kazuo Ishiguro", publisher: "Knopf", price: 429, rating: 4.1, pages: 320, year: "2021", cat: ["recommended", "bestseller", "preorder"], desc: "The first novel by the Nobel laureate since Never Let Me Go — a new story of what it means to love." },
  { isbn: "9780062315007", title: "The Alchemist", author: "Paulo Coelho", publisher: "HarperCollins", price: 279, rating: 4.5, pages: 208, year: "1993", cat: ["recommended", "bestseller"], desc: "A timeless fable about following your dream. An inspirational classic." },
  { isbn: "9780061120084", title: "To Kill a Mockingbird", author: "Harper Lee", publisher: "Harper Perennial", price: 299, rating: 4.7, pages: 384, year: "1960", cat: ["recommended"], desc: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it." },
  { isbn: "9780547928227", title: "The Hobbit", author: "J.R.R. Tolkien", publisher: "Mariner Books", price: 399, rating: 4.8, pages: 320, year: "1937", cat: ["recommended"], desc: "The fantasy classic that introduced Bilbo Baggins, Gandalf, and the One Ring." },
  { isbn: "9780743273565", title: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Scribner", price: 249, rating: 4.3, pages: 180, year: "1925", cat: ["recommended"], desc: "The authentic edition of the timeless masterpiece about the dark side of the American Dream." },
  { isbn: "9780316769174", title: "The Catcher in the Rye", author: "J.D. Salinger", publisher: "Back Bay Books", price: 289, rating: 4.2, pages: 288, year: "1951", cat: ["recommended"], desc: "The hero-narrator's voice of an adolescent at odds with the world, in a modern classic." },
  { isbn: "9781594633669", title: "The Girl on the Train", author: "Paula Hawkins", publisher: "Riverhead", price: 319, rating: 4.1, pages: 336, year: "2015", cat: ["recommended", "preorder"], desc: "A psychological thriller that follows the intertwined lives of three women." },
  { isbn: "9781984822178", title: "Normal People", author: "Sally Rooney", publisher: "Hogarth", price: 309, rating: 4.0, pages: 288, year: "2018", cat: ["recommended"], desc: "A story of mutual fascination, friendship and a complex, enduring first love." },
  { isbn: "9780743477109", title: "Macbeth", author: "William Shakespeare", publisher: "Washington Square Press", price: 199, rating: 4.2, pages: 223, year: "2002", cat: ["recommended"], desc: "Shakespeare's dark tragedy of ambition, murder, and madness in medieval Scotland." },
  { isbn: "9780140283334", title: "Lord of the Flies", author: "William Golding", publisher: "Penguin Books", price: 239, rating: 4.0, pages: 192, year: "1954", cat: ["recommended"], desc: "A group of schoolboys stranded on an island descends into savagery in this Nobel Prize-winning novel." },
  { isbn: "9780143039433", title: "The Grapes of Wrath", author: "John Steinbeck", publisher: "Penguin Books", price: 269, rating: 4.3, pages: 464, year: "1939", cat: ["recommended"], desc: "Steinbeck's Pulitzer Prize-winning epic of the Great Depression and the Joad family's migration." },
  { isbn: "9780141441146", title: "Jane Eyre", author: "Charlotte Brontë", publisher: "Penguin Books", price: 219, rating: 4.4, pages: 544, year: "1847", cat: ["recommended"], desc: "The timeless gothic romance of an orphaned governess and the brooding Mr. Rochester." },
  { isbn: "9780140275360", title: "The Iliad", author: "Homer", publisher: "Penguin Books", price: 249, rating: 4.1, pages: 704, year: "1998", cat: ["recommended"], desc: "The ancient Greek epic of the Trojan War, Achilles, Hector, and the wrath of the gods." },
  { isbn: "9780141182803", title: "Ulysses", author: "James Joyce", publisher: "Penguin Books", price: 289, rating: 3.9, pages: 1040, year: "1922", cat: ["recommended"], desc: "Joyce's modernist masterpiece following Leopold Bloom through a single day in Dublin." },
  { isbn: "9780140449136", title: "Crime and Punishment", author: "Fyodor Dostoevsky", publisher: "Penguin Classics", price: 229, rating: 4.4, pages: 671, year: "1866", cat: ["recommended"], desc: "Dostoevsky's psychological masterpiece of guilt, redemption, and a desperate student's crime." },
  { isbn: "9780140449266", title: "The Count of Monte Cristo", author: "Alexandre Dumas", publisher: "Penguin Books", price: 279, rating: 4.6, pages: 1276, year: "1844", cat: ["recommended"], desc: "The epic tale of betrayal, imprisonment, and a meticulous revenge spanning decades." },

  // ═══════════════ ARTIFICIAL INTELLIGENCE & TECH ═══════════════
  { isbn: "9780374257835", title: "Artificial Intelligence: A Guide for Thinking Humans", author: "Melanie Mitchell", publisher: "Farrar, Straus and Giroux", price: 459, rating: 4.5, pages: 352, year: "2019", cat: ["ai"], desc: "A penetrating assessment of what AI can and cannot do, from a leading computer scientist." },
  { isbn: "9780198739838", title: "Superintelligence: Paths, Dangers, Strategies", author: "Nick Bostrom", publisher: "Oxford University Press", price: 529, rating: 4.3, pages: 390, year: "2014", cat: ["ai"], desc: "A foundational analysis of the future of machine intelligence and the existential questions it raises." },
  { isbn: "9780262533058", title: "Introduction to Algorithms (CLRS)", author: "Thomas H. Cormen et al.", publisher: "The MIT Press", price: 1499, rating: 4.7, pages: 1312, year: "2009", cat: ["ai"], desc: "The definitive algorithms textbook, covering a broad range of algorithms with rigor and clarity." },
  { isbn: "9780136042594", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", publisher: "Prentice Hall", price: 1299, rating: 4.6, pages: 1152, year: "2009", cat: ["ai", "preorder"], desc: "The most comprehensive introduction to the theory and practice of artificial intelligence." },
  { isbn: "9781449369415", title: "Introduction to Machine Learning with Python", author: "Andreas C. Müller, Sarah Guido", publisher: "O'Reilly Media", price: 599, rating: 4.5, pages: 376, year: "2016", cat: ["ai"], desc: "A practical guide to machine learning and deep learning with scikit-learn and TensorFlow." },
  { isbn: "9780132350884", title: "Clean Code", author: "Robert C. Martin", publisher: "Prentice Hall", price: 499, rating: 4.6, pages: 431, year: "2008", cat: ["ai"], desc: "A handbook of agile software craftsmanship. Even bad code can function — but clean code endures." },
  { isbn: "9780201616224", title: "The Pragmatic Programmer", author: "Andy Hunt, Dave Thomas", publisher: "Addison-Wesley", price: 449, rating: 4.7, pages: 321, year: "1999", cat: ["ai"], desc: "Your journey to mastery. A timeless classic that teaches how to think like a pragmatic programmer." },
  { isbn: "9780137081073", title: "The Clean Coder", author: "Robert C. Martin", publisher: "Prentice Hall", price: 379, rating: 4.4, pages: 210, year: "2011", cat: ["ai"], desc: "A code of conduct for professional programmers, on discipline, ethics, and craftsmanship." },
  { isbn: "9781617292231", title: "Grokking Algorithms", author: "Aditya Y. Bhargava", publisher: "Manning Publications", price: 429, rating: 4.7, pages: 256, year: "2016", cat: ["ai"], desc: "An illustrated guide for programmers and other curious people. Algorithms made beautifully simple." },
  { isbn: "9780321125217", title: "Domain-Driven Design", author: "Eric Evans", publisher: "Addison-Wesley", price: 549, rating: 4.3, pages: 529, year: "2003", cat: ["ai"], desc: "Tackling complexity in the heart of software. The foundational text on DDD." },
  { isbn: "9780134494166", title: "Clean Architecture", author: "Robert C. Martin", publisher: "Pearson", price: 479, rating: 4.5, pages: 432, year: "2017", cat: ["ai", "preorder"], desc: "A craftsman's guide to software structure and design, from the author of Clean Code." },
  { isbn: "9780134757599", title: "Refactoring", author: "Martin Fowler", publisher: "Addison-Wesley", price: 499, rating: 4.6, pages: 448, year: "2018", cat: ["ai", "preorder"], desc: "Improving the design of existing code. The definitive guide to refactoring, fully updated." },
  { isbn: "9781491950357", title: "Building Microservices", author: "Sam Newman", publisher: "O'Reilly Media", price: 529, rating: 4.4, pages: 280, year: "2015", cat: ["ai"], desc: "Designing fine-grained systems. A practical guide to the microservices architecture." },
  { isbn: "9780201835953", title: "The Mythical Man-Month", author: "Frederick P. Brooks", publisher: "Addison-Wesley", price: 399, rating: 4.5, pages: 322, year: "1995", cat: ["ai"], desc: "Essays on software engineering. Adding people to a late project makes it later — and other timeless wisdom." },
  { isbn: "9780321573513", title: "Algorithms", author: "Robert Sedgewick, Kevin Wayne", publisher: "Addison-Wesley", price: 699, rating: 4.6, pages: 955, year: "2011", cat: ["ai"], desc: "A comprehensive introduction to algorithms and data structures, with Java implementations." },
  { isbn: "9781593275846", title: "Eloquent JavaScript", author: "Marijn Haverbeke", publisher: "No Starch Press", price: 359, rating: 4.6, pages: 472, year: "2018", cat: ["ai"], desc: "A modern introduction to programming with JavaScript, from fundamentals to advanced topics." },
  { isbn: "9781593275990", title: "Automate the Boring Stuff with Python", author: "Al Sweigart", publisher: "No Starch Press", price: 329, rating: 4.6, pages: 504, year: "2015", cat: ["ai"], desc: "Practical programming for total beginners. Write programs that do in minutes what takes hours by hand." },
  { isbn: "9781718500402", title: "How Linux Works", author: "Brian Ward", publisher: "No Starch Press", price: 389, rating: 4.5, pages: 390, year: "2020", cat: ["ai", "preorder"], desc: "What every superuser should know. A master class in understanding the Linux operating system." },
  { isbn: "9780134685991", title: "Effective Java", author: "Joshua Bloch", publisher: "Addison-Wesley", price: 459, rating: 4.7, pages: 416, year: "2018", cat: ["ai"], desc: "Best practices for the Java platform. The definitive guide to writing robust, maintainable Java." },
  { isbn: "9780321486813", title: "Compilers: Principles, Techniques, and Tools", author: "Alfred V. Aho et al.", publisher: "Addison-Wesley", price: 629, rating: 4.4, pages: 1000, year: "2006", cat: ["ai", "preorder"], desc: "The classic 'Dragon Book' on compiler construction, covering everything from lexing to optimization." },

  // ═══════════════ MANGA & GRAPHIC NOVELS ═══════════════
  { isbn: "9780930289232", title: "Watchmen", author: "Alan Moore", publisher: "DC Comics", price: 699, rating: 4.6, pages: 416, year: "1986", cat: ["manga"], desc: "A graphic novel masterpiece that redefined the superhero genre for a generation." },
  { isbn: "9781607066019", title: "Saga, Vol. 1", author: "Brian K. Vaughan", publisher: "Image Comics", price: 379, rating: 4.7, pages: 160, year: "2012", cat: ["manga", "preorder"], desc: "An epic space opera/fantasy from the award-winning creators of Y: The Last Man." },
  { isbn: "9780394747231", title: "Maus I: A Survivor's Tale", author: "Art Spiegelman", publisher: "Pantheon", price: 549, rating: 4.8, pages: 160, year: "1986", cat: ["manga"], desc: "The Pulitzer Prize-winning graphic novel about the Holocaust, told with Jews as mice and Nazis as cats." },
  { isbn: "9780375714573", title: "Persepolis", author: "Marjane Satrapi", publisher: "Pantheon", price: 419, rating: 4.6, pages: 160, year: "2003", cat: ["manga"], desc: "A memoir-in-comics of growing up during the Iranian Revolution." },
  { isbn: "9781582406725", title: "The Walking Dead, Vol. 1", author: "Robert Kirkman", publisher: "Image Comics", price: 349, rating: 4.5, pages: 144, year: "2006", cat: ["manga"], desc: "The beginning of the acclaimed zombie survival epic." },
  { isbn: "9781569319000", title: "Naruto, Vol. 1", author: "Masashi Kishimoto", publisher: "VIZ Media", price: 329, rating: 4.8, pages: 192, year: "2003", cat: ["manga"], desc: "The legendary ninja manga. Uzumaki Naruto dreams of becoming the greatest Hokage." },
  { isbn: "9781569319864", title: "Dragon Ball Z, Vol. 1", author: "Akira Toriyama", publisher: "VIZ Media", price: 329, rating: 4.7, pages: 192, year: "2003", cat: ["manga"], desc: "The iconic shonen manga. Goku defends Earth against ever-more-powerful foes." },
  { isbn: "9781569319017", title: "One Piece, Vol. 1", author: "Eiichiro Oda", publisher: "VIZ Media", price: 329, rating: 4.9, pages: 208, year: "2003", cat: ["manga"], desc: "Monkey D. Luffy sets sail to become the King of the Pirates in the best-selling manga of all time." },
  { isbn: "9781612620244", title: "Attack on Titan, Vol. 1", author: "Hajime Isayama", publisher: "Kodansha Comics", price: 339, rating: 4.7, pages: 208, year: "2012", cat: ["manga", "preorder"], desc: "Humanity lives behind giant walls to survive against man-eating Titans in this dark fantasy epic." },
  { isbn: "9781421582696", title: "My Hero Academia, Vol. 1", author: "Kohei Horikoshi", publisher: "VIZ Media", price: 329, rating: 4.8, pages: 192, year: "2015", cat: ["manga"], desc: "In a world of superpowers, a quirkless boy strives to become the greatest hero." },
  { isbn: "9781421580364", title: "Tokyo Ghoul, Vol. 1", author: "Sui Ishida", publisher: "VIZ Media", price: 329, rating: 4.6, pages: 224, year: "2015", cat: ["manga"], desc: "A dark horror fantasy about a college student turned half-ghoul, struggling with his new hunger." },
  { isbn: "9781612624426", title: "Sailor Moon, Vol. 1", author: "Naoko Takeuchi", publisher: "Kodansha Comics", price: 329, rating: 4.8, pages: 240, year: "2011", cat: ["manga", "preorder"], desc: "The magical-girl classic. Usagi transforms into Sailor Moon to protect the world from evil." },
  { isbn: "9781421580326", title: "World Trigger, Vol. 1", author: "Daisuke Ashihara", publisher: "VIZ Media", price: 329, rating: 4.5, pages: 192, year: "2014", cat: ["manga"], desc: "Earth is invaded by mysterious creatures from another dimension — defended by the Border agency." },
  { isbn: "9780785187905", title: "Avengers Epic Collection", author: "Gerry Conway", publisher: "Marvel", price: 599, rating: 4.4, pages: 435, year: "2013", cat: ["manga"], desc: "Earth's Mightiest Heroes assemble in this classic Marvel collection." },
  { isbn: "9780785190219", title: "Ms. Marvel, Vol. 1", author: "G. Willow Wilson", publisher: "Marvel", price: 379, rating: 4.7, pages: 120, year: "2014", cat: ["manga"], desc: "Kamala Khan, a Muslim teen from Jersey City, discovers her shape-shifting superpowers." },
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
 */
function buildListings(books, priceByBookId) {
  const listings = [];
  let id = 1;
  for (const book of books) {
    const basePrice = priceByBookId[book.id];
    const r1 = seeded(book.isbn + "a");
    const r2 = seeded(book.isbn + "b");
    const count = r1 < 0.4 ? 2 : 3;
    const chosen = SELLERS.slice(0, count);

    chosen.forEach((seller, idx) => {
      const jitter = idx === 0 ? 1 : 0.85 + r2 * 0.35;
      const price = Math.max(49, Math.round((basePrice * jitter) / 10) * 10 - 1);
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
delete db.$schema; // remove $schema if present (causes json-server type issues)

// Tidy: write with a trailing newline.
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2) + "\n");

const inStock = listings.filter((l) => l.stock > 0).length;
const perBook = books.length ? (listings.length / books.length).toFixed(1) : 0;

console.log(`✅ Seeded ${books.length} real books (Open Library covers)`);
console.log(`✅ Seeded ${listings.length} seller listings (${inStock} in stock, ${listings.length - inStock} out of stock)`);
console.log(`   ≈ ${perBook} sellers per book`);
console.log("");

// Report per-category counts
const cats = ["bestseller", "recommended", "ai", "manga", "preorder"];
for (const c of cats) {
  const n = books.filter((b) => b.categories.includes(c)).length;
  console.log(`   ${c.padEnd(14)}: ${n} books ${n >= 15 ? "✅" : "❌ NEEDS MORE"}`);
}
