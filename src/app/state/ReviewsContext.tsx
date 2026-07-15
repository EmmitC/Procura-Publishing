import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import type { Review, ReviewStatus } from './types';

interface SubmitReviewInput {
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  verifiedPurchase: boolean;
}

interface ReviewsContextValue {
  reviews: Review[];
  submitReview: (input: SubmitReviewInput) => void;
  setReviewStatus: (id: string, status: ReviewStatus) => void;
  deleteReview: (id: string) => void;
  approvedReviewsForBook: (bookId: string) => Review[];
  myReviewForBook: (bookId: string, userId: string) => Review | undefined;
}

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useLocalStorageState<Review[]>('procura_reviews', []);

  const value = useMemo<ReviewsContextValue>(() => ({
    reviews,
    submitReview: (input) => {
      const existing = reviews.find((r) => r.bookId === input.bookId && r.userId === input.userId);
      if (existing) {
        setReviews(reviews.map((r) =>
          r.id === existing.id
            ? { ...r, rating: input.rating, text: input.text, verifiedPurchase: input.verifiedPurchase, status: 'pending', createdAt: new Date().toISOString() }
            : r
        ));
        return;
      }
      const review: Review = {
        id: `REV-${Date.now().toString(36).toUpperCase().slice(-8)}`,
        bookId: input.bookId,
        userId: input.userId,
        userName: input.userName,
        rating: input.rating,
        text: input.text,
        verifiedPurchase: input.verifiedPurchase,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setReviews([review, ...reviews]);
    },
    setReviewStatus: (id, status) => setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r))),
    deleteReview: (id) => setReviews(reviews.filter((r) => r.id !== id)),
    approvedReviewsForBook: (bookId) =>
      reviews.filter((r) => r.bookId === bookId && r.status === 'approved').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    myReviewForBook: (bookId, userId) => reviews.find((r) => r.bookId === bookId && r.userId === userId),
  }), [reviews, setReviews]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
}
