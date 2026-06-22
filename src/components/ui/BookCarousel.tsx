"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import BookCard from "./BookCard"
import type { BookWithListings } from "@/types"

interface BookCarouselProps {
  books: BookWithListings[]
  className?: string
}

export default function BookCarousel({ books, className }: BookCarouselProps) {
  if (!books?.length) return null

  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
        dragFree: true,
        containScroll: "trimSnaps",
      }}
      className={className}
    >
      <CarouselContent className="-ml-4">
        {books.map((book) => (
          <CarouselItem
            key={String(book.id)}
            className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/5"
          >
            {/* Fixed height wrapper so all cards are perfectly uniform (taller = bigger cards) */}
            <div className="h-[420px]">
              <BookCard book={book} className="h-full" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* shadcn/ui arrows - styled to match your aesthetic */}
      <CarouselPrevious className="hidden md:flex -left-3 md:-left-5 bg-white/95 backdrop-blur border-primary-200 hover:bg-primary-50 hover:text-primary-700" />
      <CarouselNext className="hidden md:flex -right-3 md:-right-5 bg-white/95 backdrop-blur border-primary-200 hover:bg-primary-50 hover:text-primary-700" />
    </Carousel>
  )
}

