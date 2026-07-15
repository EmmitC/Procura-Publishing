import { Navigate, Link } from 'react-router';
import { Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../state/AuthContext';
import { useWishlist } from '../state/WishlistContext';
import { useCatalog } from '../state/CatalogContext';
import { useCart } from '../state/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Wishlist() {
  const { user } = useAuth();
  const { wishlistFor, toggle } = useWishlist();
  const { getBook } = useCatalog();
  const { addItem } = useCart();

  if (!user) {
    return <Navigate to="/login" state={{ redirectTo: '/wishlist' }} replace />;
  }

  const books = wishlistFor(user.id)
    .map((id) => getBook(id))
    .filter((b): b is NonNullable<typeof b> => !!b);

  const handleAddToCart = (bookId: string, title: string) => {
    const book = getBook(bookId);
    const format = book?.formats.digital ? 'digital' : 'physical';
    addItem(bookId, format, 1);
    toast.success('Added to cart', { description: title });
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-5xl mx-auto px-6 lg:px-12 py-24">
        <div className="mb-16">
          <p className="text-sm tracking-wider uppercase text-muted-foreground mb-4">Saved for Later</p>
          <h1 className="text-5xl md:text-6xl text-secondary leading-[0.95]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            My Wishlist
          </h1>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-32 border border-border">
            <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-6" strokeWidth={1.5} />
            <p className="text-muted-foreground mb-8">Your wishlist is empty</p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-background hover:bg-primary transition-colors text-sm tracking-wider uppercase"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {books.map((book) => (
              <div key={book.id} className="flex gap-6 border border-border p-6">
                <div className="w-20 h-28 shrink-0 bg-card overflow-hidden">
                  <ImageWithFallback src={book.image} alt={book.title} className="w-full h-full object-cover grayscale" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl text-secondary" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{book.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => handleAddToCart(book.id, book.title)}
                      className="flex items-center gap-2 text-xs tracking-wider uppercase text-secondary border border-border px-4 py-2 hover:border-secondary transition-colors"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} /> Add to Cart
                    </button>
                    <button
                      onClick={() => toggle(user.id, book.id)}
                      className="text-xs tracking-wider uppercase text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
