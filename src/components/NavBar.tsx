import React from 'react';
import { Icon } from './Icon';
import './NavBar.css';

export const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="brand-mark" aria-hidden="true"></span>
          <span className="brand-text">HTN 2026</span>
        </div>
        <div className="nav-links">
          <a href="#schedule">Schedule</a>
          <a href="#calendar">Calendar</a>
          <a href="#about">About</a>
        </div>
        <button className="nav-cta">
          <Icon name="calendar" className="icon icon--xs" />
          Get Updates
        </button>
      </div>
    </nav>
  );
};
