import { useState } from 'react';
import { Trash2, Circle, CheckCircle2, Mail, UserCheck, UserRound } from 'lucide-react';
import { useMessages } from '../../state/MessagesContext';
import { useAuth } from '../../state/AuthContext';
import type { ContactMessage, MessageSubject } from '../../state/types';

const SUBJECT_LABELS: Record<MessageSubject, string> = {
  manuscript: 'Manuscript Submission',
  rights: 'Rights & Permissions',
  general: 'General Inquiry',
  media: 'Media Request',
  other: 'Other',
};

const SUBJECT_STYLES: Record<MessageSubject, string> = {
  manuscript: 'bg-primary/15 text-primary border-primary/30',
  rights: 'bg-secondary/10 text-secondary border-secondary/30',
  general: 'bg-muted text-muted-foreground border-border',
  media: 'bg-secondary/10 text-secondary border-secondary/30',
  other: 'bg-muted text-muted-foreground border-border',
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function MessageCard({ message }: { message: ContactMessage }) {
  const { markRead, deleteMessage } = useMessages();
  const { users } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const isLong = message.message.length > 160;
  const summary = isLong && !expanded ? `${message.message.slice(0, 160).trim()}…` : message.message;
  const account = message.userId ? users.find((u) => u.id === message.userId) : undefined;
  const isFromAccount = !!account;

  return (
    <div className={`border p-6 ${message.read ? 'border-border' : 'border-secondary'}`}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-[10px] tracking-wider uppercase px-2.5 py-1 border ${SUBJECT_STYLES[message.subject]}`}>
            {SUBJECT_LABELS[message.subject]}
          </span>
          <span
            className={`flex items-center gap-1 text-[10px] tracking-wider uppercase px-2.5 py-1 border ${
              isFromAccount ? 'text-primary border-primary/30 bg-primary/10' : 'text-muted-foreground border-border'
            }`}
          >
            {isFromAccount ? <UserCheck className="h-3 w-3" strokeWidth={1.5} /> : <UserRound className="h-3 w-3" strokeWidth={1.5} />}
            {isFromAccount ? 'Registered Account' : 'Guest'}
          </span>
          {!message.read && (
            <span className="flex items-center gap-1 text-[10px] tracking-wider uppercase text-secondary">
              <Circle className="h-2 w-2 fill-secondary text-secondary" /> New
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{timeAgo(message.createdAt)}</span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-secondary">{message.name}</p>
        <p className="text-xs text-muted-foreground">{message.email}</p>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {summary}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-secondary underline underline-offset-4 text-xs"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>

      <div className="flex items-center gap-5">
        {!message.read ? (
          <button
            onClick={() => markRead(message.id)}
            className="flex items-center gap-2 text-xs tracking-wider uppercase text-secondary hover:text-primary transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Mark as Read
          </button>
        ) : (
          <a
            href={`mailto:${message.email}`}
            className="flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground hover:text-secondary transition-colors"
          >
            <Mail className="h-3.5 w-3.5" strokeWidth={1.5} /> Reply
          </a>
        )}
        <button
          onClick={() => deleteMessage(message.id)}
          className="flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Delete
        </button>
      </div>
    </div>
  );
}

export function AdminMessages() {
  const { messages } = useMessages();

  if (messages.length === 0) {
    return (
      <div className="text-center py-32 border border-border">
        <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-6" strokeWidth={1.5} />
        <p className="text-muted-foreground">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}
