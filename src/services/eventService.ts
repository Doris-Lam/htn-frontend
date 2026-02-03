import axios from 'axios';
import { TEvent } from '../types/event';

const API_BASE_URL = 'https://api.hackthenorth.com/v3';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const eventService = {
  /**
   * Fetch all events from the API
   * @returns Promise containing array of TEvent
   */
  async getAllEvents(): Promise<TEvent[]> {
    try {
      const response = await client.get<TEvent[]>('/events');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all events:', error);
      throw new Error('Failed to fetch events. Please try again later.');
    }
  },

  /**
   * Fetch a single event by ID
   * @param eventId - The ID of the event to fetch
   * @returns Promise containing a TEvent
   */
  async getEventById(eventId: number): Promise<TEvent> {
    try {
      const response = await client.get<TEvent>(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch event ${eventId}:`, error);
      throw new Error(`Failed to fetch event. Please try again later.`);
    }
  },
};
