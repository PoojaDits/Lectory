"use client"

import { useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import BookCard from "./BookCard"
import type { BookWithListings } from "@/types"
import { cn } from "@/utils/cn"

interface BookCarouselProps {
  books: BookWithListings[]
  className?: string
}

export default function BookCarousel({ books, className }: BookCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)
  const moved = useRef(false)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.min(320, el.clientWidth * 0.85)
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
    setTimeout(updateArrows, 350)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current
    if (!el) return
    isDown.current = true
    moved.current = false
    startX.current = e.clientX
    scrollStart.current = el.scrollLeft
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDown.current) return
    const el = scrollerRef.current
    if (!el) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 3) moved.current = true
    el.scrollLeft = scrollStart.current - dx
    updateArrows()
  }

  const endDrag = () => {
    isDown.current = false
    // keep moved=true briefly so the following click is suppressed
    setTimeout(() => { moved.current = false }, 50)
    updateArrows()
  }

  // Suppress BookCard Link clicks if we just dragged
  const onClickCapture = (e: React.MouseEvent) => {
    if (moved.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  if (!books?.length) return null

  return (
    <div className={cn("relative", className)}>
      {/* Desktop arrows - floating over the edges */}
      <button
        type="button"
        onClick={() => scroll("left")}
        disabled={!canLeft}
        aria-label="Previous"
        className="hidden md:flex absolute left-0 top-[170px] -translate-x-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/95 backdrop-blur border border-primary-200 text-primary-700 shadow-lg hover:bg-primary-50 disabled:opacity-0 disabled:pointer-events-none transition"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        disabled={!canRight}
        aria-label="Next"
        className="hidden md:flex absolute right-0 top-[170px] translate-x-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/95 backdrop-blur border border-primary-200 text-primary-700 shadow-lg hover:bg-primary-50 disabled:opacity-0 disabled:pointer-events-none transition"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onScroll={updateArrows}
        className="flex snap-x snap-mandatory gap-3 sm:gap-4 md:gap-5 overflow-x-auto scroll-smooth pb-4 cursor-grab active:cursor-grabbing touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none"
        style={{ WebkitOverflowScrolling: 'touch' as any }}
      >
        {books.map((book) => (
          <div
            key={String(book.id)}
            className="snap-start shrink-0 w-[78vw] max-w-[280px] xs:w-[240px] sm:w-[260px] md:w-[270px]"
          >
            <div className="h-[420px]">
              <BookCard book={book} className="h-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile arrows */}
    <div className="w-full flex items-center justify-center gap-3 mt-2 md:hidden">
  <button
    type="button"
    onClick={() => scroll("left")}
    disabled={!canLeft}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-950 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
    aria-label="Previous books"
  >
    <ChevronLeft className="h-5 w-5" />
  </button>

  <button
    type="button"
    onClick={() => scroll("right")}
    disabled={!canRight}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-950 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
    aria-label="Next books"
  >
    <ChevronRight className="h-5 w-5" />
  </button>
</div>
    </div>
  )
}
