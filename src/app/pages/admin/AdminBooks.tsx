import { useRef, useState } from 'react';
import { Plus, Trash2, Upload, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import { useCatalog } from '../../state/CatalogContext';
import { readImageFile } from '../../lib/imageUpload';
import type { Book } from '../../state/types';

const emptyNewBook = {
  title: '',
  author: '',
  genre: '',
  year: new Date().getFullYear().toString(),
  image: '',
  description: '',
  digitalPrice: '',
  physicalPrice: '',
  physicalStock: '',
};

export function AdminBooks() {
  const { books, updateBook, addBook, deleteBook } = useCatalog();
  const [newBook, setNewBook] = useState(emptyNewBook);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.digitalPrice) return;
    const book: Book = {
      id: `${newBook.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`,
      title: newBook.title,
      author: newBook.author,
      genre: newBook.genre || 'Uncategorized',
      year: Number(newBook.year) || new Date().getFullYear(),
      rating: 0,
      description: newBook.description,
      summary: newBook.description,
      image: newBook.image || 'https://images.unsplash.com/photo-1648536524290-590fb42a04aa?fit=max&fm=jpg&w=1080',
      formats: {
        digital: { price: Number(newBook.digitalPrice) },
        ...(newBook.physicalPrice
          ? { physical: { price: Number(newBook.physicalPrice), stock: Number(newBook.physicalStock) || 0 } }
          : {}),
      },
    };
    addBook(book);
    setNewBook(emptyNewBook);
    if (coverInputRef.current) coverInputRef.current.value = '';
    toast.success('Book added', { description: book.title });
  };

  const handleNewBookCoverUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      setNewBook((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      toast.error('Upload failed', { description: (err as Error).message });
    }
  };

  const handleExistingCoverUpload = async (bookId: string, file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      updateBook(bookId, { image: dataUrl });
      toast.success('Cover updated');
    } catch (err) {
      toast.error('Upload failed', { description: (err as Error).message });
    }
  };

  const handleDeleteBook = (book: Book) => {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    deleteBook(book.id);
    toast.success('Book deleted', { description: book.title });
  };

  return (
    <div className="space-y-16">
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wider uppercase text-muted-foreground">
              <th className="text-left p-4">Cover</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Author</th>
              <th className="text-left p-4">Digital Price</th>
              <th className="text-left p-4">Physical Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-border last:border-b-0">
                <td className="p-4">
                  <label className="relative block w-12 h-16 bg-card border border-border cursor-pointer group overflow-hidden">
                    {book.image ? (
                      <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageOff className="absolute inset-0 m-auto h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    )}
                    <span className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/60 transition-colors flex items-center justify-center">
                      <Upload className="h-3.5 w-3.5 text-background opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleExistingCoverUpload(book.id, e.target.files?.[0])}
                    />
                  </label>
                </td>
                <td className="p-4 text-secondary">{book.title}</td>
                <td className="p-4 text-muted-foreground">{book.author}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={book.formats.digital?.price ?? ''}
                      onChange={(e) =>
                        updateBook(book.id, {
                          formats: { ...book.formats, digital: { price: Number(e.target.value) } },
                        })
                      }
                      className="w-20 border border-border bg-card px-2 py-1 text-secondary focus:outline-none focus:border-secondary"
                    />
                  </div>
                </td>
                <td className="p-4">
                  {book.formats.physical ? (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={book.formats.physical.price}
                        onChange={(e) =>
                          updateBook(book.id, {
                            formats: {
                              ...book.formats,
                              physical: { ...book.formats.physical!, price: Number(e.target.value) },
                            },
                          })
                        }
                        className="w-20 border border-border bg-card px-2 py-1 text-secondary focus:outline-none focus:border-secondary"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground/50 text-xs">Digital only</span>
                  )}
                </td>
                <td className="p-4">
                  {book.formats.physical ? (
                    <input
                      type="number"
                      value={book.formats.physical.stock}
                      onChange={(e) =>
                        updateBook(book.id, {
                          formats: {
                            ...book.formats,
                            physical: { ...book.formats.physical!, stock: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-20 border border-border bg-card px-2 py-1 text-secondary focus:outline-none focus:border-secondary"
                    />
                  ) : (
                    <span className="text-muted-foreground/50 text-xs">—</span>
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteBook(book)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Delete ${book.title}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border border-border p-8 max-w-3xl">
        <p className="text-xs tracking-wider uppercase text-muted-foreground mb-8">Add New Book</p>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <input
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
          />
          <input
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
          />
          <input
            placeholder="Genre"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
          />
          <input
            placeholder="Year"
            type="number"
            value={newBook.year}
            onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
            className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
          />
          <input
            placeholder="Digital Price"
            type="number"
            step="0.01"
            value={newBook.digitalPrice}
            onChange={(e) => setNewBook({ ...newBook, digitalPrice: e.target.value })}
            className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
          />
          <input
            placeholder="Physical Price (optional)"
            type="number"
            step="0.01"
            value={newBook.physicalPrice}
            onChange={(e) => setNewBook({ ...newBook, physicalPrice: e.target.value })}
            className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
          />
          <input
            placeholder="Physical Stock"
            type="number"
            value={newBook.physicalStock}
            onChange={(e) => setNewBook({ ...newBook, physicalStock: e.target.value })}
            className="border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-3">Description</label>
          <textarea
            placeholder="What is this book about?"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            rows={4}
            className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs tracking-wider uppercase text-muted-foreground mb-3">Cover Image</label>
          <div className="flex items-start gap-5">
            <div className="w-20 h-28 shrink-0 bg-card border border-border overflow-hidden flex items-center justify-center">
              {newBook.image ? (
                <img src={newBook.image} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-border text-secondary text-xs tracking-wider uppercase cursor-pointer hover:border-secondary transition-colors">
                <Upload className="h-3.5 w-3.5" strokeWidth={1.5} />
                Upload Image
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleNewBookCoverUpload(e.target.files?.[0])}
                />
              </label>
              <p className="text-[10px] text-muted-foreground">JPG or PNG, up to 2MB. Or paste an image URL below.</p>
              <input
                placeholder="Image URL (optional)"
                value={newBook.image.startsWith('data:') ? '' : newBook.image}
                onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
                className="w-full border border-border bg-card px-4 py-3 text-secondary placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAddBook}
          disabled={!newBook.title || !newBook.author || !newBook.digitalPrice}
          className="px-8 py-3 bg-secondary text-background text-sm tracking-wider uppercase flex items-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} /> Add Book
        </button>
      </div>
    </div>
  );
}
