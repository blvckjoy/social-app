# Social Media Application

A modern social media platform built with Node.js, Express, and MongoDB. This application allows users to create posts, interact with content, and connect with other users.

## Features

### User Management

-  User registration and authentication
-  JWT-based secure authentication
-  User profile management
-  Follow/Unfollow functionality

### Post Management

-  Create, read, update, and delete posts
-  Support for text and media content
-  Post sharing functionality
-  Post privacy settings

### Social Interactions

-  Like posts
-  Comment on posts
-  Share posts
-  View user activity

## Tech Stack

### Backend

-  **Node.js**: JavaScript runtime environment
-  **Express.js**: Web application framework
-  **MongoDB**: NoSQL database
-  **Mongoose**: MongoDB object modeling
-  **JWT**: JSON Web Tokens for authentication
-  **Bcrypt**: Password hashing

## Installation

### Prerequisites

-  Node.js (v14 or higher)
-  MongoDB
-  npm or yarn

### Backend Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/social-app.git
cd social-app
```

2. Install dependencies

```bash
cd server
npm install
```

3. Create a `.env` file in the server directory

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/social-app
JWT_SECRET=your_jwt_secret
```

## Environment Variables

### Backend (.env)

-  `PORT`: Server port (default: 8080)
-  `MONGODB_URI`: MongoDB connection string
-  `JWT_SECRET`: Secret key for JWT token generation

## Authentication Flow

1. User registers with email and password
2. Server hashes password and creates user
3. User logs in with credentials
4. Server validates credentials and issues JWT token
5. Client stores token and includes it in subsequent requests
6. Server validates token for protected routes

## Security Features

-  Password hashing with bcrypt
-  JWT-based authentication
-  Protected routes with middleware
-  Input validation
-  Rate limiting

## Error Handling

The API uses standard HTTP status codes:

-  200: Success
-  201: Created
-  400: Bad Request
-  401: Unauthorized
-  403: Forbidden
-  404: Not Found
-  500: Internal Server Error
