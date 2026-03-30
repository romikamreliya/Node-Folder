# 🚀 Node.js Advanced API Project

A comprehensive, production-ready Node.js API project with modern architecture, real-time communication, and enterprise-level features. Built with Express.js, Socket.IO, MQTT, and extensive utility integrations for building scalable web applications.

![Node Version](https://img.shields.io/badge/node-22.x-green)
![Express Version](https://img.shields.io/badge/express-5.2.1-green)
![License](https://img.shields.io/badge/license-ISC-blue)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Management](#-database-management)
- [Real-time Features](#-real-time-features)
- [Pending Implementations](#-pending-implementations)
- [Architecture & Design Patterns](#-architecture--design-patterns)
- [Development](#-development)
- [Testing](#-testing)
- [Logging & Monitoring](#-logging--monitoring)
- [Security](#-security)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📌 Overview

This Node.js project is a full-featured API platform designed for enterprise applications. It provides a robust foundation with:

- **RESTful API** with versioning (v1, v2) support
- **Real-time Communication** via Socket.IO
- **IoT Integration** via MQTT
- **Database Support** for MySQL and SQLite
- **Authentication & Authorization** with JWT tokens
- **Background Jobs** with scheduled Cron tasks
- **File Management** with upload capabilities
- **Email Notifications** with HTML templates
- **Request Validation** with AJV schemas
- **Comprehensive Logging** system
- **Worker Threads** for background processing

---

## ✨ Key Features

### 🏗️ **Enterprise-Grade API**
- RESTful API design with Express.js v5.2.1
- Multiple API version support (v1, v2) with route versioning
- MVC architecture with clear separation of concerns
- Route-specific middleware implementation
- Input validation using AJV schema validation
- Request/Response standardization
- Helmet security headers integration
- CORS support with configurable origins
- Rate limiting and request throttling
- Request logging and tracking

### 🔐 **Authentication & Security**
- JWT token generation and verification
- Token refresh mechanism
- Custom token encryption (AES-256-CBC)
- Role-based access control (RBAC) framework
- Secure password handling
- HTTPS/SSL support
- Helmet headers protection
- Rate limiting per IP/endpoint
- Middleware-based authorization checks

### 📊 **Database & ORM**
- Support for MySQL and SQLite databases
- Knex.js v3.1.0 for SQL query building
- Connection pooling for performance
- Database migrations system
- Data seeding capabilities
- Database schema versioning
- Query pagination and filtering
- Transaction support

### 🔄 **Real-time Communication**
- Socket.IO v4.8.3 server implementation
- Socket.IO client v4.8.3 for external connections
- Bi-directional real-time data synchronization
- Event-driven architecture
- Namespace and room support
- Socket event handlers organized by domain

### 📡 **IoT & Messaging**
- MQTT v5.14.1 broker support
- Publish/Subscribe messaging pattern
- Topic-based message routing
- Event-driven MQTT integration

### ⏱️ **Background Processing**
- Cron scheduling with flexible time expressions
- Multiple job scheduling support
- Worker threads for CPU-intensive tasks
- Async task execution
- Job status monitoring

### 📧 **Integrations**
- **Email Service**: Nodemailer integration with HTML templates
- **SMS Service**: Framework ready (implementation pending)
- **Payment Processing**: Framework ready (implementation pending)
- **Notifications**: Push/In-app notification framework (implementation pending)

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 22.x |
| **Framework** | Express.js | 5.2.1 |
| **Real-time** | Socket.IO | 4.8.3 |
| **Messaging** | MQTT | 5.14.1 |
| **Database** | Knex.js | 3.1.0 |
| **DB Drivers** | MySQL, SQLite3 | Latest |
| **Validation** | AJV | 8.17.1 |
| **Security** | Helmet | 8.1.0 |
| **Rate Limiting** | express-rate-limit | 8.2.1 |
| **Scheduling** | Cron | 4.4.0 |
| **File Upload** | Multer | 2.0.2 |
| **Email** | Nodemailer | 7.0.11 |
| **Logging** | Winston | 3.11.0 |
| **JWT** | jsonwebtoken | 9.0.3 |
| **Testing** | Jest | Latest |
| **Templating** | EJS | 3.1.10 |

---

## 📁 Project Structure

```
root/
├── app.js                          # Main application entry point
├── ecosystem.config.js             # PM2 ecosystem configuration
├── jest.config.js                  # Jest testing configuration
├── package.json                    # Dependencies and scripts
├── test.yml                        # Artillery load testing configuration
├── Jenkinsfile                     # Jenkins CI/CD configuration
├── crt/                            # SSL certificates
├── logs/                           # Application logs
├── public/
│   ├── assets/                     # Static assets (CSS, JS, images)
│   ├── test/                       # Test files
│   └── upload/                     # User uploaded files
├── src/
│   ├── common/                     # Base classes and abstractions
│   │   ├── baseConnection.js       # Database connection wrapper
│   │   ├── baseController.js       # Controller base class
│   │   ├── baseMiddleware.js       # Middleware base class
│   │   ├── baseModel.js            # Model base class
│   │   ├── baseMqtt.js             # MQTT base class
│   │   ├── baseResources.js        # Resource transformer base
│   │   ├── baseServices.js         # Service base class
│   │   ├── baseSocket.js           # Socket.IO base class
│   │   └── baseWorker.js           # Worker threads base class
│   ├── config/
│   │   ├── app.config.js           # Express app configuration
│   │   ├── event.config.js         # Event emitter setup
│   │   ├── mqtt.config.js          # MQTT configuration
│   │   ├── socket-client.config.js # Socket.IO client config
│   │   └── socket.config.js        # Socket.IO server config
│   ├── controllers/
│   │   ├── demoController.js       # Demo/test endpoints
│   │   ├── userController.js       # User management endpoints
│   │   └── webController.js        # Web view rendering
│   ├── cron/
│   │   ├── demo.cron.js            # Demo cron job (disabled)
│   │   └── test.cron.js            # Test cron job (disabled)
│   ├── database/
│   │   ├── migrations.js           # Migration runner
│   │   ├── seeder.js               # Seeder runner
│   │   ├── migrations_files/
│   │   │   └── 001_create_users_table.js
│   │   └── seeds/
│   │       └── 01_seed_users.js
│   ├── integrations/
│   │   ├── mail/
│   │   │   └── mail.service.js     # Nodemailer integration
│   │   ├── notification/           # PENDING: Push notifications
│   │   ├── payments/               # PENDING: Payment gateway
│   │   └── sms/                    # PENDING: SMS provider
│   ├── language/
│   │   └── en/
│   │       └── message.js          # Localization messages
│   ├── middleware/
│   │   ├── api.middleware.js       # Auth & authorization
│   │   ├── error.middleware.js     # Error handling
│   │   ├── ratelimit.middleware.js # Rate limiting
│   │   └── request-logger.middleware.js
│   ├── models/
│   │   └── user.model.js           # User data model
│   ├── mqtt/
│   │   ├── publish.mqtt.js         # MQTT publisher
│   │   └── subscribe.mqtt.js       # MQTT subscriber
│   ├── resources/
│   │   └── user.resources.js       # User resource transformer
│   ├── routes/
│   │   ├── api.routes.js           # API route definitions
│   │   └── web.routes.js           # Web route definitions
│   ├── services/
│   │   └── user.services.js        # User business logic
│   ├── socket/
│   │   ├── client/
│   │   │   └── test.socketclient.js
│   │   └── server/
│   │       └── test.socket.js      # Socket.IO handlers
│   ├── template/
│   │   ├── mail/
│   │   │   └── resetPassword.html
│   │   └── pdf/
│   │       └── samplePDF.html
│   ├── utils/
│   │   ├── ajv.utils.js            # Validation utilities
│   │   ├── appError.utils.js       # Custom error class
│   │   ├── constants.js            # Application constants
│   │   ├── date.utils.js           # Date utilities
│   │   ├── helper.utils.js         # Helper functions
│   │   ├── i18n.utils.js           # Internationalization
│   │   ├── logger.utils.js         # Winston logging
│   │   ├── memory.utils.js         # Memory utilities
│   │   ├── performance.utils.js    # Performance utilities
│   │   ├── response.utils.js       # Response formatter
│   │   ├── token.utils.js          # Token generation/verification
│   │   ├── upload.utils.js         # File upload handler
│   ├── validations/
│   │   └── user.schemas.js         # AJV validation schemas
│   ├── views/
│   │   └── home.ejs                # EJS template
│   └── workers/
│       ├── test.worker.js
│       └── worker.js               # Worker thread executor
└── tests/
    ├── helpers/
    │   └── constants-helpers.js
    └── integration/
        └── index.test.js           # Jest integration tests
```

---

## 📋 Prerequisites

- **Node.js**: v22.x or higher
- **npm**: v10.x or higher
- **MySQL**: v8.x (for database persistence)
- **SQLite3**: (for lightweight alternative)
- **MQTT Broker**: (optional, for IoT features)

---

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Node-Folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section)

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
HTTPS_ENABLED=false

# Database Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=node_app
DB_CONNECTION_LIMIT=10

# Authentication
JWT_SECRET=your_jwt_secret_key_here
TOKEN_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=86400
AES_SECRET=your_aes_secret_key_here

# Socket.IO Configuration
SOCKET_CLIENT_URL=http://localhost:3000

# MQTT Configuration
MQTT_URL=mqtt://localhost:1883
MQTT_TOPIC_PREFIX=app/v1

# Email Configuration
MAIL_SERVICE=gmail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=noreply@app.com

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Logging
LOG_LEVEL=info
LOG_FORMAT=combined

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm start
```

### Database Setup
```bash
# Run all migrations and seeders
npm run db:setup

# Create new migration
npm run migration:create

# Run pending migrations
npm run db:migrate

# Rollback migrations
npm run migration:rollback

# Check migration status
npm run migration:status

# Create new seeder
npm run seeder:create

# Run seeders
npm run db:seeder
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

### Load Testing
```bash
npm run load-test
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### User Endpoints

#### Get All Users
```
GET /api/v1/user/get
Headers: Authorization: Bearer <token>
Response: 
{
  "res": true,
  "msg": "Success",
  "data": {
    "data": [...users],
    "pagination": { currentPage, limit, totalPages, totalRows }
  }
}
```

#### Create User
```
POST /api/v1/user/add
Headers: Authorization: Bearer <token>
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "secure_password",
  "status": "active"
}
```

#### Update User
```
PUT /api/v1/user/update
Headers: Authorization: Bearer <token>
Body: { id, ...fields to update }
```

#### Delete User
```
DELETE /api/v1/user/delete
Headers: Authorization: Bearer <token>
Body: { id }
```

#### Filter Users
```
POST /api/v1/user/filter
Headers: Authorization: Bearer <token>
Body: { name, id, range }
```

### Public Demo Endpoints

#### Test Endpoint
```
GET /api/v1/public/test
```

#### Validate Data
```
POST /api/v1/public/ajv
Body: { validation payload }
```

#### Generate Token
```
POST /api/v1/public/token
Response: { customToken, jwtToken, refreshToken }
```

---

## 🗄️ Database Management

### Migrations

Migrations are managed through Knex.js. Create new migrations in `src/database/migrations_files/`:

```javascript
exports.up = async (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.timestamps();
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTable('users');
};
```

### Seeders

Create seeders in `src/database/seeds/`:

```javascript
exports.seed = async (knex) => {
  await knex('users').insert([
    { name: 'John', email: 'john@example.com' }
  ]);
};
```

---

## 🔌 Real-time Features

### Socket.IO Server
- Main namespace: `/`
- Events are handled in `src/socket/server/test.socket.js`
- Supports custom namespace and room-based communication

### Socket.IO Client
- Connects to Socket.IO server
- Configuration in `src/config/socket-client.config.js`
- Implemented in `src/socket/client/test.socketclient.js`

### MQTT Integration
- Publisher: `src/mqtt/publish.mqtt.js`
- Subscriber: `src/mqtt/subscribe.mqtt.js`
- Topic-based message routing
- Integration with app event system

---

## ⏳ Pending Implementations

### 🔴 Critical Priority

1. **SMS Service Integration** (`src/integrations/sms/`)
   - Need SMS provider (Twilio, AWS SNS, etc.)
   - Implement SMS sending functionality

2. **Payment Gateway Integration** (`src/integrations/payments/`)
   - Support for Stripe, PayPal, Razorpay
   - Payment processing and webhooks

3. **Notification System** (`src/integrations/notification/`)
   - Push notifications
   - In-app notifications
   - Email notifications

### 🟡 High Priority

4. **Enable Cron Jobs**
   - Uncomment and test: `demoCron.Run()` and `testCron.Run()` in `app.js`
   - Verify task execution

5. **Implement Permission Authorization**
   - Uncomment permission logic in `src/middleware/api.middleware.js`
   - Connect with RBAC system

6. **Socket.IO Authentication**
   - Enable token verification in `src/socket/server/test.socket.js`
   - Integrate Redis for session management

7. **Complete Filter Functionality**
   - Implement filter logic in `src/controllers/demoController.js`
   - Add complex query support

### 🟠 Medium Priority

8. **Expand Test Coverage**
   - Add tests for protected endpoints
   - Add integration tests for MQTT, Socket.IO
   - Add performance tests

9. **Additional Database Migrations**
   - Create migrations for other entities
   - Add comprehensive seeders

10. **Worker Thread Implementation**
    - Implement actual business logic in `src/workers/test.worker.js`
    - Use for CPU-intensive operations

---

## 🏛️ Architecture & Design Patterns

### MVC Pattern
- **Models**: Data layer with Knex.js
- **Views**: EJS templates for rendering
- **Controllers**: Request handlers with business logic

### Base Classes
- `BaseController`: Common controller functionality
- `BaseServices`: Service layer abstractions
- `BaseModel`: ORM model wrapper
- `BaseMiddleware`: Middleware utilities
- `BaseSocket`: Socket.IO handler base
- `BaseMqtt`: MQTT integration base

### Resource Pattern
- `userResources.js`: Transforms raw data to API response format
- Centralized response formatting
- Consistent API responses

### Dependency Injection
- Base classes provide common utilities
- Service locator pattern via static methods
- Mixin classes for shared functionality

---

## 👨‍💻 Development

### Code Style
- ES6+ syntax
- Async/await for asynchronous operations
- Arrow functions for callbacks
- Consistent naming conventions

### Adding New Features

1. **Create a new model** in `src/models/`
2. **Create a service** in `src/services/`
3. **Create a controller** in `src/controllers/`
4. **Create validation schemas** in `src/validations/`
5. **Register routes** in `src/routes/api.routes.js`
6. **Add tests** in `tests/integration/`

---

## 🧪 Testing

### Jest Configuration
- Test environment: Node.js
- Test files: `*.test.js`
- Coverage reports generated in `coverage/`

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- user.test.js

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Structure

```javascript
describe("Feature Name", () => {
  it("should perform expected action", async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

---

## 📊 Logging & Monitoring

### Winston Logger
- Configured in `src/utils/logger.utils.js`
- Log levels: error, warn, info, debug
- Logs stored in `logs/` directory

### Request Logging
- All requests logged by middleware
- Request ID tracking
- Response time measurement

### Monitoring Tools
- Error tracking: Winston logs
- Performance tracking: `performance.utils.js`
- Memory monitoring: `memory.utils.js`

---

## 🔒 Security

### Authentication
- JWT tokens for API access
- Custom token encryption (AES-256-CBC)
- Auto token expiry and refresh

### Authorization
- Role-Based Access Control (RBAC)
- Permission-based route protection
- Endpoint-level authorization checks

### Other Security Measures
- Helmet security headers
- CORS configuration
- Rate limiting
- HTTPS/SSL support
- Input validation with AJV
- SQL injection prevention via Knex.js
- Secure password handling

---

## 🚀 Deployment

### With PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

### With Jenkins
- Pipeline configured in `Jenkinsfile`
- Automated testing on every push
- Automated deployment on release

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check MySQL service
mysql -u root -p

# Verify .env database credentials
# Run migrations to create tables
npm run db:setup
```

### Port Already in Use
```bash
# Change PORT in .env file
# Or kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MQTT Connection Issues
```bash
# Verify MQTT broker is running
# Check MQTT_URL in .env
# View MQTT logs
```

### Socket.IO Connection Problems
- Check CORS settings in `.env`
- Verify Socket.IO middleware
- Check browser console for errors

---

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

### Commit Message Format
```
[TYPE] Brief description

Detailed explanation of changes

Fixes #issue_number
```

**Types**: feat, fix, docs, style, refactor, test, chore

---

## 📄 License

ISC License - see LICENSE file for details

---

## 📧 Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Last Updated**: March 30, 2026
**Maintainer**: Development Team
**Status**: Active Development ✅
