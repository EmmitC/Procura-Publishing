import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import type { ContactMessage, MessageSubject } from './types';

interface SubmitMessageInput {
  userId: string | null;
  name: string;
  email: string;
  subject: MessageSubject;
  message: string;
}

interface MessagesContextValue {
  messages: ContactMessage[];
  unreadCount: number;
  submitMessage: (input: SubmitMessageInput) => void;
  markRead: (id: string) => void;
  deleteMessage: (id: string) => void;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useLocalStorageState<ContactMessage[]>('procura_messages', []);

  const value = useMemo<MessagesContextValue>(() => ({
    messages,
    unreadCount: messages.filter((m) => !m.read).length,
    submitMessage: (input) => {
      const message: ContactMessage = {
        id: `MSG-${Date.now().toString(36).toUpperCase().slice(-8)}`,
        userId: input.userId,
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setMessages([message, ...messages]);
    },
    markRead: (id) => setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m))),
    deleteMessage: (id) => setMessages(messages.filter((m) => m.id !== id)),
  }), [messages, setMessages]);

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider');
  return ctx;
}
