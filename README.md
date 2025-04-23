# Service Booking Platform - Backend API

![Node.js](https://img.shields.io/badge/Node.js-14.x%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.x%2B-green)
![JWT](https://img.shields.io/badge/JWT-Auth-orange)

A robust backend system for managing service bookings with user authentication, service listings, and booking management.

## Features

- ✅ **JWT Authentication** (Register/Login with token)
- 📝 **Service Management** (CRUD operations)
- 🗓️ **Booking System** with status tracking
- 🔐 **Role-based Authorization** (User/Provider/Admin)
- 🛡️ **Data Validation** (Mongoose + custom utils)
- 📊 **Pagination & Filtering** for services/bookings

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Mongoose schema validation + custom utilities
- **Error Handling**: Custom error middleware

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dan1sh15/Kuteeram-Assignment.git
cd Kuteeram-Assignment
```
2. Install dependencies:
```bash
npm install
```
3. Configure environment:
```bash
cp .env.example .env
```
4. Start the development server:
```bash
npm run dev
```

## Environment Variables

| Variable       | Description                     | Default Value                          |
|----------------|---------------------------------|----------------------------------------|
| `NODE_ENV`     | Application environment         | `development`                          |
| `PORT`         | Server port                     | `5000`                                 |
| `MONGO_URI`    | MongoDB connection string       | Get url from mongodb Atlas             |
| `JWT_SECRET`   | Secret for JWT signing          | **Required use your own secret ket**   |

## API Endpoints

### Authentication

| Method | Endpoint                  | Description                | Access    |
|--------|---------------------------|----------------------------|-----------|
| POST   | `/api/v1/auth/register`   | Register new user          | Public    |
| POST   | `/api/v1/auth/login`      | Login user                 | Public    |
| GET    | `/api/v1/auth/me`         | Get current user data      | Private   |

### Services

| Method | Endpoint                  | Description                | Access          |
|--------|---------------------------|----------------------------|-----------------|
| GET    | `/api/v1/services`        | Get all services           | Public          |
| POST   | `/api/v1/services`        | Create new service         | Provider/Admin  |
| GET    | `/api/v1/services/:id`    | Get single service         | Public          |
| PUT    | `/api/v1/services/:id`    | Update service             | Provider/Admin  |
| DELETE | `/api/v1/services/:id`    | Delete service             | Provider/Admin  |

### Bookings

| Method | Endpoint                          | Description                | Access          |
|--------|-----------------------------------|----------------------------|-----------------|
| GET    | `/api/v1/bookings`                | Get user bookings          | Private         |
| POST   | `/api/v1/services/:id/bookings`   | Create new booking         | Private         |
| PUT    | `/api/v1/bookings/:id/status`     | Update booking status      | Provider/Admin  |
| PUT    | `/api/v1/bookings/:id/cancel`     | Cancel booking             | User            |

### Folder Structure
```
service-booking-backend/
├── config/          # Configuration files
│   ├── db.js       # Database connection
│   └── jwt.js      # JWT utilities
├── controllers/     # Business logic
│   ├── authController.js
│   ├── bookingController.js
│   └── serviceController.js
├── middlewares/     # Custom middleware
│   ├── auth.js      # Authentication
│   └── error.js     # Error handling
├── models/          # Database models
│   ├── Booking.js
│   ├── Service.js
│   └── User.js
├── routes/          # Route definitions
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   └── serviceRoutes.js
├── utils/           # Utility functions
│   └── validationUtils.js # Validation helpers
├── .env             # Environment config
├── app.js           # Express app config
└── server.js        # Server entry point
```

### Psotman Collection


### Hosted render link
