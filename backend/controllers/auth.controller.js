const User = require('../models/user.model');
const { generateToken } = require('../services/auth.service');
const userDTO = require('../dto/user.dto');

const register = async (req, res, next) => {
    try {
        console.log('Registration request body:', req.body);
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        console.log('User exists check:', !!userExists);
        if (userExists) {
            return res.sendError('User already exists', 400);
        }

        console.log('Creating user...');
        const user = await User.create({
            name,
            email,
            password,
            role,
        });
        console.log('User created:', user._id);

        console.log('Generating token...');
        const token = generateToken(user._id, user.role);
        console.log('Token generated');

        res.sendSuccess({
            token,
            user: userDTO(user),
        }, 'User registered successfully', 201);
    } catch (error) {
        console.error('Registration error detail:', error);
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendError('Please provide email and password', 400);
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.sendError('Invalid credentials', 401);
        }

        if (user.status === 'Blocked') {
            return res.sendError('Account is blocked', 403);
        }

        const token = generateToken(user._id, user.role);

        res.sendSuccess({
            token,
            user: userDTO(user),
        }, 'Login successful');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
};
