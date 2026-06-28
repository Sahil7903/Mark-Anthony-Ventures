# Library Management System - Backend API

Welcome to the Library Management System, a robust, secure, and production-ready backend designed to bring order to the boundless world of books. Built with Node.js, Express.js, and MongoDB, this architecture represents a scalable foundation for modern digital libraries.

## Project Overview

In an era where digital transformation defines efficiency, this system provides the essential engine to power library operations. It bridges the gap between readers seeking knowledge and librarians organizing it. By leveraging RESTful design principles and JWT-based authentication, this system ensures that only authorized individuals can access or alter the catalog, while members can easily explore and borrow books.

## Features

- **Robust Authentication:** Secure JWT-based login and registration, protected by bcrypt password hashing.
- **Role-Based Access Control:** Distinct privileges for `member` and `librarian` roles. Members can borrow and return books; librarians manage the catalog and oversee member accounts.
- **Inventory Management:** Precise tracking of total and available book quantities to prevent double-booking.
- **Borrowing Logic:** Enforcement of borrowing rules (e.g., no borrowing the same book twice simultaneously, preventing borrowing if stock is depleted).
- **Pagination & Search:** Efficient querying for books by title, author, or category.
- **Centralized Error Handling:** Consistent, descriptive JSON error responses across all endpoints.

## Folder Structure

The project follows the Model-View-Controller (MVC) architectural pattern, ensuring clean separation of concerns.

```
library-management-system/
├── server/
│   ├── config/        # Database connection configuration
│   ├── controllers/   # Core business logic and request handling
│   ├── middleware/    # Auth, role authorization, and error handling
│   ├── models/        # Mongoose database schemas
│   ├── routes/        # Express route definitions
│   ├── utils/         # Helper functions (e.g., JWT generation)
│   └── validators/    # express-validator logic for incoming requests
├── server.ts          # Main Express server entry point
├── .env.example       # Example environment variables
├── package.json       # Project dependencies and scripts
└── README.md          # This documentation
```

## Installation

1. **Clone the repository:**
   Download the source code to your local machine.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory and populate it with the following required variables. Refer to `.env.example` for guidance.

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/library
JWT_SECRET=your_super_secret_jwt_key
```

## Database Setup

This project uses MongoDB. You can use a local MongoDB instance or MongoDB Atlas.

**Librarian Accounts:**
By design, librarian accounts are not created via the public registration endpoint to maintain security. To create a librarian, insert a record directly into the database:
```json
{
  "name": "Head Librarian",
  "email": "librarian@library.com",
  "password": "$2b$10$hashedpasswordhere",
  "role": "librarian"
}
```

## Authentication Flow

1. A member registers via `POST /api/auth/register`.
2. The user logs in via `POST /api/auth/login`.
3. The server validates credentials and issues a JSON Web Token (JWT).
4. The client includes this JWT in the `Authorization` header (`Bearer <token>`) for subsequent protected requests.
5. The `protect` middleware verifies the token and attaches the user object to the request. The `authorize` middleware ensures the user has the correct role for the route.

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new member.
- `POST /api/auth/login` - Authenticate and receive a JWT.

### Members (Authenticated Members)
- `GET /api/books` - Browse the catalog (supports `?search=`, `?category=`, `?page=`, `?limit=`).
- `GET /api/books/:id` - View details of a specific book.
- `POST /api/books/:id/borrow` - Borrow a book.
- `POST /api/books/:id/return` - Return a borrowed book.
- `GET /api/members/me/books` - View currently borrowed books.

### Librarians (Authenticated Librarians)
- `POST /api/books` - Add a new book to the catalog.
- `PUT /api/books/:id` - Update an existing book's details.
- `DELETE /api/books/:id` - Remove a book from the catalog.
- `GET /api/members` - View all registered members.
- `DELETE /api/members/:id` - Remove a member account.

## Testing Instructions & Postman Collection Usage

Every endpoint is designed to be fully testable via Postman.

1. **Set up Postman:** Create a new environment in Postman with a `token` variable.
2. **Register/Login:** Hit the `/api/auth/login` endpoint. Copy the returned token and save it to your environment variable.
3. **Authorization:** In your Postman requests, go to the Authorization tab, select "Bearer Token", and use `{{token}}`.
4. **Sample Request (Add Book):**
   ```json
   {
     "title": "The Great Gatsby",
     "author": "F. Scott Fitzgerald",
     "isbn": "9780743273565",
     "category": "Classic",
     "quantity": 5
   }
   ```

## Deployment Steps

1. **Build the project:**
   Compile the TypeScript code and bundle the application for production.
   ```bash
   npm run build
   ```
2. **Set production environments:** Ensure `DATABASE_URL` and `JWT_SECRET` are securely configured in your hosting provider's environment settings.
3. **Start the server:**
   ```bash
   npm start
   ```

## Future Improvements

- **Email Notifications:** Implementing automated emails for due date reminders and registration confirmations.
- **Fines System:** Automatically calculating penalties for overdue book returns.
- **Refresh Tokens:** Expanding the authentication system to utilize rotating refresh tokens for enhanced session security.
- **Advanced Analytics:** A dashboard for librarians to visualize popular categories and highly active members.
