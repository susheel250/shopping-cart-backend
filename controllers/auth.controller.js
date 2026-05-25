const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, roleId } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId
      }
    });

    res.json({
      message: 'User registered successfully',
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
      token
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Login failed'
    });
  }
};