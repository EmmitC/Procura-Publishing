export type FormatType = 'digital' | 'physical';

export interface BookFormats {
  digital?: { price: number };
  physical?: { price: number; stock: number };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  rating: number;
  description: string;
  summary: string;
  image: string;
  formats: BookFormats;
}

export interface CartItem {
  bookId: string;
  format: FormatType;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

export type PhysicalStatus = 'Processing' | 'Shipped' | 'Delivered';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'visa' | 'mastercard' | 'bank';

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  format: FormatType;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  digitalUnlocked: boolean;
  physical: {
    hasPhysical: boolean;
    status: PhysicalStatus;
    trackingNumber: string | null;
  };
  refund?: {
    reason: string;
    refundedAt: string;
  };
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  verifiedPurchase: boolean;
  status: ReviewStatus;
  createdAt: string;
}

export type PersonType = 'author' | 'team';

export interface Person {
  id: string;
  type: PersonType;
  name: string;
  title: string;
  recognition: string;
  bio: string;
  image: string;
}

export type MessageSubject = 'manuscript' | 'rights' | 'general' | 'media' | 'other';

export interface ContactMessage {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  subject: MessageSubject;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SiteSettings {
  location: string;
  phone: string;
  primaryEmail: string;
  secondaryEmail: string;
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}
