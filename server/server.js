require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Create server/.env from server/.env.example');
  process.exit(1);
}

const app = express();
const allowed = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());

app.use(
  cors({
    origin: (origin, cb) => (!origin || allowed.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'))),
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
