/**
 * scripts/seed-books.mjs — single source of truth for the marketplace catalog.
 * Run with `node scripts/seed-books.mjs` to regenerate db.json.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../db.json");

// Open Library cover URL by ISBN (real cover art).
const cover = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

/**
 * Pick the right cover URL for a catalog entry.
 *   1. `coverOlid` → Open Library by OLID (some Hindi/Spanish classics
 *      whose ISBN OL hasn't catalogued).
 *   2. `noCover`   → null so the storefront's gradient fallback renders.
 *   3. ISBN lookup — the default (works for all English entries).
 */
const coverFor = (c) => {
  if (c.coverOlid) return `https://covers.openlibrary.org/b/olid/${c.coverOlid}-L.jpg`;
  if (c.noCover) return null;
  return cover(c.isbn);
};


const CATALOG = [
  //BEST SELLERS 
  { isbn: "9781847941831", title: "Atomic Habits", author: "James Clear", publisher: "Random House", price: 449, rating: 4.8, pages: 320, year: "2018", cat: ["bestseller"], desc: "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.", lang: "English" },
  { isbn: "9780857197689", title: "The Psychology of Money", author: "Morgan Housel", publisher: "Harriman House", price: 299, rating: 4.7, pages: 256, year: "2020", cat: ["bestseller"], desc: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't about what you know.", lang: "English" },
  { isbn: "9780062316097", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", publisher: "Harper", price: 499, rating: 4.6, pages: 464, year: "2014", cat: ["bestseller"], desc: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution.", lang: "English" },
  { isbn: "9780525559474", title: "The Midnight Library", author: "Matt Haig", publisher: "Viking", price: 399, rating: 4.3, pages: 304, year: "2020", cat: ["bestseller"], desc: "Between life and death there is a library, and within that library, the shelves go on forever.", lang: "English" },
  { isbn: "9780735219090", title: "Where the Crawdads Sing", author: "Delia Owens", publisher: "G.P. Putnam's Sons", price: 359, rating: 4.6, pages: 384, year: "2018", cat: ["bestseller"], desc: "A coming-of-age mystery set in the marshes of North Carolina. A #1 New York Times bestseller.", lang: "English" },
  { isbn: "9781250301697", title: "The Silent Patient", author: "Alex Michaelides", publisher: "Celadon Books", price: 329, rating: 4.4, pages: 336, year: "2019", cat: ["bestseller"], desc: "A shocking psychological thriller of a woman's act of violence against her husband.", lang: "English" },
  { isbn: "9780593135204", title: "Project Hail Mary", author: "Andy Weir", publisher: "Ballantine Books", price: 479, rating: 4.7, pages: 496, year: "2021", cat: ["bestseller", "preorder"], desc: "From the bestselling author of The Martian comes a lone astronaut who must save the earth from disaster.", lang: "English" },
  { isbn: "9780307277671", title: "The Da Vinci Code", author: "Dan Brown", publisher: "Anchor Books", price: 349, rating: 4.2, pages: 489, year: "2003", cat: ["bestseller"], desc: "A murder in the Louvre reveals a sinister plot to uncover a secret protected since the days of Christ.", lang: "English" },
  { isbn: "9780385537858", title: "Inferno", author: "Dan Brown", publisher: "Doubleday", price: 369, rating: 4.1, pages: 480, year: "2013", cat: ["bestseller"], desc: "Harvard professor Robert Langdon is drawn into a harrowing world centered on Dante's Inferno.", lang: "English" },
  { isbn: "9781501175619", title: "Become a Better You", author: "Joel Osteen", publisher: "Howard Books", price: 399, rating: 4.4, pages: 418, year: "2017", cat: ["bestseller", "preorder"], desc: "Seven keys to improving your life every day from the bestselling inspirational author.", lang: "English" },
  { isbn: "9781541674837", title: "The Power of Dignity", author: "Victoria Pratt", publisher: "Basic Books", price: 299, rating: 4.5, pages: 256, year: "2022", cat: ["bestseller", "preorder"], desc: "The visionary former judge's inspiring story of how dignity can transform lives and communities.", lang: "English" },
  { isbn: "9780593598139", title: "Dungeons & Dragons: The Legend of Drizzt", author: "R.A. Salvatore", publisher: "Wizards of the Coast", price: 459, rating: 4.6, pages: 288, year: "2023", cat: ["bestseller", "preorder"], desc: "An epic fantasy adventure in the legendary world of Dungeons & Dragons.", lang: "English" },
  { isbn: "9780141187761", title: "Nineteen Eighty-Four", author: "George Orwell", publisher: "Penguin Classics", price: 259, rating: 4.5, pages: 384, year: "1949", cat: ["recommended", "bestseller"], desc: "The chilling dystopian masterpiece about totalitarianism, surveillance, and the power of language.", lang: "English" },
  { isbn: "9780141439518", title: "Pride and Prejudice", author: "Jane Austen", publisher: "Penguin Books", price: 229, rating: 4.6, pages: 435, year: "1813", cat: ["recommended", "bestseller"], desc: "The beloved classic about love, class, and the stubborn Elizabeth Bennet and proud Mr. Darcy.", lang: "English" },
  { isbn: "9780593334836", title: "Book Lovers", author: "Emily Henry", publisher: "Penguin", price: 339, rating: 4.3, pages: 384, year: "2022", cat: ["recommended", "preorder", "bestseller"], desc: "A witty, sparkling enemies-to-lovers romantic comedy from the bestselling author of Beach Read.", lang: "English" },

  //RECOMMENDED (literary fiction & classics) 
  { isbn: "9780593318171", title: "Klara and the Sun", author: "Kazuo Ishiguro", publisher: "Knopf", price: 429, rating: 4.1, pages: 320, year: "2021", cat: ["recommended", "bestseller", "preorder"], desc: "The first novel by the Nobel laureate since Never Let Me Go — a new story of what it means to love.", lang: "English" },
  { isbn: "9780062315007", title: "The Alchemist", author: "Paulo Coelho", publisher: "HarperCollins", price: 279, rating: 4.5, pages: 208, year: "1993", cat: ["recommended", "bestseller"], desc: "A timeless fable about following your dream. An inspirational classic.", lang: "English" },
  { isbn: "9780061120084", title: "To Kill a Mockingbird", author: "Harper Lee", publisher: "Harper Perennial", price: 299, rating: 4.7, pages: 384, year: "1960", cat: ["recommended"], desc: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.", lang: "English" },
  { isbn: "9780547928227", title: "The Hobbit", author: "J.R.R. Tolkien", publisher: "Mariner Books", price: 399, rating: 4.8, pages: 320, year: "1937", cat: ["recommended"], desc: "The fantasy classic that introduced Bilbo Baggins, Gandalf, and the One Ring.", lang: "English" },
  { isbn: "9780743273565", title: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Scribner", price: 249, rating: 4.3, pages: 180, year: "1925", cat: ["recommended"], desc: "The authentic edition of the timeless masterpiece about the dark side of the American Dream.", lang: "English" },
  { isbn: "9780316769174", title: "The Catcher in the Rye", author: "J.D. Salinger", publisher: "Back Bay Books", price: 289, rating: 4.2, pages: 288, year: "1951", cat: ["recommended"], desc: "The hero-narrator's voice of an adolescent at odds with the world, in a modern classic.", lang: "English" },
  { isbn: "9781594633669", title: "The Girl on the Train", author: "Paula Hawkins", publisher: "Riverhead", price: 319, rating: 4.1, pages: 336, year: "2015", cat: ["recommended", "preorder"], desc: "A psychological thriller that follows the intertwined lives of three women.", lang: "English" },
  { isbn: "9781984822178", title: "Normal People", author: "Sally Rooney", publisher: "Hogarth", price: 309, rating: 4.0, pages: 288, year: "2018", cat: ["recommended"], desc: "A story of mutual fascination, friendship and a complex, enduring first love.", lang: "English" },
  { isbn: "9780743477109", title: "Macbeth", author: "William Shakespeare", publisher: "Washington Square Press", price: 199, rating: 4.2, pages: 223, year: "2002", cat: ["recommended"], desc: "Shakespeare's dark tragedy of ambition, murder, and madness in medieval Scotland.", lang: "English" },
  { isbn: "9780140283334", title: "Lord of the Flies", author: "William Golding", publisher: "Penguin Books", price: 239, rating: 4.0, pages: 192, year: "1954", cat: ["recommended"], desc: "A group of schoolboys stranded on an island descends into savagery in this Nobel Prize-winning novel.", lang: "English" },
  { isbn: "9780143039433", title: "The Grapes of Wrath", author: "John Steinbeck", publisher: "Penguin Books", price: 269, rating: 4.3, pages: 464, year: "1939", cat: ["recommended"], desc: "Steinbeck's Pulitzer Prize-winning epic of the Great Depression and the Joad family's migration.", lang: "English" },
  { isbn: "9780141441146", title: "Jane Eyre", author: "Charlotte Brontë", publisher: "Penguin Books", price: 219, rating: 4.4, pages: 544, year: "1847", cat: ["recommended"], desc: "The timeless gothic romance of an orphaned governess and the brooding Mr. Rochester.", lang: "English" },
  { isbn: "9780140275360", title: "The Iliad", author: "Homer", publisher: "Penguin Books", price: 249, rating: 4.1, pages: 704, year: "1998", cat: ["recommended"], desc: "The ancient Greek epic of the Trojan War, Achilles, Hector, and the wrath of the gods.", lang: "English" },
  { isbn: "9780141182803", title: "Ulysses", author: "James Joyce", publisher: "Penguin Books", price: 289, rating: 3.9, pages: 1040, year: "1922", cat: ["recommended"], desc: "Joyce's modernist masterpiece following Leopold Bloom through a single day in Dublin.", lang: "English" },
  { isbn: "9780140449136", title: "Crime and Punishment", author: "Fyodor Dostoevsky", publisher: "Penguin Classics", price: 229, rating: 4.4, pages: 671, year: "1866", cat: ["recommended"], desc: "Dostoevsky's psychological masterpiece of guilt, redemption, and a desperate student's crime.", lang: "English" },
  { isbn: "9780140449266", title: "The Count of Monte Cristo", author: "Alexandre Dumas", publisher: "Penguin Books", price: 279, rating: 4.6, pages: 1276, year: "1844", cat: ["recommended"], desc: "The epic tale of betrayal, imprisonment, and a meticulous revenge spanning decades.", lang: "English" },

  // ═══════════════ ARTIFICIAL INTELLIGENCE & TECH ═══════════════
  { isbn: "9780374257835", title: "Artificial Intelligence: A Guide for Thinking Humans", author: "Melanie Mitchell", publisher: "Farrar, Straus and Giroux", price: 459, rating: 4.5, pages: 352, year: "2019", cat: ["ai"], desc: "A penetrating assessment of what AI can and cannot do, from a leading computer scientist.", lang: "English" },
  { isbn: "9780198739838", title: "Superintelligence: Paths, Dangers, Strategies", author: "Nick Bostrom", publisher: "Oxford University Press", price: 529, rating: 4.3, pages: 390, year: "2014", cat: ["ai"], desc: "A foundational analysis of the future of machine intelligence and the existential questions it raises.", lang: "English" },
  { isbn: "9780262533058", title: "Introduction to Algorithms (CLRS)", author: "Thomas H. Cormen et al.", publisher: "The MIT Press", price: 1499, rating: 4.7, pages: 1312, year: "2009", cat: ["ai"], desc: "The definitive algorithms textbook, covering a broad range of algorithms with rigor and clarity.", lang: "English" },
  { isbn: "9780136042594", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", publisher: "Prentice Hall", price: 1299, rating: 4.6, pages: 1152, year: "2009", cat: ["ai", "preorder"], desc: "The most comprehensive introduction to the theory and practice of artificial intelligence.", lang: "English" },
  { isbn: "9781449369415", title: "Introduction to Machine Learning with Python", author: "Andreas C. Müller, Sarah Guido", publisher: "O'Reilly Media", price: 599, rating: 4.5, pages: 376, year: "2016", cat: ["ai"], desc: "A practical guide to machine learning and deep learning with scikit-learn and TensorFlow.", lang: "English" },
  { isbn: "9780132350884", title: "Clean Code", author: "Robert C. Martin", publisher: "Prentice Hall", price: 499, rating: 4.6, pages: 431, year: "2008", cat: ["ai"], desc: "A handbook of agile software craftsmanship. Even bad code can function — but clean code endures.", lang: "English" },
  { isbn: "9780201616224", title: "The Pragmatic Programmer", author: "Andy Hunt, Dave Thomas", publisher: "Addison-Wesley", price: 449, rating: 4.7, pages: 321, year: "1999", cat: ["ai"], desc: "Your journey to mastery. A timeless classic that teaches how to think like a pragmatic programmer.", lang: "English" },
  { isbn: "9780137081073", title: "The Clean Coder", author: "Robert C. Martin", publisher: "Prentice Hall", price: 379, rating: 4.4, pages: 210, year: "2011", cat: ["ai"], desc: "A code of conduct for professional programmers, on discipline, ethics, and craftsmanship.", lang: "English" },
  { isbn: "9781617292231", title: "Grokking Algorithms", author: "Aditya Y. Bhargava", publisher: "Manning Publications", price: 429, rating: 4.7, pages: 256, year: "2016", cat: ["ai"], desc: "An illustrated guide for programmers and other curious people. Algorithms made beautifully simple.", lang: "English" },
  { isbn: "9780321125217", title: "Domain-Driven Design", author: "Eric Evans", publisher: "Addison-Wesley", price: 549, rating: 4.3, pages: 529, year: "2003", cat: ["ai"], desc: "Tackling complexity in the heart of software. The foundational text on DDD.", lang: "English" },
  { isbn: "9780134494166", title: "Clean Architecture", author: "Robert C. Martin", publisher: "Pearson", price: 479, rating: 4.5, pages: 432, year: "2017", cat: ["ai", "preorder"], desc: "A craftsman's guide to software structure and design, from the author of Clean Code.", lang: "English" },
  { isbn: "9780134757599", title: "Refactoring", author: "Martin Fowler", publisher: "Addison-Wesley", price: 499, rating: 4.6, pages: 448, year: "2018", cat: ["ai", "preorder"], desc: "Improving the design of existing code. The definitive guide to refactoring, fully updated.", lang: "English" },
  { isbn: "9781491950357", title: "Building Microservices", author: "Sam Newman", publisher: "O'Reilly Media", price: 529, rating: 4.4, pages: 280, year: "2015", cat: ["ai"], desc: "Designing fine-grained systems. A practical guide to the microservices architecture.", lang: "English" },
  { isbn: "9780201835953", title: "The Mythical Man-Month", author: "Frederick P. Brooks", publisher: "Addison-Wesley", price: 399, rating: 4.5, pages: 322, year: "1995", cat: ["ai"], desc: "Essays on software engineering. Adding people to a late project makes it later — and other timeless wisdom.", lang: "English" },
  { isbn: "9780321573513", title: "Algorithms", author: "Robert Sedgewick, Kevin Wayne", publisher: "Addison-Wesley", price: 699, rating: 4.6, pages: 955, year: "2011", cat: ["ai"], desc: "A comprehensive introduction to algorithms and data structures, with Java implementations.", lang: "English" },
  { isbn: "9781593275846", title: "Eloquent JavaScript", author: "Marijn Haverbeke", publisher: "No Starch Press", price: 359, rating: 4.6, pages: 472, year: "2018", cat: ["ai"], desc: "A modern introduction to programming with JavaScript, from fundamentals to advanced topics.", lang: "English" },
  { isbn: "9781593275990", title: "Automate the Boring Stuff with Python", author: "Al Sweigart", publisher: "No Starch Press", price: 329, rating: 4.6, pages: 504, year: "2015", cat: ["ai"], desc: "Practical programming for total beginners. Write programs that do in minutes what takes hours by hand.", lang: "English" },
  { isbn: "9781718500402", title: "How Linux Works", author: "Brian Ward", publisher: "No Starch Press", price: 389, rating: 4.5, pages: 390, year: "2020", cat: ["ai", "preorder"], desc: "What every superuser should know. A master class in understanding the Linux operating system.", lang: "English" },
  { isbn: "9780134685991", title: "Effective Java", author: "Joshua Bloch", publisher: "Addison-Wesley", price: 459, rating: 4.7, pages: 416, year: "2018", cat: ["ai"], desc: "Best practices for the Java platform. The definitive guide to writing robust, maintainable Java.", lang: "English" },
  { isbn: "9780321486813", title: "Compilers: Principles, Techniques, and Tools", author: "Alfred V. Aho et al.", publisher: "Addison-Wesley", price: 629, rating: 4.4, pages: 1000, year: "2006", cat: ["ai", "preorder"], desc: "The classic 'Dragon Book' on compiler construction, covering everything from lexing to optimization.", lang: "English" },

  // ═══════════════ MANGA & GRAPHIC NOVELS ═══════════════
  { isbn: "9780930289232", title: "Watchmen", author: "Alan Moore", publisher: "DC Comics", price: 699, rating: 4.6, pages: 416, year: "1986", cat: ["manga"], desc: "A graphic novel masterpiece that redefined the superhero genre for a generation.", lang: "English" },
  { isbn: "9781607066019", title: "Saga, Vol. 1", author: "Brian K. Vaughan", publisher: "Image Comics", price: 379, rating: 4.7, pages: 160, year: "2012", cat: ["manga", "preorder"], desc: "An epic space opera/fantasy from the award-winning creators of Y: The Last Man.", lang: "English" },
  { isbn: "9780394747231", title: "Maus I: A Survivor's Tale", author: "Art Spiegelman", publisher: "Pantheon", price: 549, rating: 4.8, pages: 160, year: "1986", cat: ["manga"], desc: "The Pulitzer Prize-winning graphic novel about the Holocaust, told with Jews as mice and Nazis as cats.", lang: "English" },
  { isbn: "9780375714573", title: "Persepolis", author: "Marjane Satrapi", publisher: "Pantheon", price: 419, rating: 4.6, pages: 160, year: "2003", cat: ["manga"], desc: "A memoir-in-comics of growing up during the Iranian Revolution.", lang: "English" },
  { isbn: "9781582406725", title: "The Walking Dead, Vol. 1", author: "Robert Kirkman", publisher: "Image Comics", price: 349, rating: 4.5, pages: 144, year: "2006", cat: ["manga"], desc: "The beginning of the acclaimed zombie survival epic.", lang: "English" },
  { isbn: "9781569319000", title: "Naruto, Vol. 1", author: "Masashi Kishimoto", publisher: "VIZ Media", price: 329, rating: 4.8, pages: 192, year: "2003", cat: ["manga"], desc: "The legendary ninja manga. Uzumaki Naruto dreams of becoming the greatest Hokage.", lang: "English" },
  { isbn: "9781569319864", title: "Dragon Ball Z, Vol. 1", author: "Akira Toriyama", publisher: "VIZ Media", price: 329, rating: 4.7, pages: 192, year: "2003", cat: ["manga"], desc: "The iconic shonen manga. Goku defends Earth against ever-more-powerful foes.", lang: "English" },
  { isbn: "9781569319017", title: "One Piece, Vol. 1", author: "Eiichiro Oda", publisher: "VIZ Media", price: 329, rating: 4.9, pages: 208, year: "2003", cat: ["manga"], desc: "Monkey D. Luffy sets sail to become the King of the Pirates in the best-selling manga of all time.", lang: "English" },
  { isbn: "9781612620244", title: "Attack on Titan, Vol. 1", author: "Hajime Isayama", publisher: "Kodansha Comics", price: 339, rating: 4.7, pages: 208, year: "2012", cat: ["manga", "preorder"], desc: "Humanity lives behind giant walls to survive against man-eating Titans in this dark fantasy epic.", lang: "English" },
  { isbn: "9781421582696", title: "My Hero Academia, Vol. 1", author: "Kohei Horikoshi", publisher: "VIZ Media", price: 329, rating: 4.8, pages: 192, year: "2015", cat: ["manga"], desc: "In a world of superpowers, a quirkless boy strives to become the greatest hero.", lang: "English" },
  { isbn: "9781421580364", title: "Tokyo Ghoul, Vol. 1", author: "Sui Ishida", publisher: "VIZ Media", price: 329, rating: 4.6, pages: 224, year: "2015", cat: ["manga"], desc: "A dark horror fantasy about a college student turned half-ghoul, struggling with his new hunger.", lang: "English" },
  { isbn: "9781612624426", title: "Sailor Moon, Vol. 1", author: "Naoko Takeuchi", publisher: "Kodansha Comics", price: 329, rating: 4.8, pages: 240, year: "2011", cat: ["manga", "preorder"], desc: "The magical-girl classic. Usagi transforms into Sailor Moon to protect the world from evil.", lang: "English" },
  { isbn: "9781421580326", title: "World Trigger, Vol. 1", author: "Daisuke Ashihara", publisher: "VIZ Media", price: 329, rating: 4.5, pages: 192, year: "2014", cat: ["manga"], desc: "Earth is invaded by mysterious creatures from another dimension — defended by the Border agency.", lang: "English" },
  { isbn: "9780785187905", title: "Avengers Epic Collection", author: "Gerry Conway", publisher: "Marvel", price: 599, rating: 4.4, pages: 435, year: "2013", cat: ["manga"], desc: "Earth's Mightiest Heroes assemble in this classic Marvel collection.", lang: "English" },
  { isbn: "9780785190219", title: "Ms. Marvel, Vol. 1", author: "G. Willow Wilson", publisher: "Marvel", price: 379, rating: 4.7, pages: 120, year: "2014", cat: ["manga"], desc: "Kamala Khan, a Muslim teen from Jersey City, discovers her shape-shifting superpowers.", lang: "English" },
  // ═══════════════ HINDI LITERATURE ═══════════════
  // Real Hindi classics & modern works.

  { isbn: "9788126710111", title: "गोदान", author: "Premchand", publisher: "Rajkamal Prakashan", price: 449, rating: 4.6, pages: 480, year: "1936", cat: ["bestseller", "recommended"], lang: "Hindi", coverOlid: "OL35242671M",
    desc: "Premchand's magnum opus — a poignant story of rural India, poverty, and the quiet heroism of a farmer named Hori. Widely regarded as the first major Hindi novel of the 20th century." },
  { isbn: "9788126710128", title: "रश्मिरथी", author: "Ramdhari Singh Dinkar", publisher: "Lok Bharati Prakashan", price: 299, rating: 4.7, pages: 220, year: "1952", cat: ["recommended"], lang: "Hindi", coverOlid: "OL26799617M",
    desc: "An epic narrative poem on the life of Karna from the Mahabharata — Dinkar's ode to the unsung hero. A cornerstone of modern Hindi literature." },
  { isbn: "9788126710135", title: "गीतांजलि", author: "Rabindranath Tagore", publisher: "Sahitya Akademi", price: 249, rating: 4.8, pages: 180, year: "1910", cat: ["bestseller", "recommended"], lang: "Hindi", coverOlid: "OL5092558M",
    desc: "Tagore's Nobel-winning collection of spiritual poems, originally written in Bengali and translated across India. Verses that still move readers a century later." },
  { isbn: "9788126710142", title: "कामायनी", author: "Jaishankar Prasad", publisher: "Sahitya Akademi", price: 319, rating: 4.4, pages: 260, year: "1936", cat: ["recommended"], lang: "Hindi", coverOlid: "OL32911489M",
    desc: "A modern Hindi epic poem weaving philosophy, love, and mythology — Prasad's masterwork and one of the great landmarks of the Chhayavaad movement." },
  { isbn: "9788126710159", title: "मैला आंचल", author: "Phanishwarnath Renu", publisher: "Rajkamal Prakashan", price: 549, rating: 4.3, pages: 520, year: "1954", cat: ["recommended", "preorder"], lang: "Hindi", coverOlid: "OL32409327M",
    desc: "A vivid portrait of a Bihar village — its people, its caste divisions, and its slow awakening. Considered the first major Hindi 'Aanchalik Upanyas' (regional novel)." },
  { isbn: "9788126710166", title: "चित्रलेखा", author: "Bhagwaticharan Verma", publisher: "Sahitya Akademi", price: 299, rating: 4.2, pages: 340, year: "1934", cat: ["bestseller"], lang: "Hindi", noCover: true,
    desc: "A celebrated Hindi novel that weaves the personal and the political through the life of Chitralekha — set against the non-cooperation movement of 1921." },

  { isbn: "9788126710173", title: "तीसरी कसम", author: "Phanishwarnath Renu", publisher: "Rajkamal Prakashan", price: 199, rating: 4.5, pages: 140, year: "1959", cat: ["recommended"], lang: "Hindi", noCover: true,
    desc: "Renu's celebrated short story of a bullock-cart driver and the nautanki dancer he falls for — the basis for the iconic Shailendra film. A small, perfect gem of Hindi prose." },
  { isbn: "9788126710180", title: "निर्मला", author: "Munshi Premchand", publisher: "Saraswati Press", price: 249, rating: 4.4, pages: 220, year: "1925", cat: ["bestseller", "recommended"], lang: "Hindi", coverOlid: "OL157885M",
    desc: "Premchand's poignant novel of a young girl trapped between an abusive husband and a society that offers no escape — a landmark in the Hindi feminist novel." },
  { isbn: "9788126710197", title: "आषाढ़ का एक दिन", author: "Mohan Rakesh", publisher: "Radha Krishna Prakashan", price: 209, rating: 4.3, pages: 120, year: "1958", cat: ["recommended"], lang: "Hindi", noCover: true,
    desc: "Rakesh's landmark Hindi play that broke with stage tradition — a story of the poet Kalidasa, romantic longing, and the gulf between art and life. A turning point in modern Hindi theatre." },
  { isbn: "9788126710203", title: "अंधायुग", author: "Dharamvir Bharati", publisher: "Sahitya Akademi", price: 279, rating: 4.4, pages: 180, year: "1954", cat: ["bestseller", "recommended"], lang: "Hindi", coverOlid: "OL27674729M",
    desc: "Bharati's post-independence play set in the aftermath of the Mahabharata war — a meditation on guilt, justice, and the moral collapse that follows victory." },
  { isbn: "9788126710210", title: "मधुशाला", author: "Harivansh Rai Bachchan", publisher: "Sahitya Akademi", price: 169, rating: 4.6, pages: 96, year: "1935", cat: ["bestseller"], lang: "Hindi", coverOlid: "OL10096163M",
    desc: "Bachchan's most famous poetry collection — 135 quatrains built around the metaphor of a tavern. A best-seller in independent India and a touchstone of Hindi poetry." },
  { isbn: "9788126710227", title: "उर्वशी", author: "Ramdhari Singh Dinkar", publisher: "Lok Bharati Prakashan", price: 239, rating: 4.5, pages: 200, year: "1961", cat: ["preorder", "recommended"], lang: "Hindi", coverOlid: "OL320824M",
    desc: "Dinkar's lyrical epic — the story of the apsara Urvashi and the mortal king Pururavas, told with the grandeur of classical Hindi poetry." },
  { isbn: "9788126710234", title: "सूरज का सातवाँ घोड़ा", author: "Dharamvir Bharati", publisher: "Sahitya Akademi", price: 289, rating: 4.6, pages: 240, year: "1952", cat: ["bestseller", "recommended"], lang: "Hindi", noCover: true,
    desc: "Bharati's most celebrated novel — the seven horses of the sun are a metaphor for the seven stages of a single night in which a young man's life quietly pivots." },
  { isbn: "9788126710241", title: "झूठा सच", author: "Yashpal", publisher: "Lok Bharati Prakashan", price: 529, rating: 4.7, pages: 720, year: "1958", cat: ["preorder"], lang: "Hindi", noCover: true,
    desc: "Yashpal's sweeping novel of the Partition — millions displaced, friendships broken, and the question of what 'truth' means in the middle of a catastrophe." },

  // ═══════════════ SPANISH LITERATURE ═══════════════
  // Spanish-language classics from the Latin American & Iberian canon.

  { isbn: "9780307474728", title: "Cien años de soledad", author: "Gabriel García Márquez", publisher: "Editorial Sudamericana", price: 579, rating: 4.8, pages: 480, year: "1967", cat: ["bestseller", "recommended"], lang: "Spanish",
    desc: "The multi-generational saga of the Buendía family in the fictional town of Macondo — García Márquez's masterpiece and a cornerstone of magical realism." },
  { isbn: "9780060934347", title: "Don Quijote", author: "Miguel de Cervantes", publisher: "Francisco de Robles", price: 749, rating: 4.6, pages: 960, year: "1605", cat: ["recommended"], lang: "Spanish",
    desc: "The adventures of the self-styled knight Don Quixote and his squire Sancho Panza — widely regarded as the first modern novel and a founding text of Western literature." },
  { isbn: "9780394752846", title: "Veinte poemas de amor y una canción desesperada", author: "Pablo Neruda", publisher: "Editorial Nascimento", price: 219, rating: 4.7, pages: 140, year: "1924", cat: ["bestseller", "recommended"], lang: "Spanish",
    desc: "Neruda's most beloved poetry collection — twenty love poems and one song of despair that helped earn him the Nobel Prize in Literature." },
  { isbn: "9781501117015", title: "La casa de los espíritus", author: "Isabel Allende", publisher: "Editorial Plaza & Janés", price: 469, rating: 4.5, pages: 480, year: "1982", cat: ["recommended", "preorder"], lang: "Spanish",
    desc: "Allende's debut novel — three generations of the Trueba family unfold against the backdrop of Chile's political upheavals in the 20th century." },
  { isbn: "9780307389732", title: "El amor en los tiempos del cólera", author: "Gabriel García Márquez", publisher: "Editorial Oveja Negra", price: 399, rating: 4.4, pages: 348, year: "1985", cat: ["bestseller"], lang: "Spanish",
    desc: "A love story that spans fifty-one years, nine months, and four days — García Márquez's tender meditation on aging, memory, and devotion." },
  { isbn: "9781400034956", title: "Crónica de una muerte anunciada", author: "Gabriel García Márquez", publisher: "Editorial Oveja Negra", price: 249, rating: 4.5, pages: 120, year: "1981", cat: ["bestseller", "recommended"], lang: "Spanish",
    desc: "A novella told with the precision of a journalism investigation — everyone knew the murder was coming, yet no one stopped it. A short, devastating classic." },

  { isbn: "9780143126393", title: "La sombra del viento", author: "Carlos Ruiz Zafón", publisher: "Editorial Planeta", price: 529, rating: 4.7, pages: 480, year: "2001", cat: ["bestseller", "recommended"], lang: "Spanish",
    desc: "Zafón's Barcelona-set mystery — a boy discovers a forgotten book in the Cemetery of Forgotten Books and is drawn into a decades-old secret. The first volume of 'El cementerio de los libros olvidados'." },
  { isbn: "9780802133908", title: "Pedro Páramo", author: "Juan Rulfo", publisher: "Fondo de Cultura Económica", price: 289, rating: 4.5, pages: 132, year: "1955", cat: ["recommended"], lang: "Spanish",
    desc: "Rulfo's short, hallucinatory novel of a man searching for his father in the ghost-town of Comala — the book that redefined what Latin American fiction could be." },
  { isbn: "9780060916312", title: "Rayuela", author: "Julio Cortázar", publisher: "Sudamericana", price: 629, rating: 4.4, pages: 736, year: "1963", cat: ["bestseller", "recommended"], lang: "Spanish", coverOlid: "OL2980196M",
    desc: "Cortázar's experimental masterpiece — a novel you can read in two orders, with chapters that can be skipped, shuffled, or followed to two distinct endings. Pure literary play." },
  { isbn: "9780802130303", title: "Ficciones", author: "Jorge Luis Borges", publisher: "Emecé Editores", price: 399, rating: 4.8, pages: 224, year: "1944", cat: ["recommended"], lang: "Spanish",
    desc: "Borges's classic short-story collection — labyrinths, mirrors, infinite libraries, and the philosophical fictions that reshaped 20th-century literature." },
  { isbn: "9780385474017", title: "Como agua para chocolate", author: "Laura Esquivel", publisher: "Editorial Planeta", price: 469, rating: 4.3, pages: 256, year: "1989", cat: ["bestseller"], lang: "Spanish", coverOlid: "OL24974997M",
    desc: "Esquivel's magical-realist novel of food and passion — each chapter is a recipe, each recipe a story, set on the Mexican border at the turn of the 20th century." },
  { isbn: "9780143105558", title: "El túnel", author: "Ernesto Sábato", publisher: "Editorial Sur", price: 299, rating: 4.2, pages: 160, year: "1948", cat: ["preorder", "recommended"], lang: "Spanish",
    desc: "Sábato's existential thriller — a painter confesses to a murder he both did and did not commit. A short, claustrophobic classic of Latin American letters." },
  { isbn: "9780330418806", title: "Los detectives salvajes", author: "Roberto Bolaño", publisher: "Anagrama", price: 579, rating: 4.6, pages: 624, year: "1998", cat: ["bestseller", "recommended"], lang: "Spanish", coverOlid: "OL84382M",
    desc: "Bolaño's sprawling novel of two poets in search of a vanished Mexican writer — a picaresque, heartbreaking ode to youth, literature, and the long aftermath of the avant-garde." },
  { isbn: "9788490621873", title: "La fiesta del chivo", author: "Mario Vargas Llosa", publisher: "Alfaguara", price: 499, rating: 4.5, pages: 528, year: "2000", cat: ["bestseller"], lang: "Spanish", coverOlid: "OL9133932M",
    desc: "Vargas Llosa's novel of the Trujillo dictatorship in the Dominican Republic — a reconstruction of power, terror, and a dictator's final afternoon." },

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
  coverImage: coverFor(c),
  status: "Approved",
  createdAt: "2026-06-01T09:00:00.000Z",
  reviewedAt: "2026-06-02T09:00:00.000Z",
  categories: c.cat,
  rating: c.rating,
  pageCount: c.pages,
  publishedDate: c.year,
  language: c.lang || "English",
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
