# Node.js API Project

A Node.js API project with advanced features and best practices.

## Features

### Logging System
- Day-wise log file generation for better debugging and monitoring
- Structured logging with timestamp and log levels
- Separate logs for errors, access, and system events

### API Architecture
- Route-specific middleware implementation
- Clean separation of concerns
- CamelCase function naming convention
- Input validation using AJV
- Secure headers with Helmet

### Real-time Communication
- Socket.IO integration
- Route-specific socket event handling
- Real-time data updates
- Bidirectional communication

### Database
- MySQL database integration
- Knex.js as SQL query builder
- Migration support
- Connection pooling
- Structured database queries

### Utilities
- Email service using Nodemailer
- File upload handling with Multer
- Cron job scheduling
- Environment configuration with dotenv
- Request body parsing with body-parser
- Lodash utility functions

## Project Structure
📁 logs/                 # Application logs directory
    └── 3_7_2024.log    # Daily log file
📁 public/              # Static files and assets
📁 src/                 # Source code directory
    ├── Config/         # Configuration files
    │   ├── connection.js  # Database connection setup
    │   └── migrations.js  # Database migrations
    ├── Controller/     # API controllers
    │   └── user.controllers.js  # User controller
    ├── cron/          # Scheduled jobs
    │   └── demo.cron.js  # Example cron job
    ├── events/        # Event handlers
    │   └── demo.events.js  # Example event handler
    ├── language/      # i18n translations
    │   ├── en/       # English translations
    │   │   └── user.json
    │   └── es/       # Spanish translations
    │       └── user.json
    ├── Middleware/    # Custom middleware
    │   └── login.middleware.js  # Auth middleware
    ├── Model/         # Data models
    │   └── user.model.js  # User model
    ├── resources/     # API resources
    │   ├── ap.resource.js   # API resource config
    │   └── user.resource.js # User resource
    ├── Routes/        # API routes
    │   └── user.routes.js  # User routes
    ├── services/      # External services
    │   ├── mail/     # Email service
    │   └── sms/      # SMS service
    ├── socket/       # WebSocket handlers
    │   └── demo.socket.js  # Socket events
    └── Utils/        # Helper utilities

# Core application files
📄 .env              # Environment config
📄 .gitignore       # Git ignore patterns  
📄 app.js           # App entry point
📄 package.json     # Dependencies & scripts



