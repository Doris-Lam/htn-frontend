import React, { useMemo, useEffect, useState } from 'react';
import { TEvent } from '../types/event';
import { getEventTypeColor } from '../utils/eventHelpers';
import { Icon } from './Icon';
import './CalendarView.css';

interface CalendarViewProps {
  events: TEvent[];
  onSelectEvent: (eventId: number) => void;
}

type DayCell = {
  date: Date;
  key: string;
  inMonth: boolean;
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [hasNavigated, setHasNavigated] = useState(false);
  const [expandedDayKey, setExpandedDayKey] = useState<string | null>(null);

  useEffect(() => {
    if (hasNavigated || events.length === 0) return;
    const earliest = [...events].sort((a, b) => a.start_time - b.start_time)[0];
    const date = new Date(earliest.start_time);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, [events, hasNavigated]);

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

  const cells = useMemo<DayCell[]>(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startDate = new Date(year, month, 1 - firstDay);
    return Array.from({ length: 42 }, (_, idx) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + idx);
      return {
        date,
        key: getDateKey(date),
        inMonth: date.getMonth() === month,
      };
    });
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const todayKey = getDateKey(new Date());

  const handlePrev = () => {
    setHasNavigated(true);
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNext = () => {
    setHasNavigated(true);
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  return (
    <section className="calendar-shell" aria-label="Event calendar">
      <div className="calendar-header">
        <div className="calendar-title">
          <span className="calendar-label">Calendar</span>
          <h2>{monthLabel}</h2>
        </div>
        <div className="calendar-nav">
          <button type="button" className="calendar-btn" onClick={handlePrev} aria-label="Previous month">
            <Icon name="chevron-left" className="icon icon--sm" />
          </button>
          <button type="button" className="calendar-btn" onClick={handleNext} aria-label="Next month">
            <Icon name="chevron-right" className="icon icon--sm" />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {dayNames.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {cells.map((cell) => {
          const dayEvents = eventMap.get(cell.key) ?? [];
          const isExpanded = expandedDayKey === cell.key;
          const visibleEvents = isExpanded ? dayEvents : dayEvents.slice(0, 3);
          const overflow = dayEvents.length - visibleEvents.length;
          const isToday = cell.key === todayKey;
          return (
            <div
              key={cell.key}
              className={`calendar-cell ${cell.inMonth ? '' : 'is-out'} ${
                isToday ? 'is-today' : ''
              }`}
            >
              <div className="calendar-date">{cell.date.getDate()}</div>
              <div className="calendar-events">
                {visibleEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className="calendar-event"
                    onClick={() => onSelectEvent(event.id)}
                    style={{
                      borderColor: getEventTypeColor(event.event_type),
                    }}
                    aria-label={`View ${event.name}`}
                  >
                    <span className="calendar-event-title">{event.name}</span>
                    <span className="calendar-event-time">
                      {formatTime(event.start_time)}
                    </span>
                  </button>
                ))}
                {overflow > 0 && (
                  <button
                    type="button"
                    className="calendar-more"
                    onClick={() =>
                      setExpandedDayKey(isExpanded ? null : cell.key)
                    }
                    aria-label={
                      isExpanded
                        ? 'Show fewer events'
                        : `Show ${overflow} more events`
                    }
                  >
                    {isExpanded ? 'Show less' : `+${overflow} more`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
