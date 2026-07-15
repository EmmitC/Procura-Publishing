import { Check, X, Star, Trash2, UserCheck } from 'lucide-react';
import { useCatalog } from '../../state/CatalogContext';
import { useReviews } from '../../state/ReviewsContext';
import { useAuth } from '../../state/AuthContext';

export function AdminReviews() {
  const { getBook } = useCatalog();
  const { reviews, setReviewStatus, deleteReview } = useReviews();
  const { users } = useAuth();

  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs tracking-wider uppercase text-muted-foreground">
            <th className="text-left p-4">Book</th>
            <th className="text-left p-4">Reviewer</th>
            <th className="text-left p-4">Rating</th>
            <th className="text-left p-4">Review</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">No reviews yet</td>
            </tr>
          )}
          {reviews.map((review) => {
            const book = getBook(review.bookId);
            const account = users.find((u) => u.id === review.userId);
            return (
              <tr key={review.id} className="border-b border-border last:border-b-0 align-top">
                <td className="p-4 text-secondary">{book?.title ?? 'Unknown title'}</td>
                <td className="p-4 text-muted-foreground">
                  <p className="text-secondary">{review.userName}</p>
                  {account?.email && <p className="text-xs text-muted-foreground/70">{account.email}</p>}
                  <span className="flex items-center gap-1 text-[10px] tracking-wider uppercase text-primary mt-1">
                    <UserCheck className="h-3 w-3" strokeWidth={1.5} /> Registered Account
                  </span>
                  {review.verifiedPurchase && (
                    <span className="block text-[10px] tracking-wider uppercase text-primary mt-1">Verified Purchase</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                </td>
                <td className="p-4 text-muted-foreground max-w-xs">{review.text || <span className="text-muted-foreground/50">—</span>}</td>
                <td className="p-4">
                  <span
                    className={`text-xs tracking-wider uppercase ${
                      review.status === 'approved'
                        ? 'text-secondary'
                        : review.status === 'rejected'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {review.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setReviewStatus(review.id, 'approved')}
                      className="p-1.5 text-muted-foreground hover:text-secondary transition-colors"
                      aria-label="Approve review"
                    >
                      <Check className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setReviewStatus(review.id, 'rejected')}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Reject review"
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Delete review"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
