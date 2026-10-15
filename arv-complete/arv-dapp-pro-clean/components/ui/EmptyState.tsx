'use client';

import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--arv-blue-mid)] to-[var(--arv-blue)] flex items-center justify-center mb-4 border border-[var(--arv-gold)]/20">
        {icon || <Inbox className="text-[var(--arv-gold)]" size={28} />}
      </div>
      <h3 className="text-base font-bold text-[var(--arv-text-primary)] mb-1">{title}</h3>
      {description && <p className="text-xs text-[var(--arv-text-muted)] max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
