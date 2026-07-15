import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Star, BookOpen, Package, Heart, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../state/CartContext';
import { useAuth } from '../state/AuthContext';
import { useWishlist } from '../state/WishlistContext';
import { useReviews } from '../state/ReviewsContext';
import { useOrders } from '../state/OrdersContext';
import type { Book, FormatType } from '../state/types';

interface BookModalProps {
  book: Book;
  onClose: () => void;
}

export function BookModal({ book, onClose }: BookModalProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isSaved, toggle } = useWishlist();
  const { approvedReviewsForBook, myReviewForBook, submitReview } = useReviews();
  const { hasPurchased } = useOrders();
  const { digital, physical } = book.formats;
  const [format, setFormat] = useState<FormatType>(digital ? 'digital' : 'physical');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

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

  const outOfStock = format === 'physical' && (physical?.stock ?? 0) <= 0;
  const price = format === 'digital' ? digital?.price : physical?.price;
  const saved = user ? isSaved(user.id, book.id) : false;
  const verifiedPurchase = user ? hasPurchased(user.id, book.id) : false;
  const approvedReviews = approvedReviewsForBook(book.id);
  const myReview = user ? myReviewForBook(book.id, user.id) : undefined;

  useEffect(() => {
    if (myReview) {
      setReviewRating(myReview.rating);
      setReviewText(myReview.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id]);

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(book.id, format, 1);
    toast.success(`Added to cart`, {
      description: `${book.title} — ${format === 'digital' ? 'Digital Edition' : 'Physical Copy'}`,
    });
  };

  const handleToggleWishlist = () => {
    if (!user) {
      onClose();
      navigate('/login', { state: { redirectTo: '/catalog' } });
      return;
    }
    toggle(user.id, book.id);
    toast.success(saved ? 'Removed from wishlist' : 'Saved to wishlist', { description: book.title });
  };

  const handleSubmitReview = () => {
    if (!user) return;
    if (reviewRating < 1) {
      toast.error('Please select a star rating.');
      return;
    }
    submitReview({
      bookId: book.id,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      text: reviewText,
      verifiedPurchase,
    });
    toast.success('Review submitted', { description: 'Thanks! Your review will appear after moderation.' });
  };

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

        <button
          onClick={handleToggleWishlist}
          className="absolute top-6 right-16 p-2 text-muted-foreground hover:text-secondary transition-colors z-10"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`h-5 w-5 ${saved ? 'fill-primary text-primary' : ''}`} strokeWidth={1.5} />
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

            {/* Format selection */}
            <div className="mb-8">
              <h3 className="text-sm tracking-wider uppercase text-muted-foreground mb-4">
                Choose a Format
              </h3>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {digital && (
                  <button
                    onClick={() => setFormat('digital')}
                    className={`border p-4 text-left transition-all ${
                      format === 'digital' ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/40'
                    }`}
                  >
                    <BookOpen className="h-4 w-4 text-secondary mb-2" strokeWidth={1.5} />
                    <p className="text-xs text-secondary">Digital</p>
                    <p className="text-sm text-secondary mt-1">${digital.price.toFixed(2)}</p>
                  </button>
                )}
                {physical && (
                  <button
                    onClick={() => setFormat('physical')}
                    className={`border p-4 text-left transition-all ${
                      format === 'physical' ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/40'
                    }`}
                  >
                    <Package className="h-4 w-4 text-secondary mb-2" strokeWidth={1.5} />
                    <p className="text-xs text-secondary">Physical</p>
                    <p className="text-sm text-secondary mt-1">${physical.price.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {physical.stock > 0 ? `${physical.stock} in stock` : 'Out of stock'}
                    </p>
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock || !price}
                className="px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {outOfStock ? 'Out of Stock' : `Add to Cart — $${price?.toFixed(2)}`}
              </button>
            </div>

            {/* Reviews */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-sm tracking-wider uppercase text-muted-foreground mb-6">
                Reviews {approvedReviews.length > 0 && `(${approvedReviews.length})`}
              </h3>

              {approvedReviews.length === 0 ? (
                <p className="text-sm text-muted-foreground mb-8">No reviews yet. Be the first to share your thoughts.</p>
              ) : (
                <div className="space-y-6 mb-8">
                  {approvedReviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-secondary">{review.userName}</span>
                        {review.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-primary">
                            <BadgeCheck className="h-3 w-3" strokeWidth={1.5} /> Verified Purchase
                          </span>
                        )}
                      </div>
                      {review.text && <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>}
                    </div>
                  ))}
                </div>
              )}

              {user ? (
                <div className="space-y-4">
                  <p className="text-xs tracking-wider uppercase text-muted-foreground">
                    {myReview ? 'Update Your Review' : 'Write a Review'}
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button key={i} onClick={() => setReviewRating(i + 1)} aria-label={`Rate ${i + 1} stars`}>
                        <Star
                          className={`h-5 w-5 ${i < reviewRating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts on this book..."
                    rows={3}
                    className="w-full border border-border bg-card px-4 py-3 text-sm text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary transition-colors resize-none"
                  />
                  <button
                    onClick={handleSubmitReview}
                    className="px-6 py-3 border border-border text-secondary text-xs tracking-wider uppercase hover:border-secondary transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  <button
                    onClick={() => { onClose(); navigate('/login', { state: { redirectTo: '/catalog' } }); }}
                    className="text-secondary underline underline-offset-4"
                  >
                    Sign in
                  </button>{' '}
                  to leave a review.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
