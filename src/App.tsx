import React, { useState, useEffect } from 'react';
import { TEvent, AuthUser } from './types/event';
import { LoginComponent } from './components/LoginComponent';
import { EventList } from './components/EventList';
import { EventDetail } from './components/EventDetail';
import Aurora from './components/Aurora';
import { eventService } from './services/eventService';
import './App.css';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [events, setEvents] = useState<TEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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

  useEffect(() => {
    let ticking = false;

    const updateScrollDepth = () => {
      const progress = Math.min(window.scrollY / 600, 1);
      const root = document.documentElement;
      root.style.setProperty('--scroll-progress', progress.toFixed(3));
      root.style.setProperty('--scroll-header-opacity', (0.08 + progress * 0.22).toFixed(3));
      root.style.setProperty('--scroll-card-shadow', (0.5 + progress * 0.18).toFixed(3));
      root.style.setProperty('--scroll-orb-opacity', (0.18 + progress * 0.12).toFixed(3));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollDepth);
      }
    };

    updateScrollDepth();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogin = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem('htn_user', JSON.stringify(newUser));
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('htn_user');
    setSelectedEventId(null);
    setIsLoginOpen(false);
  };

  // Show main event list (public events visible to all)
  // Login modal overlay appears if user not authenticated
  return (
    <div className="app">
      <div className="aurora-layer" aria-hidden="true">
        <Aurora
          colorStops={['#7cff67', '#B19EEF', '#5227FF']}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>
      <EventList
        events={events}
        isAuthenticated={user?.isAuthenticated ?? false}
        isLoading={isLoading}
        error={error}
        onViewEvent={setSelectedEventId}
        onLogout={handleLogout}
        onLoginOpen={() => setIsLoginOpen(true)}
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
      {!user && isLoginOpen && (
        <div
          className="login-modal-overlay"
          onClick={() => setIsLoginOpen(false)}
          role="presentation"
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LoginComponent onLogin={handleLogin} onClose={() => setIsLoginOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
