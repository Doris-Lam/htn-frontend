import React, { useState, useEffect } from 'react';
import { TEvent } from '../types/event';
import { formatDateTime, formatEventType, getEventTypeColor } from '../utils/eventHelpers';
import { eventService } from '../services/eventService';
import { Icon } from './Icon';
import './EventDetail.css';

interface EventDetailProps {
  eventId: number;
  allEvents: TEvent[];
  isAuthenticated: boolean;
  onClose: () => void;
  onEventClick: (eventId: number) => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  eventId,
  allEvents,
  isAuthenticated,
  onClose,
  onEventClick,
}) => {
  const [event, setEvent] = useState<TEvent | null>(null);
  const [relatedEventsList, setRelatedEventsList] = useState<TEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to find event in allEvents first
        let foundEvent = allEvents.find((e) => e.id === eventId);

        // If not found, fetch from API
        if (!foundEvent) {
          foundEvent = await eventService.getEventById(eventId);
        }

        setEvent(foundEvent);

        // Load related events
        if (foundEvent && foundEvent.related_events.length > 0) {
          const relatedIds = foundEvent.related_events;
          const relatedEventsData = relatedIds
            .map((id) => allEvents.find((e) => e.id === id))
            .filter((e): e is TEvent => e !== undefined);

          setRelatedEventsList(relatedEventsData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load event details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId, allEvents]);

  if (isLoading) {
    return (
      <div className="event-detail-modal-overlay" onClick={onClose}>
        <div className="event-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading-state">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-detail-modal-overlay" onClick={onClose}>
        <div className="event-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="error-state">
            <p>{error}</p>
            <button onClick={onClose} className="close-button">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const isPrivate = event.permission === 'private';
  const canView = !isPrivate || isAuthenticated;
  const typeColor = getEventTypeColor(event.event_type);

  return (
    <div className="event-detail-modal-overlay" onClick={onClose}>
      <div
        className="event-detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`event-title-${event.id}`}
      >
        <div className="modal-header">
          <div className="header-badges">
            <div className="event-type-badge" style={{ backgroundColor: typeColor }}>
              {formatEventType(event.event_type)}
            </div>
            {isPrivate && (
              <div className="private-badge">Private</div>
            )}
          </div>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close event details"
          >
            <Icon name="x" className="icon icon--sm" />
          </button>
        </div>

        <div className="modal-content">
          {!canView ? (
            <div className="locked-content">
              <div className="lock-icon">
                <Icon name="lock" className="icon icon--lg" />
              </div>
              <h2>This event is private</h2>
              <p>Please log in to view this event's details</p>
            </div>
          ) : (
            <>
              <h1 id={`event-title-${event.id}`} className="event-title">
                {event.name}
              </h1>

              <div className="event-timing">
                <div className="timing-item">
                  <strong>Start:</strong>
                  <span>{formatDateTime(event.start_time)}</span>
                </div>
                <div className="timing-item">
                  <strong>End:</strong>
                  <span>{formatDateTime(event.end_time)}</span>
                </div>
              </div>

              {event.description && (
                <div className="event-description-section">
                  <h2>About this event</h2>
                  <p>{event.description}</p>
                </div>
              )}

              {event.speakers && event.speakers.length > 0 && (
                <div className="speakers-section">
                  <h2>Speakers</h2>
                  <ul className="speakers-list">
                    {event.speakers.map((speaker, index) => (
                      <li key={index} className="speaker-item">
                        <Icon name="user" className="icon icon--sm" />
                        {speaker.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(event.public_url || (isAuthenticated && event.private_url)) && (
                <div className="links-section">
                  <h2>Links</h2>
                  <div className="links-list">
                    {event.public_url && (
                      <a
                        href={event.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-button public-link"
                      >
                        <Icon name="external" className="icon icon--sm" />
                        Public Link
                      </a>
                    )}
                    {isAuthenticated && event.private_url && (
                      <a
                        href={event.private_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-button private-link"
                      >
                        <Icon name="link" className="icon icon--sm" />
                        Private Link
                      </a>
                    )}
                  </div>
                </div>
              )}

              {relatedEventsList.length > 0 && (
                <div className="related-events-section">
                  <h2>Related Events</h2>
                  <div className="related-events-grid">
                    {relatedEventsList.map((relEvent) => (
                      <button
                        key={relEvent.id}
                        className="related-event-card"
                        onClick={() => onEventClick(relEvent.id)}
                        aria-label={`View related event: ${relEvent.name}`}
                      >
                        <div
                          className="rel-event-type"
                          style={{
                            backgroundColor: getEventTypeColor(relEvent.event_type),
                          }}
                        >
                          {formatEventType(relEvent.event_type)}
                        </div>
                        <h3>{relEvent.name}</h3>
                        <p className="rel-event-time">
                          {formatDateTime(relEvent.start_time)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
