import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import booksData from '../../data/books.json';
import type { Book } from './types';

interface CatalogContextValue {
  books: Book[];
  getBook: (id: string) => Book | undefined;
  updateBook: (id: string, patch: Partial<Book>) => void;
  addBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  decrementPhysicalStock: (id: string, quantity: number) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useLocalStorageState<Book[]>('procura_catalog', booksData as Book[]);

  const value = useMemo<CatalogContextValue>(() => ({
    books,
    getBook: (id) => books.find((b) => b.id === id),
    updateBook: (id, patch) => setBooks(books.map((b) => (b.id === id ? { ...b, ...patch } : b))),
    addBook: (book) => setBooks([...books, book]),
    deleteBook: (id) => setBooks(books.filter((b) => b.id !== id)),
    decrementPhysicalStock: (id, quantity) =>
      setBooks(books.map((b) => {
        if (b.id !== id || !b.formats.physical) return b;
        const nextStock = Math.max(0, b.formats.physical.stock - quantity);
        return { ...b, formats: { ...b.formats, physical: { ...b.formats.physical, stock: nextStock } } };
      })),
  }), [books, setBooks]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
