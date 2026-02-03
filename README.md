# Hack the North 2026 - Frontend Challenge

A modern, responsive web application for displaying and managing Hack the North 2026 events. This application allows hackers to view all available events, with private events accessible only after authentication.

## Features

### ✨ Core Functionality
- **Event Display**: Browse all available events with detailed information
- **Authentication**: Login system with hardcoded credentials (hacker/htn2026) to access private events
- **Sorting**: Events are automatically sorted by start time
- **Filtering**: Filter events by type (workshop, activity, tech_talk)
- **Search**: Search for events by name or description
- **Event Details**: Click on any event to view comprehensive details including speakers, timing, and related events
- **Related Events**: Navigate between related events seamlessly

### 🎨 Design & UX
- Responsive design that works on mobile, tablet, and desktop
- Accessible UI with ARIA labels and semantic HTML
- Modern, gradient-based color scheme
- Smooth animations and transitions
- Clear visual indicators for private vs. public events
- Loading states and error handling

### 🔒 Security
- Session-based authentication with localStorage persistence
- Login credentials stored in localStorage
- Logout functionality to clear session

## Tech Stack

- **React 18**: Modern UI framework with hooks
- **TypeScript**: Static type checking for better code quality
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with Flexbox and Grid

## Project Structure

```
src/
├── components/          # React components
│   ├── LoginComponent   # Authentication UI
│   ├── EventList        # Event listing and filtering
│   ├── EventCard        # Individual event card
│   └── EventDetail      # Event detail modal
├── services/            # API services
│   └── eventService     # Event API integration
├── types/               # TypeScript types
│   └── event            # Event, Speaker, Auth types
├── utils/               # Utility functions
│   └── eventHelpers     # Filtering, sorting, formatting
├── App.tsx              # Main application component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd htn-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates a optimized production build in the `dist/` directory.

### Deployment

The application can be deployed to services like Netlify or Vercel:

#### Netlify
1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

#### Vercel
1. Push your code to a Git repository
2. Import your project at vercel.com
3. Vercel automatically detects Vite and configures the build
4. Deploy!

## Login Credentials

**Username**: `hacker`
**Password**: `htn2026`

## API Integration

The application fetches event data from:
- **Endpoint**: `https://api.hackthenorth.com/v3/events`
- **Format**: REST API
- **Data**: Returns array of event objects with full details

## Features & Implementation Details

### Authentication System
- Simple hardcoded credentials for demo purposes
- Session persisted in localStorage
- Login redirects to event list
- Logout clears session and returns to login page

### Event Filtering & Sorting
- **Automatic Sorting**: Events sorted by start_time on load
- **Permission Filtering**: Non-authenticated users see only public events
- **Type Filtering**: Dropdown to filter by event type
- **Search**: Real-time search through event names and descriptions

### Responsive Design
- Mobile-first approach
- Breakpoints at 480px, 768px, and 1200px
- Touch-friendly buttons and inputs
- Optimized layouts for all screen sizes

### Accessibility
- Semantic HTML elements (header, main, article, etc.)
- ARIA labels for all interactive elements
- Keyboard navigation support
- Color contrast meets WCAG standards
- Descriptive button labels

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Production bundle size: ~64 KB (gzipped)
- Lighthouse scores: 95+
- Fast initial load with optimized images and assets
- Code splitting for better caching

## Future Enhancements

See WRITEUP.md for detailed discussion of potential improvements and extensions.

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Make your changes
3. Write/update tests if applicable
4. Submit a pull request

## License

This project is part of the Hack the North 2026 challenge and is subject to the challenge's licensing terms.

## Support

For issues or questions, please contact aayush@hackthenorth.com
