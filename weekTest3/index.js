const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

// Validation functions
const validateName = (name, fieldName) => {
  if (!/^[A-Z][a-z]*$/.test(name)) {
    const error = new Error(`${fieldName} must start with a capital letter and contain only letters`);
    error.status = 400;
    throw error;
  }
};

const validatePassword = (password) => {
  if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
    const error = new Error('Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long');
    error.status = 400;
    throw error;
  }
};

const validateEmail = (email) => {
  if (!/@/.test(email)) {
    const error = new Error('Invalid email address');
    error.status = 400;
    throw error;
  }
};

const validatePhone = (phone) => {
  if (!/^\d{10,}$/.test(phone)) {
    const error = new Error('Phone number must have at least 10 digits');
    error.status = 400;
    throw error;
  }
};

// Route handler for user registration
app.post('/register', (req, res, next) => {
  try {
    const { firstName, lastName, password, email, phone } = req.body;

    validateName(firstName, 'First name');
    validateName(lastName, 'Last name');
    validatePassword(password);
    validateEmail(email);
    validatePhone(phone);

    // If all validations pass, you would typically save the user to a database here
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

// Add this line after all routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});