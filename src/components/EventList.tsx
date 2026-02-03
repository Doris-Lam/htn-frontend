import React, { useState, useMemo } from 'react';
import { TEvent, TEventType } from '../types/event';
import { EventCard } from './EventCard';
import {
  sortEventsByStartTime,
  filterEventsByPermission,
  filterEventsByType,
  searchEvents,
} from '../utils/eventHelpers';
import { CalendarView } from './CalendarView';
import { Icon } from './Icon';
import './EventList.css';

interface EventListProps {
  events: TEvent[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  onViewEvent: (eventId: number) => void;
  onLogout: () => void;
}

type EventTypeFilter = TEventType | 'all';

export const EventList: React.FC<EventListProps> = ({
  events,
  isAuthenticated,
  isLoading,
  error,
  onViewEvent,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventTypeFilter>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Process events: filter by permission, sort by time, filter by type, search
  const filteredEvents = useMemo(() => {
    let processed = sortEventsByStartTime(
      filterEventsByPermission(events, isAuthenticated)
    );
    processed = filterEventsByType(processed, selectedType);
    processed = searchEvents(processed, searchQuery);
    return processed;
  }, [events, isAuthenticated, selectedType, searchQuery]);

  const eventTypeOptions: EventTypeFilter[] = ['all', 'workshop', 'activity', 'tech_talk'];

  return (
    <div className="event-list-container">
      <header className="event-list-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1>Hack the North 2026</h1>
            <p>Events Schedule</p>
          </div>
          <div className="user-info">
            {isAuthenticated && (
              <span className="user-badge">
                <Icon name="user" className="icon icon--xs" />
                Logged in
              </span>
            )}
            {isAuthenticated && (
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search events by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search events"
            />
            <span className="search-icon">
              <Icon name="search" className="icon icon--sm" />
            </span>
          </div>

          <div className="filters-actions">
            <div className="filter-buttons">
              <label htmlFor="event-type-filter" className="filter-label">
                Event Type:
              </label>
              <select
                id="event-type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as EventTypeFilter)}
                className="type-filter"
                aria-label="Filter by event type"
              >
                {eventTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all'
                      ? 'All Types'
                      : type
                          .split('_')
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                className={`view-btn ${viewMode === 'list' ? 'is-active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
              >
                <Icon name="list" className="icon icon--xs" />
                List
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'calendar' ? 'is-active' : ''}`}
                onClick={() => setViewMode('calendar')}
                aria-pressed={viewMode === 'calendar'}
              >
                <Icon name="grid" className="icon icon--xs" />
                Calendar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="event-list-main">
        {error && (
          <div className="error-container" role="alert">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="loading-container" role="status" aria-live="polite">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchQuery || selectedType !== 'all'
                ? 'No events match your search or filter'
                : 'No events available'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="reset-search-btn"
              >
                Clear search
              </button>
            )}
            {selectedType !== 'all' && (
              <button
                onClick={() => setSelectedType('all')}
                className="reset-filter-btn"
              >
                Show all types
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="results-info">
              <p>
                Showing {filteredEvents.length} event
                {filteredEvents.length !== 1 ? 's' : ''}
              </p>
              {!isAuthenticated && (
                <p className="auth-hint">
                  <Icon name="info" className="icon icon--xs" />
                  Log in to view private events and additional content
                </p>
              )}
            </div>
            {viewMode === 'calendar' ? (
              <CalendarView events={filteredEvents} onSelectEvent={onViewEvent} />
            ) : (
              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isAuthenticated={isAuthenticated}
                    onViewDetails={onViewEvent}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
