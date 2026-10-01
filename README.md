# Vellora: Multi-brand Makeup & Cosmetics Store (Demo)

A full-stack e-commerce app: React + Vite on the front, Node + Express + MongoDB (Mongoose) on the back, with JWT auth, role-based admin tools, cart, checkout, orders and order tracking.

> **Demo only.** Vellora is a fictional store. Real brand and product names (Maybelline, MAC, Fenty Beauty and so on) appear purely as sample catalog data. The store is not affiliated with, sponsored by, or endorsed by any of them, and is not an authorised retailer. No real payments, orders or deliveries happen.

## Features

**Customers:** browse, search (name, brand, category), filter (category, brand, price, rating), sort, paginate, view product details with shade swatches, cart (add, change quantity, remove, clear; persists in the browser per user), register/login, checkout (Cash on Delivery or **Demo** card with no card data collected), order history, order tracking timeline, profile.

**Admins:** dashboard statistics, product CRUD with stock, all orders with status updates (customers see the change on their tracking page), customer list.

**Security:** passwords hashed (bcrypt algorithm via `bcryptjs`, which installs on Windows without build tools), JWT, backend admin checks (JWT → user → admin role) on every admin route, server-side price and stock validation, secrets only in `.env`.

## Tech stack

React 18, Vite 5, React Router 6, Axios, Context API, plain CSS · Node.js, Express 4, Mongoose 8, jsonwebtoken, bcryptjs, cors, dotenv · MongoDB (local or Atlas).

## Folder structure

```text
vellora/
├── client/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── components/   Navbar, Footer, ProductCard, ProductGrid, SearchBar, FilterSidebar,
│   │   │                 ProductImage, CartItem, OrderCard, OrderTimeline, ProtectedRoute,
│   │   │                 AdminRoute, AdminLayout, LoadingSpinner, Toast, Modal, Pagination, Stars
│   │   ├── context/      AuthContext, CartContext, ToastContext
│   │   ├── hooks/        useDebounce
│   │   ├── pages/        Home, Shop, ProductDetails, Cart, Checkout, Login, Register, Profile,
│   │   │                 Orders, OrderDetails, TrackOrder, About, NotFound, admin/*
│   │   ├── services/api.js
│   │   ├── utils/format.js
│   │   ├── App.jsx  main.jsx  index.css
│   ├── index.html  vite.config.js  package.json  .env.example
├── server/
│   ├── config/db.js
│   ├── controllers/      auth, product, order, user
│   ├── middleware/       auth.js (protect, adminOnly), error.js
│   ├── models/           User, Product, Order
│   ├── routes/           authRoutes, productRoutes, orderRoutes, userRoutes
│   ├── utils/            categories, httpError, token
│   ├── server.js  seed.js  package.json  .env.example
├── README.md
└── .gitignore
```

## Prerequisites (Windows)

1. **Node.js 18 or newer (LTS):** download from https://nodejs.org, run the installer with defaults, then **restart VS Code**. Check with `node -v` and `npm -v`.
2. **MongoDB**, one of:

### Option A: Local MongoDB
1. Download **MongoDB Community Server** (MSI) from https://www.mongodb.com/try/download/community.
2. Run the installer, choose *Complete*, and keep **"Install MongoDB as a Service"** ticked.
3. Check it's running: press `Win + R`, type `services.msc`, look for **MongoDB Server** with status *Running* (start it if not). Or run `mongosh` if you installed MongoDB Shell.
4. Your connection string is `mongodb://127.0.0.1:27017/vellora-store`.

### Option B: MongoDB Atlas (cloud, free tier)
1. Sign up at https://www.mongodb.com/cloud/atlas.
2. **Create a cluster** (Free / M0 shared).
3. **Database Access → Add New Database User:** choose a username and password (avoid `@ : /` in the password, or URL-encode it).
4. **Network Access → Add IP Address:** use *Add Current IP Address* (or `0.0.0.0/0` for quick testing only).
5. **Database → Connect → Drivers:** copy the connection string and put your database name before the `?`:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/vellora-store?retryWrites=true&w=majority`
6. Use it as `MONGODB_URI` in `server/.env`.

## Setup in VS Code

1. Install Node.js and MongoDB (above).
2. Open **VS Code** → **File → Open Folder…** → choose the `vellora` folder.
3. Open a terminal: **Terminal → New Terminal**.
4. Backend dependencies:
   ```bash
   cd server
   npm install
   ```
5. Create **`server/.env`** (copy `.env.example` and edit, or create a new file named `.env` inside `server/`) with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/vellora-store
   JWT_SECRET=put_a_long_random_string_here_at_least_32_characters
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```
   (For Atlas, replace `MONGODB_URI` with your Atlas string.) Never commit `.env`.
6. Seed the database (47 products, 2 demo users). **This wipes products, users and orders first:**
   ```bash
   npm run seed
   ```
7. Start the API:
   ```bash
   npm run dev
   ```
   You should see `MongoDB connected` and `API running at http://localhost:5000`. Check http://localhost:5000/api/health.
8. Open a **second terminal** (click the `+` in the terminal panel) and run:
   ```bash
   cd client
   npm install
   npm run dev
   ```
9. Open the URL Vite prints, usually **http://localhost:5173**.

Optional: to point the frontend at a different API, copy `client/.env.example` to `client/.env` and edit `VITE_API_URL`.

