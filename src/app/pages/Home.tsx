import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
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

export function Home() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const books: Book[] = booksData;
  const featuredBooks = books.slice(0, 3);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="max-w-4xl">
            <h1 className="text-7xl md:text-8xl lg:text-9xl mb-8 text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Where Stories<br />Find Souls
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl leading-relaxed">
              A literary curator dedicated to creating lasting connections between exceptional narratives and discerning readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase"
              >
                Get Started
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-border text-secondary hover:bg-card transition-colors text-sm tracking-wider uppercase"
              >
                Explore Publications
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Statement */}
      <section className="border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">About DOMINARI</p>
              <h2 className="text-4xl md:text-5xl mb-6 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Literary Curation, Not Mass Production
              </h2>
            </div>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2019, DOMINARI emerged to solve a problem: remarkable manuscripts were disappearing into the noise of mass publishing. Readers couldn't find their next obsession. Authors felt disconnected from their audience.
              </p>
              <p>
                We operate as a literary curator—choosing every book for its craft, originality, and power to transform. Not its commercial potential alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-20">
            <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Featured Works</p>
            <h2 className="text-5xl md:text-6xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Latest Publications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative mb-6 overflow-hidden aspect-[3/4] bg-card">
                  <ImageWithFallback
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl mb-2 text-secondary group-hover:text-primary transition-colors" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-3 text-secondary hover:text-primary transition-colors group text-sm tracking-wider uppercase"
            >
              View Complete Catalog
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <h3 className="text-2xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Curation
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every manuscript undergoes rigorous evaluation. We publish only works that demonstrate craft, originality, and emotional resonance.
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Partnership
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Collaborative relationships built on transparency. We support authors throughout their creative journey, not just at publication.
              </p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Connection
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Strategic positioning ensures our titles reach the readers who will value them most—building communities around stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl mb-8 text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Have a Story That Matters?
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            We seek manuscripts that move, challenge, and transform. Stories chosen for their craft and cultural resonance, not commercial trends.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase"
          >
            Submit Your Work
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
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
