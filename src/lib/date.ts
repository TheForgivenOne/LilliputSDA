export function formatDate(date: string | Date, locale?: string): string {
  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  return new Date(date).toLocaleDateString(userLocale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: string | Date, locale?: string): string {
  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  return new Date(date).toLocaleDateString(userLocale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: string | Date, locale?: string): string {
  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  return new Date(date).toLocaleTimeString(userLocale, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatNumber(num: number | string, locale?: string): string {
  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return String(num);
  return new Intl.NumberFormat(userLocale).format(value);
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale?: string
): string {
  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  return new Intl.NumberFormat(userLocale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function getUserLocale(): string {
  if (typeof navigator !== 'undefined') {
    return (navigator as Navigator & { userLanguage?: string }).language || (navigator as Navigator & { userLanguage?: string }).userLanguage || 'en-US';
  }
  return 'en-US';
}
