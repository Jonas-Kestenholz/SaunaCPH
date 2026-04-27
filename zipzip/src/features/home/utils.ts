import type { MonthlyDropOverlay } from './types';

const FIVE_DAYS_IN_MS = 5 * 24 * 60 * 60 * 1000;

export function isDropModeActive(
  overlay: MonthlyDropOverlay | null,
  now = new Date(),
): boolean {
  if (!overlay || !overlay.active || !overlay.dropDate) {
    return false;
  }

  const dropDate = new Date(overlay.dropDate);

  if (Number.isNaN(dropDate.getTime())) {
    return false;
  }

  const startTime = new Date(dropDate.getTime() - FIVE_DAYS_IN_MS);

  return now >= startTime && now < dropDate;
}

export function getCountdownParts(
  dropDateString: string,
  now = new Date(),
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const dropDate = new Date(dropDateString);
  const diff = Math.max(0, dropDate.getTime() - now.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}