import React, { useState, useMemo } from 'react';
import { TEvent, TEventType } from '../types/event';
import { EventCard } from './EventCard';
import {
  sortEventsByStartTime,
  filterEventsByPermission,
  filterEventsByType,
  searchEvents,
  formatEventType,
  getEventTypeColor,
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
  onLoginOpen: () => void;
}

type EventTypeFilter = TEventType | 'all';

type TypeCounts = Record<TEventType, number>;

export const EventList: React.FC<EventListProps> = ({
  events,
  isAuthenticated,
  isLoading,
  error,
  onViewEvent,
  onLogout,
  onLoginOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventTypeFilter>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filteredEvents = useMemo(() => {
    let processed = sortEventsByStartTime(
      filterEventsByPermission(events, isAuthenticated)
    );
    processed = filterEventsByType(processed, selectedType);
    processed = searchEvents(processed, searchQuery);
    return processed;
  }, [events, isAuthenticated, selectedType, searchQuery]);

  const eventTypeOptions: EventTypeFilter[] = ['all', 'workshop', 'activity', 'tech_talk'];

  const dateRangeLabel = useMemo(() => {
    if (filteredEvents.length === 0) return 'No dates';
    const start = new Date(filteredEvents[0].start_time);
    const endMs = filteredEvents.reduce(
      (max, event) => Math.max(max, event.end_time ?? event.start_time),
      filteredEvents[0].start_time
    );
    const end = new Date(endMs);
    const formatMonthDay = (date: Date) =>
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()
    ) {
      return formatMonthDay(start);
    }
    if (start.getMonth() === end.getMonth()) {
      return `${formatMonthDay(start)}–${end.getDate()}`;
    }
    return `${formatMonthDay(start)}–${formatMonthDay(end)}`;
  }, [filteredEvents]);

  const totalEvents = events.length;
  const privateCount = events.filter((event) => event.permission === 'private').length;
  const publicCount = totalEvents - privateCount;

  const typeCounts = useMemo<TypeCounts>(() => {
    return events.reduce<TypeCounts>(
      (acc, event) => {
        acc[event.event_type] += 1;
        return acc;
      },
      { workshop: 0, activity: 0, tech_talk: 0 }
    );
  }, [events]);

  const typeCount = Object.values(typeCounts).filter((count) => count > 0).length;

  const groupedByDay = useMemo(() => {
    return filteredEvents.reduce<Record<string, TEvent[]>>((acc, event) => {
      const key = new Date(event.start_time).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
      acc[key] = acc[key] ? [...acc[key], event] : [event];
      return acc;
    }, {});
  }, [filteredEvents]);

  const marqueeItems = useMemo(() => {
    return [
      { label: 'Workshops', value: typeCounts.workshop },
      { label: 'Tech Talks', value: typeCounts.tech_talk },
      { label: 'Activities', value: typeCounts.activity },
      { label: 'Public', value: publicCount },
      { label: 'Private', value: privateCount },
    ];
  }, [typeCounts, publicCount, privateCount]);

  const featuredEvent = filteredEvents[0];
  const timelineEvents = filteredEvents.slice(0, 4);
  const now = Date.now();
  const ongoingEvent = filteredEvents.find(
    (event) => event.start_time <= now && (event.end_time ?? event.start_time) > now
  );
  const nextEvent = filteredEvents.find((event) => event.start_time > now);
  const earliestStart = filteredEvents[0]?.start_time;
  const latestEnd = filteredEvents.reduce(
    (max, event) => Math.max(max, event.end_time ?? event.start_time),
    filteredEvents[0]?.start_time ?? now
  );
  const scheduleProgress =
    earliestStart && latestEnd && latestEnd > earliestStart
      ? Math.min(100, Math.max(0, ((now - earliestStart) / (latestEnd - earliestStart)) * 100))
      : 0;

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  const handleGlowMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty('--glow-x', `${x}px`);
    event.currentTarget.style.setProperty('--glow-y', `${y}px`);
  };

  const handleGlowLeave = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty('--glow-x');
    event.currentTarget.style.removeProperty('--glow-y');
  };

  return (
    <div className="event-list-container">
      <header className="event-list-header" id="schedule">
        <div className="header-content">
          <div className="header-title-section">
            <span className="eyebrow">Events Schedule</span>
            <h1 className="title-lockup">
              <span className="title-main">Hack the North</span>
              <span className="title-year">2026</span>
            </h1>
            <div className="status-strip">
              <span>Showing {filteredEvents.length} events</span>
              <span>{dateRangeLabel}</span>
              <span>Timezone: ET</span>
            </div>
            <div className="summary-grid" aria-label="Schedule highlights">
              <div className="summary-card">
                <span className="summary-label">Total events</span>
                <strong>{totalEvents}</strong>
              </div>
              <div className="summary-card">
                <span className="summary-label">Public / Private</span>
                <strong>
                  {publicCount} / {privateCount}
                </strong>
              </div>
              <div className="summary-card">
                <span className="summary-label">Event types</span>
                <strong>{typeCount}</strong>
              </div>
            </div>
            <div className="marquee" aria-hidden="true">
              <div className="marquee-track">
                {[...marqueeItems, ...marqueeItems].map((item, index) => (
                  <span className="marquee-chip" key={`${item.label}-${index}`}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="user-info">
            {isAuthenticated && (
              <span className="user-badge">
                <Icon name="user" className="icon icon--xs" />
                Logged in
              </span>
            )}
          </div>
        </div>

        <div className="control-bar">
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
            <div
              className={`view-toggle ${viewMode === 'calendar' ? 'is-calendar' : 'is-list'}`}
              role="group"
              aria-label="View mode"
            >
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

            {!isAuthenticated ? (
              <button
                className="login-btn"
                onClick={onLoginOpen}
                onMouseMove={handleGlowMove}
                onMouseLeave={handleGlowLeave}
              >
                Log in
              </button>
            ) : (
              <button
                className="logout-btn"
                onClick={onLogout}
                onMouseMove={handleGlowMove}
                onMouseLeave={handleGlowLeave}
              >
                Log out
              </button>
            )}
          </div>
        </div>

        <div className="quick-bar">
          <div className="quick-filters">
            {eventTypeOptions.filter((type) => type !== 'all').map((type) => (
              <button
                key={type}
                className={`quick-chip ${selectedType === type ? 'is-active' : ''}`}
                onClick={() => setSelectedType(type as EventTypeFilter)}
                onMouseMove={handleGlowMove}
                onMouseLeave={handleGlowLeave}
              >
                <span className="chip-dot" style={{ backgroundColor: getEventTypeColor(type) }} />
                {formatEventType(type)}
                <strong>{typeCounts[type as TEventType]}</strong>
              </button>
            ))}
            <button
              className={`quick-chip ${selectedType === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              All
              <strong>{filteredEvents.length}</strong>
            </button>
          </div>
          <div className="progress-shell" aria-label="Schedule progress">
            <span>Schedule progress</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${scheduleProgress}%` }} />
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
            {featuredEvent && (
              <section className="dashboard-band">
                <div className="feature-card">
                  <div className="feature-header">
                    <span className="feature-label">Spotlight</span>
                    <span
                      className="feature-type"
                      style={{ backgroundColor: getEventTypeColor(featuredEvent.event_type) }}
                    >
                      {formatEventType(featuredEvent.event_type)}
                    </span>
                  </div>
                  <h3>{featuredEvent.name}</h3>
                  <p>{featuredEvent.description ?? 'A featured moment in the schedule.'}</p>
                  <div className="feature-meta">
                    <span>
                      <Icon name="calendar" className="icon icon--sm" />
                      {formatDate(featuredEvent.start_time)} · {formatTime(featuredEvent.start_time)}
                    </span>
                    {featuredEvent.speakers?.length ? (
                      <span>
                        <Icon name="user" className="icon icon--sm" />
                        {featuredEvent.speakers[0].name}
                      </span>
                    ) : null}
                  </div>
                  <button className="feature-btn" onClick={() => onViewEvent(featuredEvent.id)}>
                    Open spotlight
                  </button>
                </div>

                <div className="timeline-card">
                  <div className="timeline-header">
                    <span>Upcoming</span>
                    <span>{timelineEvents.length} items</span>
                  </div>
                  <div className="timeline-list">
                    {timelineEvents.map((event) => (
                      <button
                        key={event.id}
                        className="timeline-item"
                        onClick={() => onViewEvent(event.id)}
                      >
                        <span className="timeline-time">{formatTime(event.start_time)}</span>
                        <span className="timeline-title">{event.name}</span>
                        <span
                          className="timeline-type"
                          style={{ backgroundColor: getEventTypeColor(event.event_type) }}
                        >
                          {formatEventType(event.event_type)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {(ongoingEvent || nextEvent) && (
              <section className="now-next">
                <div className="now-card">
                  <span className="now-label">Now</span>
                  <h4>{ongoingEvent ? ongoingEvent.name : 'No live events'}</h4>
                  <p>
                    {ongoingEvent
                      ? `${formatDate(ongoingEvent.start_time)} · ${formatTime(
                          ongoingEvent.start_time
                        )}–${formatTime(ongoingEvent.end_time ?? ongoingEvent.start_time)}`
                      : 'Check upcoming events below.'}
                  </p>
                </div>
                <div className="next-card">
                  <span className="now-label">Next</span>
                  <h4>{nextEvent ? nextEvent.name : 'Stay tuned'}</h4>
                  <p>
                    {nextEvent
                      ? `${formatDate(nextEvent.start_time)} · ${formatTime(
                          nextEvent.start_time
                        )}`
                      : 'No more events scheduled.'}
                  </p>
                </div>
              </section>
            )}

            {!isAuthenticated && (
              <div className="auth-callout">
                <Icon name="lock" className="icon icon--sm" />
                <span>Some events are hidden. Log in to view.</span>
                <button className="auth-callout-btn" onClick={onLoginOpen}>
                  Log in
                </button>
              </div>
            )}

            {viewMode === 'calendar' ? (
              <CalendarView events={filteredEvents} onSelectEvent={onViewEvent} />
            ) : (
              <div className="events-grouped">
                {Object.entries(groupedByDay).map(([label, groupEvents]) => (
                  <section key={label} className="day-group">
                    <div className="day-header">
                      <h3>{label}</h3>
                      <span>{groupEvents.length} events</span>
                    </div>
                    <div className="events-grid">
                      {groupEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          isAuthenticated={isAuthenticated}
                          onViewDetails={onViewEvent}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
