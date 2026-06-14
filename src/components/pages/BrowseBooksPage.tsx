import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import type { Book } from "@/types";
import {
  fetchBestSellers,
  fetchMangaBooks,
  fetchAiBooks,
  fetchRecommendedBooks,
  fetchPreOrderBooks,
} from "@/services/bookStoreApi";

interface BrowseBooksPageProps {
  onNavigateHome: () => void;
}

export default function BrowseBooksPage({ onNavigateHome }: BrowseBooksPageProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const [best, manga, ai, recommended, preorder] = await Promise.all([
          fetchBestSellers(),
          fetchMangaBooks(),
          fetchAiBooks(),
          fetchRecommendedBooks(),
          fetchPreOrderBooks(),
        ]);
        
        // Combine and deduplicate by ID just in case
        const allBooks = [...best, ...manga, ...ai, ...recommended, ...preorder];
        const uniqueBooks = Array.from(new Map(allBooks.map(b => [b.id, b])).values());
        
        setBooks(uniqueBooks);
      } catch (error) {
        console.error("Failed to load books:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={onNavigateHome}
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-amber-900 transition hover:text-amber-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Browse All Books
            </h1>
            <p className="mt-2 text-slate-600">
              Discover your next great read from our entire collection.
            </p>
          </div>
          
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:gap-6">
            {paginatedBooks.map((book) => (
              <div key={book.id} className="mx-auto w-full max-w-[220px] group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md border border-slate-100">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${book.coverColor || "from-slate-200 to-slate-300"} flex items-center justify-center p-4`}>
                      <BookOpen className="h-12 w-12 text-white/50" />
                    </div>
                  )}
                  {book.badge && (
                    <div className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${book.badgeColor || "bg-amber-500"}`}>
                      {book.badge}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-amber-700">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{book.author}</p>
                  <div className="mt-auto pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900">₹{book.price}</span>
                      {(book.originalPrice || book.oldPrice) && (
                        <span className="text-xs font-semibold text-slate-400 line-through">
                          ₹{book.originalPrice || book.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && !isLoading && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <div className="text-sm font-semibold text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {!isLoading && filteredBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-slate-100 p-6">
              <BookOpen className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">No books found</h3>
            <p className="mt-2 text-slate-500">We couldn't find any books matching your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}
