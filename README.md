# LDSS School Management System - Production Ready

## 🎯 Overview
A fully functional, production-ready school management system for Lukulu Day Secondary School with real authentication, user management, attendance tracking, and grade management.

## ✨ Features

### 🔐 Authentication System
- **Multi-role authentication** (Admin, Staff, Learner)
- **JWT-based session management**
- **Secure password hashing with bcrypt**
- **Token validation and refresh**
- **Role-based access control**

### 📊 Admin Dashboard
- **Real user management** - View, filter, delete users
- **System statistics** - Live user counts and metrics
- **Database operations** - Actual CRUD operations
- **System health monitoring**
- **Error handling and logging**

### 👨‍🏫 Staff Dashboard
- **Class management** - View assigned classes and students
- **Attendance tracking** - Mark present/absent/late with date selection
- **Grade submission** - Submit grades for different subjects and exam types
- **Student profiles** - View student information
- **Real-time data updates**

### 🎓 Learner Dashboard
- **Grade viewing** - View submitted grades and performance
- **Attendance tracking** - View personal attendance records
- **Profile management** - Update personal information
- **Schedule viewing** - View class schedules

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd LDSS_website
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up database**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npm run seed
```

5. **Start development servers**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5174
- Backend API: http://localhost:4000
- Login: http://localhost:5174/login

### Production Deployment with Docker

1. **Set up environment**
```bash
cp .env.example .env
# Update with production values
```

2. **Deploy with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost
- Backend API: http://localhost:4000

## 🔑 Default Credentials

| Role | Username | Password |
|------|----------|---------|
| Admin | 202501 | LDSSadmin123 |
| Staff | 2025001 | LDSSstaff123 |
| Learner | 202500123456 | LDSS2025 |

## 🏗️ Architecture

### Backend (Node.js + TypeScript + Prisma)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **Error Handling**: Custom error middleware
- **Logging**: Winston logger

### Frontend (React + TypeScript + Tailwind)
- **Framework**: React 18 with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **HTTP Client**: Fetch API with interceptors

### Database Schema
- **Users** - Authentication and basic user data
- **Profiles** - Extended user information
- **Staff** - Staff-specific data (TS numbers, positions)
- **Students** - Student-specific data (Learner IDs, grades)
- **Classes** - Class information and enrollment
- **Attendance** - Attendance tracking
- **Grades** - Grade management
- **Announcements** - System announcements

## 🔒 Security Features

- **Password Security**: Bcrypt with 12 rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Proper CORS setup
- **Rate Limiting**: Request rate limiting
- **Environment Variables**: Secure configuration

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Admin Operations
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/role/:role` - Users by role
- `DELETE /api/admin/users/:id` - Delete user

### Staff Operations
- `GET /api/staff/classes/my-classes` - Get assigned classes
- `POST /api/staff/attendance/mark` - Mark attendance
- `GET /api/staff/attendance/:classId/:date` - Get attendance
- `POST /api/staff/grades/submit` - Submit grades

## 🧪 Testing

### Unit Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Integration Tests
```bash
# API integration tests
cd backend
npm run test:integration
```

### E2E Tests
```bash
# End-to-end tests
npm run test:e2e
```

## 📝 Monitoring & Logging

### Application Logs
- **Error Logs**: Detailed error tracking
- **Access Logs**: Request/response logging
- **Security Logs**: Authentication attempts
- **Performance Logs**: Response times

### Health Checks
- **Database Connection**: PostgreSQL health
- **Redis Connection**: Cache health
- **API Endpoints**: Service health
- **Frontend**: Application health

## 🔧 Development Tools

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View database
npx prisma studio

# Seed database
npm run seed
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatting
npm run format
```

## 🚀 Deployment

### Environment Setup
1. **Production Database**: PostgreSQL
2. **Cache Layer**: Redis
3. **Load Balancer**: Nginx
4. **SSL Certificate**: Let's Encrypt
5. **Monitoring**: Application logs

### Deployment Steps
1. **Environment Configuration**
2. **Database Migration**
3. **Build Applications**
4. **Deploy Services**
5. **Health Verification**
6. **SSL Configuration**

## 📞 Support

### Troubleshooting
- **Login Issues**: Check JWT_SECRET and database connection
- **Database Errors**: Verify PostgreSQL connection and migrations
- **Performance**: Check Redis cache and database indexes
- **Security**: Review environment variables and access logs

### Common Issues
1. **Token Validation**: Ensure JWT_SECRET is set
2. **Database Connection**: Check DATABASE_URL format
3. **CORS Errors**: Verify frontend and backend URLs
4. **Permission Errors**: Check user roles and permissions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📊 Project Status

- ✅ **Authentication System** - Complete
- ✅ **Admin Dashboard** - Complete with real operations
- ✅ **Staff Dashboard** - Complete with attendance/grading
- ✅ **Learner Dashboard** - Complete
- ✅ **Database Integration** - Complete
- ✅ **Error Handling** - Complete
- ✅ **Security Measures** - Complete
- ✅ **Docker Configuration** - Complete
- ✅ **Production Ready** - Complete

---

**LDSS School Management System** - A production-ready solution for modern school administration. 🎓✨
