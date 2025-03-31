/**
 * Date utilities for handling timezone conversions and formatting
 */

/**
 * Convert a local date and time to UTC ISO string for storage
 * @param dateStr Local date string (YYYY-MM-DD)
 * @param timeStr Local time string (HH:MM)
 * @returns ISO date string in UTC
 */
export function localToUTC(dateStr: string, timeStr: string): string {
  // Combine date and time strings
  const localDateTimeStr = `${dateStr}T${timeStr}`;
  // Create Date object (browser will interpret as local time)
  const localDate = new Date(localDateTimeStr);
  // Convert to UTC ISO string
  return localDate.toISOString();
}

/**
 * Convert a UTC ISO date string to local date string
 * @param isoStr ISO date string in UTC
 * @returns Local date in YYYY-MM-DD format
 */
export function utcToLocalDate(isoStr: string): string {
  const date = new Date(isoStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('/').reverse().join('-');
}

/**
 * Convert a UTC ISO date string to local time string
 * @param isoStr ISO date string in UTC
 * @returns Local time in HH:MM format
 */
export function utcToLocalTime(isoStr: string): string {
  const date = new Date(isoStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format a date for display with month, day, and year
 * @param dateStr ISO date string
 * @returns Formatted date string (e.g., "Mar 15, 2025")
 */
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a time range for display
 * @param startTime ISO date string for start time
 * @param endTime ISO date string for end time
 * @returns Formatted time range (e.g., "6:30 PM - 9:30 PM")
 */
export function formatTimeRange(startTime?: string, endTime?: string): string {
  if (!startTime) return "Time TBD";
  
  const start = new Date(startTime);
  const formattedStart = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  if (!endTime) return formattedStart;
  
  const end = new Date(endTime);
  const formattedEnd = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `${formattedStart} - ${formattedEnd}`;
}

/**
 * Get the day of week from a date string
 * @param dateStr ISO date string
 * @returns Day of week (e.g., "Monday")
 */
export function getDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Extract date components for UI display
 * @param dateStr ISO date string
 * @returns Object with day, month, and dayOfWeek
 */
export function extractDateComponents(dateStr: string): { day: string; month: string; dayOfWeek: string } {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' })
  };
}