## Demo accounts (demo credentials only)

| Role | Email | Password |
|---|---|---|
| Admin | admin@beautystore.com | Admin@123 |
| Customer | user@beautystore.com | User@123 |

## Product images

Seed products use `placehold.co` placeholder images, because stable official product-image URLs can't be guaranteed to keep working. In **Admin → Products → Edit** you can paste any image URL you have the right to use. If any image fails to load, the app swaps in a built-in fallback image, so cards never break.

## Pricing rules

Prices are in INR (₹). Shipping is ₹59, free when the subtotal is ₹999 or more. Prices and stock are always re-checked on the server when an order is placed.

## API reference

Base URL `http://localhost:5000/api`. Send `Authorization: Bearer <token>` where marked.

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | /auth/register | public | `name, email, password, confirmPassword` |
| POST | /auth/login | public | returns `{ token, user }` |
| GET | /auth/me | user | current user |
| PUT | /auth/me | user | update `name`, `phone` |
| GET | /products | public | `search, category, brand, minPrice, maxPrice, rating, sort, page, limit` |
| GET | /products/meta/filters | public | brands, category groups, price bounds |
| GET | /products/:id | public | |
| POST | /products | admin | create |
| PUT | /products/:id | admin | update |
| DELETE | /products/:id | admin | delete |
| POST | /orders | user | `customerInfo, shippingAddress, items[{product, quantity, shade}], paymentMethod (COD or DEMO_CARD)` |
| GET | /orders/my-orders | user | own orders |
| GET | /orders/:id | owner or admin | |
| GET | /orders | admin | optional `?status=` |
| PUT | /orders/:id/status | admin | `{ status }` (cancelling restores stock) |
| GET | /orders/stats/summary | admin | dashboard numbers |
| GET | /users, /users/:id | admin | |

`sort` values: `newest`, `price-asc`, `price-desc`, `rating`, `name-asc`. `category` accepts a group (`Lips`) or a sub-category (`Lipstick`). Errors return `{ "message": "..." }` with 400, 401, 403, 404 or 500.

## Testing checklist

**Authentication:** register a new user · log in · log out · wrong password shows an error · registering an existing email is rejected · opening `/profile` logged out redirects to login.

**Customer:** Home loads featured products · Shop search (try `lipstick`, `maybelline`) · each filter (category, brand, price, rating) · each sort · pagination (12 per page) · product page shows shades, gallery, benefits · add to cart with a shade · change quantity with +/− and by typing · remove · clear cart (confirm dialog) · refresh the page and the cart persists · checkout validation messages · place a COD order · confirmation appears · order shows in My Orders · Track Order shows the timeline · try ordering more than the stock (edit stock in admin first) and expect an error.

**Admin:** log in as admin · dashboard numbers · add a product · edit it (change stock) · delete it · Customers page lists users · Orders page: change a status, then open that order's Track page as the customer and see it update (the page also refreshes itself every 20 seconds).

**Security:** as the customer, open `/admin` (redirected) · call an admin API with the customer's token (expect 403) · call `/api/orders/my-orders` without a token (expect 401) · send a garbage token (expect 401).

Quick API check from PowerShell:
```powershell
Invoke-RestMethod http://localhost:5000/api/products?limit=2
```

## Troubleshooting (Windows + VS Code)

| Problem | Fix |
|---|---|
| `npm is not recognized` | Install Node.js LTS, then fully close and reopen VS Code. Check `node -v`. |
| MongoDB connection failed | Local: start **MongoDB Server** in `services.msc`, and use `127.0.0.1` rather than `localhost` in `MONGODB_URI`. Atlas: whitelist your IP, check username/password, URL-encode special characters. |
| Port 5000 already in use | `netstat -ano \| findstr :5000`, then `taskkill /PID <pid> /F`. Or change `PORT` in `.env` and `VITE_API_URL` in `client/.env`. |
| Port 5173 already in use | Vite will pick the next port automatically (e.g. 5174). If it does, set `CLIENT_URL=http://localhost:5173,http://localhost:5174` in `server/.env` and restart the API. |
| CORS error | `CLIENT_URL` must exactly match the browser URL (including the port). Restart the API after editing `.env`. |
| Frontend can't connect to backend | Confirm http://localhost:5000/api/health works, the API terminal shows no errors, and `VITE_API_URL` (if set) ends with `/api`. |
| JWT / "Invalid session" | `JWT_SECRET` must exist in `server/.env`. If you change it, log out and in again (old tokens become invalid). |
| Seed script error | Make sure MongoDB is running and `server/.env` exists with `MONGODB_URI`. Run from the `server` folder. |
| Module not found | Run `npm install` in the folder that errors (`server` or `client`). Delete `node_modules` and reinstall if it persists. |
| Vite error / blank page | Open the browser console (F12). Make sure you ran `npm install` in `client`, and run `npm run dev` from `client`. Stop and restart Vite after changing `.env`. |
| `nodemon` not recognised | Run `npm install` in `server` (it's a dev dependency), then `npm run dev`. |
| PowerShell blocks npm scripts | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, or use the Command Prompt terminal in VS Code. |
| Product images not loading | Check your internet connection (placeholders are hosted online). A fallback image shows automatically. Replace image URLs in Admin if needed. |

## Production note

This is a learning/demo project. Before real use you would add rate limiting, helmet, HTTPS, a real payment provider, email, stronger session handling and automated tests.
