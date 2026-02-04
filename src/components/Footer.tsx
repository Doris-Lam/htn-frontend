import React from 'react';
import { Icon } from './Icon';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" id="about">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Hack the North 2026</h3>
          <p>
            A living schedule for hackers and the community. Built with love for
            the weekend of making.
          </p>
        </div>
        <div className="footer-links">
          <span className="footer-label">Explore</span>
          <a href="#schedule">Schedule</a>
          <a href="#calendar">Calendar</a>
          <a href="#about">About</a>
        </div>
        <div className="footer-social">
          <span className="footer-label">Social</span>
          <div className="social-row">
            <a
              href="https://github.com/hackthenorth"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Icon name="github" className="icon icon--md" />
            </a>
            <a
              href="https://twitter.com/hackthenorth"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <Icon name="twitter" className="icon icon--md" />
            </a>
            <a
              href="https://www.instagram.com/hackthenorth/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Icon name="instagram" className="icon icon--md" />
            </a>
            <a
              href="https://www.linkedin.com/company/hackthenorth/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Icon name="linkedin" className="icon icon--md" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Made for Hack the North 2026</span>
        <span>Schedule refreshes live</span>
      </div>
    </footer>
  );
};
