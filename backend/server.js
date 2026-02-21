require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');
const responseHandler = require('./middleware/response.middleware');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(responseHandler);

// Routes
app.get('/health', (req, res) => {
    res.sendSuccess({ status: 'UP' }, 'Server is healthy');
});

app.use('/api/v1/auth', require('./routes/auth.routes.js'));
app.use('/api/v1/vehicles', require('./routes/vehicle.routes.js'));
app.use('/api/v1/drivers', require('./routes/driver.routes.js'));
app.use('/api/v1/trips', require('./routes/trip.routes.js'));
app.use('/api/v1/analytics', require('./routes/analytics.routes.js'));
app.use('/api/v1/expenses', require('./routes/expense.routes.js'));

// Error Handler (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
