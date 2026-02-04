import React from 'react';

export type IconName =
  | 'search'
  | 'lock'
  | 'calendar'
  | 'user'
  | 'link'
  | 'external'
  | 'info'
  | 'list'
  | 'grid'
  | 'chevron-left'
  | 'chevron-right'
  | 'x'
  | 'github'
  | 'twitter'
  | 'instagram'
  | 'linkedin';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  title?: string;
}

export const Icon: React.FC<IconProps> = ({ name, title, ...props }) => {
  const shared = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const titleProps = title
    ? { role: 'img', 'aria-label': title }
    : { 'aria-hidden': true };

  switch (name) {
    case 'search':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <circle cx="11" cy="11" r="7" />
          <line x1="16.65" y1="16.65" x2="21" y2="21" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
          <line x1="3" y1="11" x2="21" y2="11" />
        </svg>
      );
    case 'user':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c2-4 6-6 8-6s6 2 8 6" />
        </svg>
      );
    case 'link':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
        </svg>
      );
    case 'external':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <path d="M14 3h7v7" />
          <path d="M10 14L21 3" />
          <path d="M21 14v7H3V3h7" />
        </svg>
      );
    case 'info':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="10" x2="12" y2="16" />
          <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'list':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'chevron-left':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      );
    case 'x':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </svg>
      );
    case 'github':
      return (
        <svg {...shared} {...titleProps} {...props} stroke="none" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.77.6-3.35-1.34-3.35-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.94.84.09-.66.35-1.1.63-1.36-2.21-.25-4.54-1.1-4.54-4.9 0-1.08.39-1.97 1.03-2.66-.1-.25-.45-1.27.1-2.64 0 0 .85-.27 2.8 1.02a9.7 9.7 0 0 1 5.1 0c1.94-1.29 2.8-1.02 2.8-1.02.55 1.37.2 2.39.1 2.64.64.69 1.03 1.58 1.03 2.66 0 3.81-2.34 4.64-4.57 4.89.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0 0 12 2z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg {...shared} {...titleProps} {...props} stroke="none" fill="currentColor">
          <path d="M20.5 6.9c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.4-1.8-.6.4-1.3.7-2 .8a3.2 3.2 0 0 0-5.5 2.2c0 .2 0 .4.1.6A9 9 0 0 1 4.7 5.7c-.3.5-.4 1-.4 1.6 0 1.1.6 2 1.4 2.6-.5 0-1-.1-1.5-.4v.1c0 1.6 1.1 3 2.6 3.3-.3.1-.7.1-1 .1-.2 0-.4 0-.6-.1.4 1.3 1.7 2.3 3.2 2.3A6.5 6.5 0 0 1 4 17.6a9.2 9.2 0 0 0 5 1.5c6 0 9.3-5 9.3-9.3V9c.6-.4 1.1-.9 1.5-1.4z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...shared} {...titleProps} {...props}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...shared} {...titleProps} {...props} stroke="none" fill="currentColor">
          <path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3.5 8.5h3v12h-3zM9 8.5h2.9v1.6h.1c.4-.7 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5V20h-3v-4.6c0-1.1 0-2.6-1.6-2.6-1.6 0-1.8 1.2-1.8 2.5V20H9z" />
        </svg>
      );
    default:
      return null;
  }
};
