import { useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface BookModalProps {
  book: Book;
  onClose: () => void;
}

export function BookModal({ book, onClose }: BookModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-background max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-secondary transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </button>

        <div className="grid md:grid-cols-5 gap-0">
          {/* Book Image */}
          <div className="md:col-span-2 aspect-[3/4] md:aspect-auto md:min-h-[600px]">
            <ImageWithFallback
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover grayscale"
            />
          </div>

          {/* Book Details */}
          <div className="md:col-span-3 p-12">
            <div className="mb-8">
              <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">
                {book.genre} • {book.year}
              </p>
              <h2 className="text-4xl md:text-5xl mb-4 text-secondary leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {book.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">by {book.author}</p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => {
                    const filled = i < Math.floor(book.rating);
                    const partial = i === Math.floor(book.rating) && book.rating % 1 !== 0;

                    return (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          filled
                            ? 'fill-primary text-primary'
                            : partial
                            ? 'fill-primary/50 text-primary'
                            : 'text-muted-foreground/30'
                        }`}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </div>
                <span className="text-sm text-muted-foreground">
                  {book.rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm tracking-wider uppercase text-muted-foreground mb-4">
                About This Book
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {book.summary}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase">
                Add to Collection
              </button>
              <button className="px-8 py-4 border border-border text-secondary hover:bg-card transition-colors text-sm tracking-wider uppercase">
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
