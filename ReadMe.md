# Business Cards API

A RESTful backend API for managing business cards, users, and authentication.  
Built with **Node.js**, **Express**, and **MongoDB** with full authentication, role-based access control, and data validation.

---

## 🚀 Features

- **Authentication & Authorization**

  - JSON Web Token (JWT) based authentication
  - Role-based access control (User, Business, Admin)

- **User Management**

  - Register new users
  - Login and retrieve JWT token
  - Admin can view and delete any user

- **Business Card Management**

  - Create, update, and delete business cards (Business users only)
  - Like/unlike cards
  - View cards created by the logged-in business user
  - Admin can delete any card

- **Validation**
  - All requests validated with **Joi**
  - Secure password hashing with **bcrypt**

---

## 🛠️ Tech Stack

- **Node.js** – Server runtime
- **Express.js** – Web framework
- **MongoDB + Mongoose** – Database & ORM
- **Joi** – Request validation
- **JWT** – Authentication
- **bcrypt** – Password hashing

---

## 📂 Folder Structure

backend/
├── controllers/ # Route logic
├── middleware/ # Auth guards & role checks
├── models/ # Mongoose schemas
├── routes/ # Express route definitions
├── validators/ # Joi validation schemas
├── utils/ # Helper utilities
├── server.js # App entry point
└── .env # Environment variables

---

## 🔑 Roles & Permissions

| Role         | Permissions                                             |
| ------------ | ------------------------------------------------------- |
| **User**     | View all cards, like/unlike cards                       |
| **Business** | Create/edit/delete own cards, plus all user permissions |
| **Admin**    | Full access to manage users and cards                   |

---

## ⚙️ Environment Variables

Create a `.env` file in the backend root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<dbname>
JWT_SECRET=your_jwt_secret

# Install dependencies
npm install

# Start in development mode
npm run dev

# Or start in production
npm start

## 🔗 API Endpoints
Auth
Method	Endpoint	Description
POST	/api/users/register	Register new user
POST	/api/users/login	Login and get token

Users
Method	Endpoint	Description
GET	/api/users	Get all users (Admin only)
DELETE	/api/users/:id	Delete a user (Admin only)

Cards
Method	Endpoint	Description
GET	/api/cards	Get all cards
GET	/api/cards/my-cards	Get logged-in business user’s cards
GET	/api/cards/:id	Get card by ID
POST	/api/cards	Create card (Business only)
PUT	/api/cards/:id	Update own card (Business only)
PATCH	/api/cards/:id	Like/unlike a card
DELETE	/api/cards/:id	Delete own card (Business/Admin)
```

📜 License
This project is licensed under the MIT License.
