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
 * @param dateStr ISO date string or YYYY-MM-DD date string
 * @returns Formatted date string (e.g., "Mar 15, 2025")
 */
export function formatDisplayDate(dateStr: string): string {
  // Handle potentially invalid date by adding a default time if needed
  let date: Date;
  
  try {
    // First try to parse the date as is
    date = new Date(dateStr);
    
    // Check if the date is valid, if not, try adding a time component
    if (isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // If it's in YYYY-MM-DD format without time, add a default time
      date = new Date(dateStr + 'T12:00:00Z');
    }
    
    // Final check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date format:', dateStr);
      return 'Invalid date';
    }
  } catch (e) {
    console.error('Error parsing date:', dateStr, e);
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a time for display
 * @param timeStr Time string in any format
 * @returns Formatted time (e.g., "6:30 PM")
 */
function formatTime(timeStr?: string): string {
  if (!timeStr) return "TBD";
  
  // Handle HH:MM format (without date)
  if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
    // Create a dummy date object with today's date and the time
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // Handle date with time
  try {
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) {
      console.error('Invalid time format:', timeStr);
      return timeStr; // Return the original string if we can't parse it
    }
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    console.error('Error parsing time:', timeStr, e);
    return timeStr;
  }
}

/**
 * Format a time range for display
 * @param startTime Time string for start time
 * @param endTime Time string for end time
 * @returns Formatted time range (e.g., "6:30 PM - 9:30 PM")
 */
export function formatTimeRange(startTime?: string, endTime?: string): string {
  if (!startTime) return "Time TBD";
  
  const formattedStart = formatTime(startTime);
  
  if (!endTime) return formattedStart;
  
  const formattedEnd = formatTime(endTime);
  
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
 * @param dateStr ISO date string or YYYY-MM-DD date string
 * @returns Object with day, month, and dayOfWeek
 */
export function extractDateComponents(dateStr: string): { day: string; month: string; dayOfWeek: string } {
  // Handle potentially invalid date by adding a default time if needed
  let date: Date;
  
  try {
    // First try to parse the date as is
    date = new Date(dateStr);
    
    // Check if the date is valid, if not, try adding a time component
    if (isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // If it's in YYYY-MM-DD format without time, add a default time
      date = new Date(dateStr + 'T12:00:00Z');
    }
    
    // Final check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date format in extractDateComponents:', dateStr);
      return {
        day: '--',
        month: '---',
        dayOfWeek: '------'
      };
    }
  } catch (e) {
    console.error('Error parsing date in extractDateComponents:', dateStr, e);
    return {
      day: '--',
      month: '---',
      dayOfWeek: '------'
    };
  }
  
  return {
    day: date.getDate().toString(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' })
  };
}