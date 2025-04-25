const express = require('express');
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const User = require('../models/User');

const router = express.Router();

// Validation rules for registration
router.post('/register',
    [
      body('username').notEmpty().withMessage('Username is required'),
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    validateRequest,
    register
  );

// Validation rules for email verification
router.get('/verify', async (req, res) => {
  const token = req.query.token;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).send('Invalid or expired token');
  }

  user.verified = true;
  user.verificationToken = undefined;
  await user.save();

  res.send('Email verified! You can now log in.');
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.verified) return res.status(400).json({ message: 'User already verified' });

  const crypto = require('crypto');
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  await user.save();

  const transporter = require('nodemailer').createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const link = `http://localhost:5000/api/auth/verify?token=${verificationToken}`;

  await transporter.sendMail({
    from: `"Online Bookshop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🛒 Verify Your Email | Online Bookshop',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h1 style="color: #333; text-align: center;">📘 Welcome, ${user.username}!</h1>
          <p style="font-size: 16px; color: #555;">Thanks for signing up for <strong>Online Bookshop</strong>! We're excited to have you on board.</p>
          
          <p style="font-size: 16px; color: #555;">To activate your account and start exploring thousands of books, please verify your email by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background: #007BFF; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px;">✅ Verify My Email</a>
          </div>
          
          <center><p style="font-size: 14px; color: #777;"><strong>Note:</strong> This link will expire in 1 hour.</p></center>
  
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
  
          <p style="font-size: 14px; color: #999;">Didn't request this? No worries, you can safely ignore this email.</p>
          
          <p style="font-size: 14px; color: #999;">Questions? Reach out to us at <a href="mailto:randikaheshan222@gmail.com" style="color: #007BFF;">randikaheshan222@gmail.com</a></p>
          
          <p style="font-size: 12px; color: #ccc; text-align: center; margin-top: 40px;">This is an automated message. Please do not reply.</p>
          <p style="font-size: 12px; color: #ccc; text-align: center;">© ${new Date().getFullYear()} Online Bookshop. All rights reserved.</p>
        </div>
      </div>
    `,
  });    

  res.json({ message: 'Verification email sent again.' });
});

// Validation rules for login
router.post('/login',
    [
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    validateRequest,
    login
  );

module.exports = router;