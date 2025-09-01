# Smart Event Scheduler

A comprehensive, AI-powered calendar management application built with Next.js 15, TypeScript, and modern web technologies.

## Features

### 🤖 AI-Powered Scheduling
- Intelligent meeting time suggestions based on availability patterns
- Automatic conflict detection and resolution
- Optimal time slot recommendations for multiple participants
- Smart travel time calculations with buffer periods

### 🔄 Real-time Collaboration
- Live calendar sharing with granular permissions
- Real-time event updates using Socket.IO
- Collaborative editing with conflict resolution
- Live typing indicators and presence awareness

### 📅 Advanced Calendar Management
- FullCalendar integration with drag-and-drop functionality
- Multiple view types (month, week, day, agenda, year)
- Comprehensive recurring event system
- Time zone support with automatic conversion
- Event categorization and color coding

### 🌦️ Smart Integrations
- Weather-aware scheduling for outdoor events
- Travel time integration with Google Maps
- Video meeting link generation (Zoom/Teams/Google Meet)
- Email notification system with customizable templates

### 🔐 Enterprise Security
- NextAuth.js with multiple OAuth providers (Google, GitHub)
- Role-based access control (RBAC)
- Secure session management
- Input validation and sanitization

### 📊 Analytics & Insights
- Productivity analytics dashboard
- Scheduling pattern analysis
- Peak hours and preferred days insights
- Meeting efficiency metrics

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with OAuth providers
- **Real-time**: Socket.IO for live collaboration
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Animations**: Framer Motion for smooth interactions
- **Calendar**: FullCalendar for advanced calendar functionality
- **Validation**: Zod for type-safe data validation
- **Styling**: Tailwind CSS with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Environment variables (see .env.example)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-event-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- MongoDB connection string
- NextAuth secret and OAuth provider credentials
- External API keys (OpenWeather, Google Maps)
- Email server configuration (optional)

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Required environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/smart-event-scheduler

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret

# External APIs
OPENWEATHER_API_KEY=your-openweather-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Project Structure

```
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── analytics/         # Analytics pages
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── calendar/          # Calendar-related components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # UI components (Shadcn/ui)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── models/                # MongoDB models
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Events
- `GET /api/events` - Get user events
- `POST /api/events` - Create new event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### AI Features
- `POST /api/ai/suggest-time` - Get AI scheduling suggestions

### Weather
- `GET /api/weather` - Get weather data for location

### Real-time
- `GET /api/socketio` - Socket.IO connection endpoint

## Database Models

### User Model
- Basic user information and authentication
- User preferences (timezone, working hours, defaults)
- Role-based permissions

### Event Model
- Complete event information with attendees
- Recurring event patterns
- Reminders and notifications
- Location and weather dependency
- Real-time collaboration notes

### EventCategory Model
- Custom event categories with colors
- User-specific categorization system

### CalendarShare Model
- Calendar sharing permissions
- Multi-user collaboration settings

## Development Features

### Code Quality
- Strict TypeScript configuration
- ESLint and Prettier setup
- Zod validation schemas
- Comprehensive error handling

### Performance
- Optimized MongoDB queries with indexes
- Efficient real-time updates
- Lazy loading and code splitting
- Image optimization

### Security
- Input validation and sanitization
- CSRF protection
- Rate limiting (ready for implementation)
- Secure session management

## Deployment

The application is configured for deployment on platforms like Vercel, Netlify, or any Node.js hosting provider.

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.