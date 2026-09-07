const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lexora')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const clientRoutes = require('./routes/clients');
const caseRoutes = require('./routes/cases');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const userRoutes = require('./routes/users');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const expenseRoutes = require('./routes/expenses');
const noteRoutes = require('./routes/notes');
const notificationRoutes = require('./routes/notifications');

app.use('/api/clients', clientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Lexora Backend is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
