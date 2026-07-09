import { AlertCircle } from 'lucide-react';

/**
 * کامپوننت ErrorMessage
 * نمایش خطا به کاربر با امکان تلاش مجدد
 */
export function ErrorMessage({
  message = 'خطایی در دریافت اطلاعات رخ داده است',
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={28} />
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn--ghost" type="button" onClick={onRetry}>
          تلاش مجدد
        </button>
      )}
    </div>
  );
}
