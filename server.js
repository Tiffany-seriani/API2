const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 1. Configure environment variables from config/.env
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/user_database';

// 2. Middlewares
app.use(express.json()); // Built-in middleware to parse JSON request bodies

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 3. Import User Model
const User = require('./models/User');

// 4. Connect to MongoDB (Local or Atlas)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' Successfully connected to MongoDB Database');
  })
  .catch((err) => {
    console.error(' MongoDB Connection Error:', err.message);
  });

// Root Route - Welcome & API Documentation
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Mongoose & Express User REST API',
    database_status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    endpoints: {
      getAllUsers: 'GET /users or GET /api/users',
      getUserById: 'GET /users/:id or GET /api/users/:id',
      createUser: 'POST /users or POST /api/users',
      updateUserById: 'PUT /users/:id or PUT /api/users/:id',
      deleteUserById: 'DELETE /users/:id or DELETE /api/users/:id'
    }
  });
});

// ==========================================
// 5. CRUD ROUTES FOR USER MODEL
// ==========================================

/**
 * @route   GET /users
 * @desc    RETURN ALL USERS from the database
 * @access  Public
 */
const getAllUsersHandler = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

app.get('/users', getAllUsersHandler);
app.get('/api/users', getAllUsersHandler);

/**
 * @route   GET /users/:id
 * @desc    RETURN A SINGLE USER BY ID
 * @access  Public
 */
const getUserByIdHandler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id ${req.params.id} not found`
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(error.name === 'CastError' ? 400 : 500).json({
      success: false,
      message: error.name === 'CastError' ? 'Invalid User ID format' : 'Error retrieving user',
      error: error.message
    });
  }
};

app.get('/users/:id', getUserByIdHandler);
app.get('/api/users/:id', getUserByIdHandler);

/**
 * @route   POST /users
 * @desc    ADD A NEW USER TO THE DATABASE
 * @access  Public
 */
const createUserHandler = async (req, res) => {
  try {
    const { name, email, age, role } = req.body;

    // Create a new user instance using Mongoose
    const newUser = new User({
      name,
      email,
      age,
      role
    });

    // Save the new user document to the database
    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: savedUser
    });
  } catch (error) {
    // Handle duplicate email error (MongoDB code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A user with that email already exists',
        error: error.message
      });
    }

    // Handle Mongoose schema validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

app.post('/users', createUserHandler);
app.post('/api/users', createUserHandler);

/**
 * @route   PUT /users/:id
 * @desc    EDIT A USER BY ID
 * @access  Public
 */
const updateUserHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findByIdAndUpdate to update document and return the updated version
    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return updated document rather than original
        runValidators: true // Enforce schema validations on update
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: `User with id ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID format'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use by another user'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

app.put('/users/:id', updateUserHandler);
app.put('/api/users/:id', updateUserHandler);

/**
 * @route   DELETE /users/:id
 * @desc    REMOVE A USER BY ID
 * @access  Public
 */
const deleteUserHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findByIdAndDelete to remove user document from database
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: `User with id ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'User removed successfully',
      data: deletedUser
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

app.delete('/users/:id', deleteUserHandler);
app.delete('/api/users/:id', deleteUserHandler);

// 404 Route Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`
  });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT} (http://localhost:${PORT})`);
});

module.exports = { app, server };
