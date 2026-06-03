const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    // Check existing user
    const existingUser =
      await prisma.user.findUnique({

        where: { email }

      });

    if (existingUser) {

      return res.status(400).json({
        error: 'Email already exists'
      });

    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Save user
    const user =
      await prisma.user.create({

        data: {

          name,

          email,

          password: hashedPassword,

          roleId: 1

        }

      });

    res.json({

      message:
        'User registered successfully',

      user

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      error: 'Registration failed'

    });

  }

};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid password'
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id
      },
      'secretkey',
      {
        expiresIn: '1d'
      }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Login failed'
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {

  try {

    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true
      }
    });

    res.json(user);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to fetch profile'
    });

  }

};

// Update user profile
exports.updateProfile = async (req, res) => {

  try {

    const userId = req.user.userId;

    const {
      name,
      email
    } = req.body;

    const data = {};

    if (name) data.name = name;
    if (email) data.email = email;

    const user =
      await prisma.user.update({

        where: { id: userId },

        data

      });

    res.json({
      message: 'Profile updated successfully',
      user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to update profile'
    });

  }

};

// Change password
exports.changePassword = async (req, res) => {

  try {

    const userId = req.user.userId;

    const {
      currentPassword,
      newPassword
    } = req.body;

    const user =
      await prisma.user.findUnique({

        where: { id: userId }

      });

    // Compare current password
    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        error: 'Current password is incorrect'
      });

    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({

      where: { id: userId },

      data: {
        password: hashedPassword
      }

    });

    res.json({
      message: 'Password changed successfully',
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Failed to change password'
    });

  }

};
