import React, { useState, useEffect } from 'react';
import { TEvent, AuthUser } from './types/event';
import { LoginComponent } from './components/LoginComponent';
import { EventList } from './components/EventList';
import { EventDetail } from './components/EventDetail';
import { eventService } from './services/eventService';
import './App.css';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [events, setEvents] = useState<TEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load events'
        );
        console.error('Error loading events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('htn_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error loading user from storage:', err);
      }
    }
  }, []);

  const handleLogin = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem('htn_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('htn_user');
    setSelectedEventId(null);
  };

  // Show main event list (public events visible to all)
  // Login modal overlay appears if user not authenticated
  return (
    <div className="app">
      <EventList
        events={events}
        isAuthenticated={user?.isAuthenticated ?? false}
        isLoading={isLoading}
        error={error}
        onViewEvent={setSelectedEventId}
        onLogout={handleLogout}
      />
      {selectedEventId && (
        <EventDetail
          eventId={selectedEventId}
          allEvents={events}
          isAuthenticated={user?.isAuthenticated ?? false}
          onClose={() => setSelectedEventId(null)}
          onEventClick={setSelectedEventId}
        />
      )}
      {!user && (
        <div className="login-modal-overlay">
          <LoginComponent onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default App;
