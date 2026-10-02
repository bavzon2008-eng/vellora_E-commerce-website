# Vellora — Multi-brand Makeup & Cosmetics Store

A full-stack, responsive e-commerce web application for browsing and purchasing makeup and cosmetics products.

Built with **React + Vite** on the frontend, **Node.js + Express** on the backend, and **MongoDB + Mongoose** for data storage. The application includes JWT authentication, customer and admin roles, product management, cart and checkout functionality, order tracking, search, filtering, sorting, pagination, and production deployment using **Vercel + Render + MongoDB Atlas**.

> **Demo Project:** Vellora is a fictional cosmetics store created for demonstration and educational purposes. Real brand and product names such as Maybelline, MAC, and Fenty Beauty are used only as sample catalog data. Vellora is not affiliated with, sponsored by, endorsed by, or an authorized retailer of those brands. No real payments, purchases, or deliveries are processed.

---

## 🚀 Live Demo

### Try Vellora

🌐 **Live Website:**  
https://vellora-e-commerce-website-akymooi7b-bavana1.vercel.app

### Demo Customer Account

```text
Email:    user@beautystore.com
Password: User@123
Demo Admin Account
Email:    admin@beautystore.com
Password: Admin@123

These are demonstration credentials only. Do not use real passwords or sensitive personal information.

✨ Features

🛍️ Customer Features
Browse the cosmetics catalog
Search products by name, brand, and category
Filter by category, brand, price, and rating
Sort by newest, price, rating, and name
Product pagination
Product detail pages
Product shade selection
Product image galleries
Product benefits and descriptions
Add products to cart
Change product quantities
Remove products from cart
Clear cart
Cart persistence in the browser
User registration and login
JWT-based authentication
Protected customer routes
Checkout
Cash on Delivery
Demo card payment
Order confirmation
Order history
Order details
Order tracking timeline
Customer profile
Responsive desktop, tablet, and mobile design

👑 Admin Features
Admin dashboard
Dashboard statistics
Product CRUD
Create products
View products
Edit products
Delete products
Stock management
Customer management
View all orders
Update order status
Order tracking synchronization
Protected admin routes
Role-based authorization

🔐 Security Features
JWT authentication
Password hashing with bcryptjs
Protected API routes
Admin-only API routes
Server-side price validation
Server-side stock validation
JWT → user → role verification
Environment variables for secrets
CORS configuration
Authentication token handling
Invalid/expired token handling

🛠️ Tech Stack
Frontend
React 18
Vite 5
React Router 6
Axios
React Context API
JavaScript
CSS
Backend
Node.js
Express 4
REST API
Mongoose 8
JSON Web Token (jsonwebtoken)
bcryptjs
CORS
dotenv
Database
MongoDB
MongoDB Atlas for production
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
Source Control: GitHub

🏗️ Architecture
                         ┌─────────────────────┐
                         │       GitHub        │
                         │   Source Repository │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                 ┌───────────────┐    ┌────────────────┐
                 │    Vercel     │    │     Render     │
                 │ React + Vite  │    │ Node + Express │
                 │   Frontend    │───▶│    Backend     │
                 └───────────────┘    └───────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │ MongoDB Atlas   │
                                      │                 │
                                      │ • Users         │
                                      │ • Products      │
                                      │ • Orders        │
                                      └─────────────────┘
Production URLs

Frontend

https://vellora-e-commerce-website-akymooi7b-bavana1.vercel.app

Backend

https://vellora-backend.onrender.com

Backend Health Check

https://vellora-backend.onrender.com/api/health

📁 Project Structure
vellora/
│
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── products/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar
│   │   │   ├── Footer
│   │   │   ├── ProductCard
│   │   │   ├── ProductGrid
│   │   │   ├── SearchBar
│   │   │   ├── FilterSidebar
│   │   │   ├── ProductImage
│   │   │   ├── CartItem
│   │   │   ├── OrderCard
│   │   │   ├── OrderTimeline
│   │   │   ├── ProtectedRoute
│   │   │   ├── AdminRoute
│   │   │   ├── AdminLayout
│   │   │   ├── LoadingSpinner
│   │   │   ├── Toast
│   │   │   ├── Modal
│   │   │   ├── Pagination
│   │   │   └── Stars
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext
│   │   │   ├── CartContext
│   │   │   └── ToastContext
│   │   │
│   │   ├── hooks/
│   │   │   └── useDebounce
│   │   │
│   │   ├── pages/
│   │   │   ├── Home
│   │   │   ├── Shop
│   │   │   ├── ProductDetails
│   │   │   ├── Cart
│   │   │   ├── Checkout
│   │   │   ├── Login
│   │   │   ├── Register
│   │   │   ├── Profile
│   │   │   ├── Orders
│   │   │   ├── OrderDetails
│   │   │   ├── TrackOrder
│   │   │   ├── About
│   │   │   ├── NotFound
│   │   │   └── admin/
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── utils/
│   │   │   └── format.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   ├── package.json
│   └── .env.example
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth
│   │   ├── product
│   │   ├── order
│   │   └── user
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   │
│   ├── models/
│   │   ├── User
│   │   ├── Product
│   │   └── Order
│   │
│   ├── routes/
│   │   ├── authRoutes
│   │   ├── productRoutes
│   │   ├── orderRoutes
│   │   └── userRoutes
│   │
│   ├── utils/
│   │   ├── categories
│   │   ├── httpError
│   │   └── token
│   │
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore

⚙️ Prerequisites

For local development, install:

Node.js 18 or newer
npm
MongoDB Community Server or MongoDB Atlas
Git
VS Code

Check your Node.js installation:

node -v
npm -v

💻 Local Development Setup
1. Clone the Repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd vellora
2. Install Backend Dependencies
cd server
npm install
3. Create Backend Environment Variables

Create:

server/.env

Example:

PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vellora-store
JWT_SECRET=put_a_long_random_string_here_at_least_32_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

For MongoDB Atlas, replace MONGODB_URI with your Atlas connection string.

Never commit .env to GitHub.

4. Seed the Database

From the server directory:

npm run seed

The seed script creates the demo product catalog and demo users.

Warning: The seed script clears existing products, users, and orders before inserting the demo data.

5. Start the Backend
npm run dev

The backend runs at:

http://localhost:5000

Health check:

http://localhost:5000/api/health

Expected response:

{
  "status": "ok"
}
6. Start the Frontend

Open a second terminal:

cd client
npm install
npm run dev

Vite will normally provide:

http://localhost:5173

🔗 Frontend API Configuration

The frontend uses the following environment variable:

VITE_API_URL=http://localhost:5000/api

For the deployed application:

VITE_API_URL=https://vellora-backend.onrender.com/api

🔑 Demo Accounts
Role	Email	Password
Customer	user@beautystore.com	User@123
Admin	admin@beautystore.com	Admin@123

These credentials are for demonstration purposes only.

🖼️ Product Images

The product catalog uses a combination of product imagery and built-in category-based illustrations.

Category-specific visuals are available for products such as:

Foundation
Concealer
Primer
Setting Powder
Setting Spray
Blush
Highlighter
Contour
Eyeshadow
Eyeliner
Mascara
Eyebrow Pencil
Kajal
Lipstick
Lip Gloss
Lip Liner
Lip Tint
Liquid Lipstick
Makeup Brushes
Beauty Sponges
Eyelash Curlers
Cleanser
Moisturizer
Face Serum
Makeup Remover

The application also includes a dedicated Maybelline Fit Me product image.

A built-in fallback image system prevents broken product images from breaking the product cards.

💰 Pricing Rules

All prices are displayed in Indian Rupees (₹).

Rule	Value
Shipping	₹59
Free shipping	Orders ≥ ₹999

Product prices and stock are revalidated by the backend when an order is placed.

💳 Payment Methods

Vellora does not process real payments.

Available demonstration methods:

Cash on Delivery
Demo Card

No real card information is processed or stored.

📦 Order Management
Customers

Customers can:

Place orders
View order history
View order details
Track orders
See order status updates
Admins

Admins can:

View all orders
Update order status
Manage products
Manage stock
View customers

Customer tracking pages reflect administrator order-status updates.

🔌 API Reference
Production API
https://vellora-backend.onrender.com/api
Local API
http://localhost:5000/api

Authentication uses:

Authorization: Bearer <token>
Authentication
Method	Endpoint	Access	Description
POST	/auth/register	Public	Register a user
POST	/auth/login	Public	Login
GET	/auth/me	User	Get current user
PUT	/auth/me	User	Update profile
Products
Method	Endpoint	Access	Description
GET	/products	Public	Browse products
GET	/products/meta/filters	Public	Get filter metadata
GET	/products/:id	Public	Get product details
POST	/products	Admin	Create product
PUT	/products/:id	Admin	Update product
DELETE	/products/:id	Admin	Delete product
Orders
Method	Endpoint	Access	Description
POST	/orders	User	Create order
GET	/orders/my-orders	User	Get user's orders
GET	/orders/:id	Owner/Admin	Get order details
GET	/orders	Admin	Get all orders
PUT	/orders/:id/status	Admin	Update order status
GET	/orders/stats/summary	Admin	Dashboard statistics
Users
Method	Endpoint	Access	Description
GET	/users	Admin	List customers
GET	/users/:id	Admin	Get customer details

🔍 Search, Filtering & Sorting
Search

Products can be searched by:

Name
Brand
Category
Filters
Category
Brand
Minimum price
Maximum price
Rating
Sorting
newest
price-asc
price-desc
rating
name-asc

🧪 Testing Checklist
Authentication
 Register a new user
 Login
 Logout
 Invalid password handling
 Existing email validation
 Protected profile route
 Session expiration handling
 
Customer
 Home page
 Product catalog
 Product search
 Category filtering
 Brand filtering
 Price filtering
 Rating filtering
 Sorting
 Pagination
 Product details
 Shade selection
 Add to cart
 Change quantity
 Remove item
 Clear cart
 Cart persistence
 Checkout validation
 COD order
 Demo card order
 Order confirmation
 My Orders
 Order details
 Track Order
 Stock validation
 
Admin
 Admin login
 Dashboard statistics
 Add product
 Edit product
 Delete product
 Stock management
 Customer list
 Orders management
 Order status updates
 Customer tracking updates
 
Security
 Customer cannot access admin pages
 Customer token cannot access admin APIs
 Unauthenticated requests return 401
 Invalid tokens return 401
 Admin-only endpoints reject regular users
 
☁️ Production Deployment

Vellora is deployed using GitHub + Vercel + Render + MongoDB Atlas.

GitHub
   │
   ├── Vercel
   │     └── React + Vite Frontend
   │
   └── Render
         └── Node + Express Backend
                │
                └── MongoDB Atlas
Frontend — Vercel

Frontend directory:

client/

Build command:

npm run build

Production API:

https://vellora-backend.onrender.com/api

The React Router SPA configuration is handled through:

client/vercel.json
Backend — Render

Backend directory:

server/

Build command:

npm install

Start command:

npm start

Production environment variables include:

MONGODB_URI=<MongoDB Atlas connection string>
JWT_SECRET=<secure secret>
PORT=10000
CLIENT_URL=<Vercel frontend URL>
Database — MongoDB Atlas

MongoDB Atlas stores:

Users
Products
Orders

🩺 Backend Health Check

Production health endpoint:

https://vellora-backend.onrender.com/api/health

Expected response:

{
  "status": "ok"
}

🔒 Environment Variables

Never commit secrets to GitHub.

Backend
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
CLIENT_URL=
Frontend
VITE_API_URL=

VITE_API_URL is intentionally available to the browser because the frontend needs the public API address.

Never place passwords, database credentials, JWT secrets, API private keys, or other sensitive values in VITE_* variables.

🐛 Troubleshooting
Problem	Solution
npm is not recognized	Install Node.js LTS and restart VS Code
MongoDB connection failed	Check MongoDB service or Atlas connection details
Port 5000 already in use	Find and stop the process using port 5000
Port 5173 already in use	Vite automatically selects another available port
CORS error	Make sure CLIENT_URL exactly matches the frontend origin
Frontend cannot reach backend	Check VITE_API_URL and make sure it ends with /api
JWT / Invalid session	Verify JWT_SECRET and log in again
Seed error	Check MongoDB connection and .env
Blank Vite page	Check the browser console and restart Vite
Product image fails	Check the image URL; built-in fallback handling is available
Vercel route returns 404	Verify client/vercel.json exists and contains the SPA rewrite
Render deployment fails	Check Render environment variables and deployment logs

📌 Production Notes

Vellora is a learning/demo e-commerce application.

For real commercial use, additional production features would be required, including:

Real payment gateway integration
Payment verification and webhooks
Rate limiting
Helmet/security headers
Advanced session/token management
Email notifications
Email verification
Password reset
Automated testing
Monitoring and logging
Image hosting/CDN
Inventory reservation
Production-grade validation
Database backups
Disaster recovery
Privacy and legal compliance

🌐 Try Vellora

Live Demo:
https://vellora-e-commerce-website-akymooi7b-bavana1.vercel.app

Backend:
https://vellora-backend.onrender.com

Backend Health:
https://vellora-backend.onrender.com/api/health

👩‍💻 Project Summary

Vellora is a full-stack cosmetics e-commerce application demonstrating:

Modern React frontend development
REST API architecture
JWT authentication
Role-based authorization
MongoDB database integration
Product catalog management
Shopping cart workflows
Checkout and order management
Admin dashboard functionality
Responsive UI design
Cloud deployment
Production frontend/backend integration

Built as a full-stack web development project using React, Node.js, Express, MongoDB, Vercel, Render, and MongoDB Atlas.
