import React from 'react';
import { TEvent } from '../types/event';
import { formatEventType, getEventTypeColor } from '../utils/eventHelpers';
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
  const timeLabel = new Date(event.start_time).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
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
        <div className="event-time">
          <Icon name="calendar" className="icon icon--sm" />
          <span>{timeLabel}</span>
        </div>
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.name}</h3>

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
      </div>

      <div className="event-footer">
        <button
          className="view-details-btn"
          onClick={() => onViewDetails(event.id)}
          aria-label={`View details for ${event.name}`}
          disabled={!canView}
          onMouseMove={handleGlowMove}
          onMouseLeave={handleGlowLeave}
        >
          {canView ? 'View details' : 'Locked'}
          <span className="cta-arrow">→</span>
        </button>
      </div>
    </div>
  );
};
