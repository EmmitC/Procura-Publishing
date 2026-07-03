import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BookModal } from '../components/BookModal';
import booksData from '../../data/books.json';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  rating: number;
  description: string;
  summary: string;
  image: string;
}

export function Catalog() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const genres = ['All', 'Mystery & Thriller', 'Science Fiction', 'Literary Fiction', 'Historical Fiction', 'Romance', 'Non-Fiction'];

  const books: Book[] = booksData;

  const filteredBooks = books.filter(book => {
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesGenre;
  });

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="max-w-5xl mb-16">
            <p className="text-sm tracking-wider uppercase text-muted-foreground mb-6">Complete Catalog</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl mb-12 text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Curated Works
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Every title selected for its literary merit, cultural resonance, and power to create lasting connections with readers.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-2 text-sm tracking-wider uppercase transition-colors ${
                  selectedGenre === genre
                    ? 'text-secondary border-b border-secondary'
                    : 'text-muted-foreground hover:text-secondary'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'title' : 'titles'}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {filteredBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedBook(book)}
                >
                  <div className="relative mb-6 overflow-hidden aspect-[3/4] bg-card">
                    <ImageWithFallback
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl text-secondary group-hover:text-primary transition-colors" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <p className="text-xs text-muted-foreground/60">{book.year}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No titles match your selection</p>
            </div>
          )}
        </div>
      </section>

      {/* Book Modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
