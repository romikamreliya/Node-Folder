# 🚀 Node.js Advanced API Project

A comprehensive, production-ready Node.js API project with modern architecture, real-time communication, and enterprise-level features. Built with Express.js, Socket.IO, MQTT, and extensive utility integrations.

![Node Version](https://img.shields.io/badge/node-22.x-green)
![License](https://img.shields.io/badge/license-ISC-blue)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

---

## 📑 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Setup](#-database-setup)
- [Real-time Communication](#-real-time-communication)
- [File Upload](#-file-upload)
- [Email Service](#-email-service)
- [Cron Jobs](#-cron-jobs)
- [Testing](#-testing)
- [Logging](#-logging)
- [Security](#-security)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏗️ **API Architecture**
- RESTful API design with Express.js v5.2.1
- Route-specific middleware implementation
- Clean separation of concerns (MVC pattern)
- Input validation using AJV schema validation
- Secure headers with Helmet
- CORS support with configurable origins
- Rate limiting and throttling capabilities
- Request/Response standardization

### 📝 **Logging System**
- Day-wise log file generation for monitoring
- Structured logging with timestamp and severity levels
- Separate logs for errors, access, and system events
- Configurable log levels (debug, info, warn, error)
- File rotation and archiving support

### 🔐 **Authentication & Authorization**
- JWT token generation and verification
- Custom token encryption (AES-256-CBC)
- Refresh token mechanism
- Role-based permission checking
- Secure token validation middleware

### 🔄 **Real-time Communication**
- Socket.IO v4.7.5 server implementation
- Socket.IO client v4.8.1 for external connections
- Route-specific socket event handling
- Bi-directional data synchronization
- Event-driven architecture support

### 📊 **Database Management**
- MySQL and SQLite support
- Knex.js v3.1.0 as SQL query builder
- Connection pooling for performance optimization
- Database migrations support
- Data seeding capabilities
- Query pagination and filtering

### 📧 **Email Service**
- Nodemailer v7.0.11 integration
- Multi-provider support (Gmail, custom SMTP)
- HTML/Text email templates
- Attachment support
- CC, BCC, Reply-To functionality

### 📤 **File Upload Management**
- Multer v2.0.2 for form-data handling
- Image upload and validation
- Configurable upload paths
- File size restrictions
- Multiple file support

### 📅 **Scheduled Tasks**
- Cron job scheduling with cron v4.4.0
- Background job execution
- Time-based task automation
- Error handling and retry logic

### 📡 **IoT Integration**
- MQTT v5.14.1 broker support
- Publish/Subscribe messaging
- Connection management
- Topic-based routing

### ⚙️ **Utilities**
- Lodash v4.17.21 for utility functions
- Environment variable management with dotenv
- Common constants and configurations
- Helper functions and utilities
- Token utilities for encryption/decryption

### 🧵 **Worker Threads**
- Background processing for heavy operations
- CPU-intensive task handling
- Examples included:
  - Big loops/calculations
  - Data compression
  - Image/video processing
  - Password hashing
  - PDF generation
  - API load testing

### 🧪 **Testing**
- Jest v30.2.0 for unit testing
- Supertest v7.1.4 for API integration testing
- Test configuration ready
- CI/CD pipeline support (Jenkins)

---

## 📁 Project Structure

```
Node-Folder/
├── src/
│   ├── Config/              # Configuration files
│   │   ├── app.config.js           # Express app configuration
│   │   ├── event.config.js         # Event emitter setup
│   │   ├── mqtt.config.js          # MQTT configuration
│   │   ├── socket.config.js        # Socket.IO server setup
│   │   ├── socket-client.config.js # Socket.IO client setup
│   │   ├── migrations.js           # Database migrations
│   │   └── seeder.js               # Database seeding
│   │
│   ├── Controllers/         # Request handlers
│   │   ├── user.controller.js      # User operations
│   │   └── web.controller.js       # Web page rendering
│   │
│   ├── Models/              # Database models
│   │   ├── user.model.js           # User data model
│   │   └── baseModel.js            # Base model for shared logic
│   │
│   ├── Routes/              # API routes
│   │   ├── api.routes.js           # API v1/v2 routes
│   │   └── web.routes.js           # Web routes
│   │
│   ├── Middleware/          # Custom middleware
│   │   ├── api.middleware.js       # API authentication & permissions
│   │   └── ratelimit.middleware.js # Rate limiting
│   │
│   ├── Services/            # Business logic services
│   │   ├── mail/
│   │   │   └── mail.service.js     # Email sending
│   │   └── multer/
│   │       └── image.multer.js     # Image upload handler
│   │
│   ├── Database/            # Database layer
│   │   ├── connection.js           # DB connection setup
│   │   ├── baseModel.js            # Base model class
│   │   ├── migrations.js           # Migration runner
│   │   └── seeder.js               # Data seeding
│   │
│   ├── Socket/              # Real-time communication
│   │   ├── Server/
│   │   │   └── test.socket.js      # Server socket handlers
│   │   └── Client/
│   │       └── test.socketclient.js # Client socket handlers
│   │
│   ├── Mqtt/                # MQTT messaging
│   │   ├── publish.mqtt.js         # MQTT publish logic
│   │   └── subscribe.mqtt.js       # MQTT subscribe logic
│   │
│   ├── Cron/                # Scheduled tasks
│   │   ├── demo.cron.js            # Demo cron job
│   │   └── test.cron.js            # Test cron job
│   │
│   ├── Workers/             # Background workers
│   │   ├── worker.js               # Worker base
│   │   └── test.worker.js          # Test worker
│   │
│   ├── Utils/               # Utility functions
│   │   ├── ajv.utils.js            # JSON schema validation
│   │   ├── commonConst.js          # Common constants
│   │   ├── helper.utils.js         # Helper functions
│   │   ├── i18n.utils.js           # Internationalization
│   │   ├── logger.utils.js         # Logging utility
│   │   ├── response.utils.js       # Response formatting
│   │   └── token.utils.js          # Token management
│   │
│   ├── Resources/           # Resource formatters
│   │   ├── api.resources.js        # API response resources
│   │   └── user.resources.js       # User response formatting
│   │
│   ├── Middleware/          # Middleware functions
│   │   └── ...
│   │
│   ├── Language/            # Internationalization
│   │   └── en/
│   │       └── message.js          # English messages
│   │
│   ├── Template/            # Email & document templates
│   │   ├── Mail/
│   │   │   └── resetPassword.html  # Password reset email
│   │   └── PDF/
│   │       └── samplePDF.html      # PDF template
│   │
│   └── Views/               # EJS templates
│       └── home.ejs                # Home page template
│
├── tests/                   # Test files
│   └── index.test.js               # Main test file
│
├── public/                  # Static files
│   ├── assets/                     # CSS, JS, images
│   ├── test/                       # Test files
│   └── upload/                     # User uploads
│
├── logs/                    # Application logs
│   ├── error.log
│   ├── access.log
│   └── system.log
│
├── app.js                   # Application entry point
├── jest.config.js           # Jest configuration
├── package.json             # Project dependencies
├── package-lock.json        # Locked dependency versions
├── .env                     # Environment variables (local)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── Jenkinsfile              # Jenkins CI/CD pipeline
├── test.yml                 # Test configuration
└── README.md                # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v22.x or higher ([Download](https://nodejs.org/))
- **npm** v10.x or higher (comes with Node.js)
- **MySQL** v8.0+ (if using MySQL database)
- **SQLite3** (or use SQLite database file)
- **MQTT Broker** (optional, for IoT features)
- **Git** v2.34+ (for version control)

### Optional Tools
- Docker & Docker Compose (for containerized deployment)
- Postman or Insomnia (for API testing)
- VS Code with recommended extensions

---

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/node-folder.git
cd node-folder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# See Configuration section below
```

### 4. Database Setup

**For SQLite (Default):**
```bash
npm run migration  # Run migrations
npm run seeder     # Seed initial data
```

**For MySQL:**
```bash
# Update .env with MySQL credentials
DB_TYPE=mysql
DBHOST=localhost
DBPORT=3306
DBNAME=your_database
DBUSER=your_username
DBPASS=your_password

# Then run
npm run migration
npm run seeder
```

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Application
NAME="Node API"
PORT=3008
NODE_APP_ENV=development  # development, production, test
DEBUG=true

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,https://yourdomain.com

# Database Configuration
DB_TYPE=sqlite              # sqlite or mysql
DBFILE=db.sqlite            # For SQLite
DBHOST=127.0.0.1            # For MySQL
DBPORT=3306                 # For MySQL
DBNAME=test                 # For MySQL
DBUSER=root                 # For MySQL
DBPASS=password             # For MySQL

# Security & Tokens
algorithm=aes-256-cbc
accessTokenKey=your-secret-key
refressTokenKey=your-refresh-key

# Email Configuration
service=gmail
host=smtp.gmail.com
port=465
secure=true
user=your-email@gmail.com
pass=your-app-password

# File Upload
path=./public

# MQTT Configuration
MQTT_URL=mqtt://broker.hivemq.com:1883

# Socket Client
SOCKET_CLIENT_URL=https://your-socket-server.com

# Language
default_language=en
```

### Application Configuration

**src/Config/app.config.js:**
```javascript
// CORS allowed origins
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:8080"

// Body parser limits
BODY_SIZE_LIMIT=10kb

// Session timeout
SESSION_TIMEOUT=30000
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm start
```

Output:
```
App listening on port 3008
✅ Connected to broker: mqtt://broker.hivemq.com:1883
```

### With Hot Reload (using nodemon - optional)
```bash
npm install --save-dev nodemon
npx nodemon app.js
```

### Production Mode
```bash
NODE_APP_ENV=production npm start
```

### Run Tests
```bash
npm test
```

### Database Operations
```bash
# Run migrations
npm run migration

# Seed database
npm run seeder
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3008/api/v1
http://localhost:3008/api/v2
```

### User Endpoints

#### 1. Test Endpoint
```http
GET /api/v1/user/test
```
**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "data": "aass",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

#### 2. Generate Token
```http
POST /api/v1/user/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "customAccessToken": "encrypted-token",
    "JwtAccessToken": "jwt-token",
    "customRefreshToken": "refresh-token"
  }
}
```

#### 3. Validate Token
```http
POST /api/v1/user/tokenCheck
Content-Type: application/json
Authorization: Bearer {token}

{
  "token": "your-token-here"
}
```

#### 4. JSON Validation (AJV)
```http
POST /api/v1/user/ajv
Content-Type: application/json

{
  "type": "admin",
  "name": "John Doe",
  "email": "john@example.com",
  "email_two": "john2@example.com",
  "phone": "+1234567890",
  "website": "https://example.com",
  "array": [
    {"name": "User 1", "email": "user1@example.com"},
    {"name": "User 2", "email": "user2@example.com"}
  ],
  "object": {
    "name": "Object Name",
    "email": "obj@example.com"
  }
}
```

#### 5. Filter Users
```http
POST /api/v1/user/filter
Content-Type: application/json

{
  "name": "John",
  "id": 5,
  "range": [1, 100]
}
```

#### 6. Get All Users (Protected)
```http
GET /api/v1/user/get
Authorization: Bearer {token}
```

#### 7. Add User (Protected)
```http
POST /api/v1/user/add
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "New User",
  "email": "newuser@example.com",
  "phone": "+1234567890"
}
```

#### 8. Get API Version
```http
POST /api/v1/user/apiVersion
```
**Response:**
```json
{
  "version": "v1"
}
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "data": {},
  "message": "Operation successful",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "code": "ERROR",
  "message": "Error description",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

---

## 🗄️ Database Setup

### MySQL Setup

#### 1. Create Database
```sql
CREATE DATABASE test;
USE test;
```

#### 2. Run Migrations
```bash
npm run migration
```

#### 3. Seed Data
```bash
npm run seeder
```

#### 4. User Table Example
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### SQLite Setup

1. Automatic database file creation at `./db.sqlite`
2. Run migrations: `npm run migration`
3. Seed data: `npm run seeder`

---

## 🔄 Real-time Communication

### Socket.IO Server Events

#### Connection
```javascript
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});
```

#### Sending Data
```javascript
// Emit to specific client
socket.emit('message', {type: 'welcome', message: 'Connected'});

// Broadcast to all clients
io.emit('broadcast', {message: 'Server message'});

// Emit to specific room
io.to('roomName').emit('roomEvent', data);
```

#### Receiving Data
```javascript
socket.on('clientEvent', (data) => {
  console.log('Received:', data);
});
```

### Socket.IO Client Events

#### Connection
```javascript
const socket = io('http://localhost:3008');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

#### Sending Events
```javascript
socket.emit('userAction', {action: 'type', value: 'data'});
```

#### Listening to Events
```javascript
socket.on('serverResponse', (data) => {
  console.log('Server sent:', data);
});
```

---

## 📤 File Upload

### Image Upload

#### Endpoint
```http
POST /api/v1/user/upload-image
Content-Type: multipart/form-data
Authorization: Bearer {token}

[file]: image.jpg
```

#### Configuration
- **Max file size:** 5MB (configurable)
- **Allowed types:** jpg, jpeg, png, gif
- **Upload path:** `./public/upload/`

#### Example Usage
```bash
curl -X POST http://localhost:3008/api/v1/user/upload-image \
  -H "Authorization: Bearer your-token" \
  -F "file=@image.jpg"
```

---

## 📧 Email Service

### Send Email

```javascript
const MailService = require('./src/Services/mail/mail.service');

await MailService.sendmail({
  to: 'recipient@example.com',
  subject: 'Hello',
  html: '<h1>Welcome</h1>',
  text: 'Welcome email',
  cc: 'cc@example.com',
  attachments: [
    {
      filename: 'document.pdf',
      path: './documents/file.pdf'
    }
  ]
});
```

### Email Templates

Located in `src/Template/Mail/`:
- **resetPassword.html** - Password reset email template

### Configuration
Set in `.env`:
```env
service=gmail
host=smtp.gmail.com
port=465
secure=true
user=your-email@gmail.com
pass=your-app-password
```

---

## 📅 Cron Jobs

### Available Cron Jobs

Located in `src/Cron/`:
- **demo.cron.js** - Demo job (every 5 minutes)
- **test.cron.js** - Test job (every 10 minutes)

### Enable Cron Jobs

In `app.js`, uncomment:
```javascript
Cron() {
    TestCron.Run();
    DemoCron.Run();
}
```

### Create Custom Cron Job

```javascript
// src/Cron/custom.cron.js
const cron = require('cron');

class CustomCron {
    static Run() {
        // Run every day at 2 AM
        cron.schedule('0 2 * * *', () => {
            console.log('Running scheduled task');
            // Your task here
        });
    }
}

module.exports = CustomCron;
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Unit Test Example
```javascript
// tests/unit/user.controller.test.js
const UserController = require('../../src/Controllers/user.controller');

describe('UserController', () => {
  let controller;

  beforeEach(() => {
    controller = new UserController();
  });

  test('should get all users', async () => {
    const result = await controller.getAllUser({}, {});
    expect(result).toBeDefined();
  });
});
```

### Integration Test Example
```javascript
// tests/integration/user.api.test.js
const request = require('supertest');
const { app } = require('../../app');

describe('User API', () => {
  test('GET /api/v1/user/test', async () => {
    const response = await request(app)
      .get('/api/v1/user/test')
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

---

## 📝 Logging

### Log Levels
- **error** - Error level logs
- **warn** - Warning level logs
- **info** - Information level logs
- **debug** - Debug level logs

### Log Files Location
```
logs/
├── error.log      # All errors
├── access.log     # All requests
└── system.log     # System events
```

### Using Logger
```javascript
const LoggerUtils = require('./src/Utils/logger.utils');

LoggerUtils.createLog({
  msg: 'Your message',
  name: 'component-name'
});

// Or directly
LoggerUtils.info('Info message');
LoggerUtils.error('Error message', error);
LoggerUtils.warn('Warning message');
LoggerUtils.debug('Debug message', data);
```

---

## 🔐 Security

### Security Features Implemented
1. **Helmet** - HTTP security headers
2. **CORS** - Cross-Origin Resource Sharing
3. **Rate Limiting** - DDoS protection
4. **JWT** - Token-based authentication
5. **Input Validation** - AJV schema validation
6. **Environment Variables** - Secure configuration
7. **Encrypted Tokens** - AES-256-CBC encryption

### Security Best Practices

#### 1. Environment Variables
- Never commit `.env` to repository
- Use `.env.example` as template
- Keep sensitive data in environment

#### 2. Database
- Use parameterized queries (Knex handles this)
- Avoid SQL concatenation
- Implement proper indexing

#### 3. Authentication
- Always use HTTPS in production
- Set secure cookie flags
- Implement token expiration
- Use strong hashing (bcrypt)

#### 4. API Security
- Validate all inputs
- Implement rate limiting
- Use CORS whitelist
- Remove debug info in production

---

## 🐳 Deployment

### Docker Setup

#### Build Image
```bash
docker build -t node-api .
```

#### Run Container
```bash
docker run -d -p 3008:3008 \
  -e NODE_APP_ENV=production \
  -e DB_TYPE=mysql \
  --name node-api \
  node-api
```

#### Docker Compose
```bash
docker-compose up -d
```

### Production Checklist
- [ ] Set `NODE_APP_ENV=production`
- [ ] Use strong encryption keys
- [ ] Enable HTTPS/SSL
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Enable authentication
- [ ] Test all endpoints
- [ ] Set up CI/CD pipeline
- [ ] Create backups

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port 3008
lsof -i :3008

# Or change port in .env
PORT=3009
```

#### 2. Database Connection Error
```bash
# Check MySQL is running
# Verify credentials in .env
# Ensure database exists

mysql -u root -p
> CREATE DATABASE test;
```

#### 3. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Update `ALLOWED_ORIGINS` in `.env`

#### 4. Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 5. Token Validation Failed
```bash
# Check token format: "Bearer {token}"
# Verify token hasn't expired
# Check encryption keys match
```

---

## 📞 Support & Contribution

### Getting Help
1. Check [Code Quality Report](CODE_QUALITY_REPORT.md)
2. Review logs in `logs/` directory
3. Open GitHub issue with details
4. Contact development team

### Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/name`
5. Open Pull Request

### Code Quality
- Follow ESLint rules
- Add JSDoc comments
- Write unit tests
- Update documentation

---

## 📄 License

This project is licensed under the **ISC License** - see LICENSE file for details.

---

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- Socket.IO for real-time communication
- Knex.js for query building
- MQTT for IoT connectivity
- All contributors and supporters

---

## 📞 Contact

- **Email:** your-email@example.com
- **GitHub:** [@yourusername](https://github.com/yourusername)
- **Documentation:** [See Code Quality Report](CODE_QUALITY_REPORT.md)

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] GraphQL API support
- [ ] WebRTC integration
- [ ] Advanced caching layer
- [ ] Admin dashboard
- [ ] Mobile app authentication
- [ ] Payment gateway integration
- [ ] Advanced analytics
- [ ] Machine learning integration

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2025 | Initial release |
| 1.1.0 | TBD | Added advanced features |
| 2.0.0 | TBD | Major refactor |

---

**Last Updated:** December 16, 2025  
**Maintained by:** Development Team  
**Status:** ✅ Active & Maintained