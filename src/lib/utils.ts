// Utility functions for BazarDor

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('bn-BD').format(num);
}

export function toBengaliDigits(num: number | string): string {
  return String(num).replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

export function formatPrice(price: number): string {
  return `${toBengaliDigits(price.toLocaleString('bn-BD'))} টাকা`;
}

export function formatPriceChange(changePercent: number): { label: string; direction: 'up' | 'down' | 'flat' } {
  const absChange = Math.abs(changePercent);
  const formatted = toBengaliDigits(absChange.toFixed(1));
  
  if (changePercent > 0) {
    return { label: `▲ ${formatted}%`, direction: 'up' };
  } else if (changePercent < 0) {
    return { label: `▼ ${formatted}%`, direction: 'down' };
  }
  return { label: `—${formatted}%`, direction: 'flat' };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function unslugify(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  return fn().catch((error) => {
    if (retries <= 0) throw error;
    return sleep(delay).then(() => retry(fn, retries - 1, delay * 2));
  });
}