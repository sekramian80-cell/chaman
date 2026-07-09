/**
 * کامپوننت LoadingSpinner
 * نمایش داده می‌شود هنگام بارگذاری داده از API
 */
export function LoadingSpinner({ message = 'در حال بارگذاری...' }) {
  return (
    <div className="loading-state" role="status" aria-label="در حال بارگذاری">
      <div className="loading-state__spinner" />
      {message && <p>{message}</p>}
    </div>
  );
}
