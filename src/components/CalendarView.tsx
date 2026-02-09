import React, { useMemo, useState, useEffect } from 'react';
import { TEvent } from '../types/event';
import { formatEventType, getEventTypeColor } from '../utils/eventHelpers';
import { Icon } from './Icon';
import './CalendarView.css';

interface CalendarViewProps {
  events: TEvent[];
  onSelectEvent: (eventId: number) => void;
}

const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTimeRange = (start: number, end: number): string => {
  const opts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
  const startTime = new Date(start).toLocaleTimeString('en-US', opts);
  const endTime = new Date(end).toLocaleTimeString('en-US', opts);
  return `${startTime} - ${endTime}`;
};

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hasUserSelected, setHasUserSelected] = useState(false);

  useEffect(() => {
    if (hasUserSelected || events.length === 0) return;
    const earliest = [...events].sort((a, b) => a.start_time - b.start_time)[0];
    const date = new Date(earliest.start_time);
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
  }, [events, hasUserSelected]);

  const weekDates = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - selectedDate.getDay());
    return Array.from({ length: 7 }, (_, idx) => {
      const date = new Date(start);
      date.setDate(start.getDate() + idx);
      return date;
    });
  }, [selectedDate]);

  const eventMap = useMemo(() => {
    const map = new Map<string, TEvent[]>();
    events.forEach((event) => {
      const key = getDateKey(new Date(event.start_time));
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    });
    map.forEach((list) => list.sort((a, b) => a.start_time - b.start_time));
    return map;
  }, [events]);

  const selectedKey = getDateKey(selectedDate);
  const dayEvents = eventMap.get(selectedKey) ?? [];

  const monthLabel = selectedDate.toLocaleString('en-US', {
    month: 'short',
  });
  const dayLabel = selectedDate.getDate();

  const handlePrevDay = () => {
    setHasUserSelected(true);
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 1);
      return next;
    });
  };

  const handleNextDay = () => {
    setHasUserSelected(true);
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 1);
      return next;
    });
  };

  return (
    <section className="calendar-shell" id="calendar" aria-label="Event calendar">
      <h2 className="calendar-title">Event Calendar</h2>
      <div className="calendar-panel">
          <div className="calendar-top">
            <div className="calendar-date-block">
              <Icon name="calendar" className="icon icon--md" />
              <span>{monthLabel}</span>
              <strong>{dayLabel}</strong>
            </div>
            <div className="calendar-week">
              <button className="calendar-nav-btn" onClick={handlePrevDay} aria-label="Previous day">
                <Icon name="chevron-left" className="icon icon--sm" />
              </button>
              {weekDates.map((date) => {
                const isActive = getDateKey(date) === selectedKey;
                return (
                  <button
                    key={getDateKey(date)}
                    className={`calendar-weekday ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setHasUserSelected(true);
                      setSelectedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
                    }}
                  >
                    {date.toLocaleString('en-US', { weekday: 'short' })}
                  </button>
                );
              })}
              <button className="calendar-nav-btn" onClick={handleNextDay} aria-label="Next day">
                <Icon name="chevron-right" className="icon icon--sm" />
              </button>
            </div>
          </div>

          <div className="calendar-events-list">
            {dayEvents.length === 0 ? (
              <div className="calendar-empty">
                <p>No events scheduled for this day.</p>
              </div>
            ) : (
              dayEvents.map((event) => (
                <button
                  key={event.id}
                  className="calendar-event-card"
                  onClick={() => onSelectEvent(event.id)}
                >
                    <div
                      className="calendar-thumb"
                      style={{ borderColor: getEventTypeColor(event.event_type) }}
                    >
                      <div
                        className="thumb-glow"
                        style={{ backgroundColor: getEventTypeColor(event.event_type) }}
                      ></div>
                    </div>
                    <div className="calendar-event-content">
                      <div className="calendar-meta">
                        <span className="calendar-time">
                          {formatTimeRange(event.start_time, event.end_time)}
                        </span>
                        <span className="calendar-type">
                          {formatEventType(event.event_type)}
                        </span>
                      </div>
                      <h3>{event.name}</h3>
                      {event.description && <p>{event.description}</p>}
                      <div className="calendar-tags">
                        <span
                          className="calendar-tag"
                          style={{
                            backgroundColor: getEventTypeColor(event.event_type),
                          }}
                        >
                          {formatEventType(event.event_type)}
                        </span>
                        {event.permission && (
                          <span className="calendar-tag ghost">
                            {event.permission}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
              ))
            )}
          </div>
      </div>
    </section>
  );
};
