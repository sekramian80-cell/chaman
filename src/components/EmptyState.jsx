import { Inbox } from 'lucide-react';

/**
 * کامپوننت EmptyState
 * نمایش داده می‌شود وقتی داده‌ای برای نمایش وجود ندارد
 */
export function EmptyState({
  icon: Icon = Inbox,
  title = 'موردی یافت نشد',
  message = 'در حال حاضر محتوایی برای نمایش وجود ندارد',
}) {
  return (
    <div className="empty-state">
      <Icon size={40} />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
