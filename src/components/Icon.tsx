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
  | 'x';

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
    default:
      return null;
  }
};
