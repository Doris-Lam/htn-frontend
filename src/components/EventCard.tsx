import React from 'react';
import { TEvent } from '../types/event';
import { formatDateTime, formatEventType, getEventTypeColor } from '../utils/eventHelpers';
import { Icon } from './Icon';
import './EventCard.css';

interface EventCardProps {
  event: TEvent;
  isAuthenticated: boolean;
  onViewDetails: (eventId: number) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isAuthenticated,
  onViewDetails,
}) => {
  const isPrivate = event.permission === 'private';
  const canView = !isPrivate || isAuthenticated;
  const typeColor = getEventTypeColor(event.event_type);

  return (
    <div
      className={`event-card ${isPrivate ? 'private-event' : 'public-event'} ${
        !canView ? 'locked' : ''
      }`}
      role="article"
      aria-label={`${event.name} event`}
    >
      {!canView && (
        <div className="lock-overlay">
          <div className="lock-badge">
            <span className="lock-icon">
              <Icon name="lock" className="icon icon--lg" />
            </span>
            <p>Login to view</p>
          </div>
        </div>
      )}

      <div className="event-header">
        <div className="event-type-badge" style={{ backgroundColor: typeColor }}>
          {formatEventType(event.event_type)}
        </div>
        {isPrivate && (
          <div className="private-badge" title="Private event - requires login">
            Private
          </div>
        )}
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.name}</h3>

        <div className="event-time">
          <span className="time-label">
            <Icon name="calendar" className="icon icon--sm" />
          </span>
          <span>{formatDateTime(event.start_time)}</span>
        </div>

        {event.description && (
          <p className="event-description">{event.description}</p>
        )}

        {event.speakers && event.speakers.length > 0 && (
          <div className="speakers-section">
            <span className="speakers-label">
              <Icon name="user" className="icon icon--xs" />
              Speakers:
            </span>
            <div className="speakers-list">
              {event.speakers.map((speaker, index) => (
                <span key={index} className="speaker-name">
                  {speaker.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {event.related_events && event.related_events.length > 0 && (
          <div className="related-events-hint">
            <span className="link-icon">
              <Icon name="link" className="icon icon--xs" />
            </span>
            <span>{event.related_events.length} related event(s)</span>
          </div>
        )}
      </div>

      <div className="event-footer">
        <button
          className="view-details-btn"
          onClick={() => onViewDetails(event.id)}
          aria-label={`View details for ${event.name}`}
          disabled={!canView}
        >
          {canView ? 'View Details' : 'Locked'}
        </button>
      </div>
    </div>
  );
};
