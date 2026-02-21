const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Protect routes
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.sendError('Not authorized to access this route', 401);
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.sendError('User not found', 404);
        }

        if (req.user.status === 'Blocked') {
            return res.sendError('Account is blocked', 403);
        }

        next();
    } catch (error) {
        return res.sendError('Not authorized to access this route', 401);
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.sendError(
                `User role ${req.user.role} is not authorized to access this route`,
                403
            );
        }
        next();
    };
};

module.exports = { protect, authorize };
