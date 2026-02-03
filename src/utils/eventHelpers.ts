import { TEvent, TEventType } from '../types/event';

/**
 * Sort events by start time in ascending order
 * @param events - Array of events to sort
 * @returns Sorted array of events
 */
export const sortEventsByStartTime = (events: TEvent[]): TEvent[] => {
  return [...events].sort((a, b) => a.start_time - b.start_time);
};

/**
 * Filter events based on authentication status
 * @param events - Array of events to filter
 * @param isAuthenticated - Whether user is authenticated
 * @returns Filtered array of events
 */
export const filterEventsByPermission = (
  events: TEvent[],
  isAuthenticated: boolean
): TEvent[] => {
  if (isAuthenticated) {
    return events; // Show all events for authenticated users
  }
  // Show only public events for non-authenticated users
  return events.filter((event) => event.permission !== 'private');
};

/**
 * Filter events by event type
 * @param events - Array of events to filter
 * @param eventType - The type of events to filter by
 * @returns Filtered array of events
 */
export const filterEventsByType = (
  events: TEvent[],
  eventType: TEventType | 'all'
): TEvent[] => {
  if (eventType === 'all') {
    return events;
  }
  return events.filter((event) => event.event_type === eventType);
};

/**
 * Search events by name or description
 * @param events - Array of events to search
 * @param query - Search query string
 * @returns Filtered array of events matching the query
 */
export const searchEvents = (events: TEvent[], query: string): TEvent[] => {
  const lowerQuery = query.toLowerCase();
  return events.filter(
    (event) =>
      event.name.toLowerCase().includes(lowerQuery) ||
      event.description?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Format Unix timestamp to readable date and time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date and time string
 */
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format event type to readable label
 * @param type - Event type
 * @returns Formatted event type label
 */
export const formatEventType = (type: string): string => {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get event type color for UI
 * @param type - Event type
 * @returns Color string for the event type
 */
export const getEventTypeColor = (type: string): string => {
  switch (type) {
    case 'workshop':
      return '#ff5f1f'; // Vivid orange
    case 'activity':
      return '#2ed3c6'; // Teal
    case 'tech_talk':
      return '#9f84ff'; // Electric purple (lighter for contrast)
    default:
      return '#6b7280'; // Gray
  }
};
