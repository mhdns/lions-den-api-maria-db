const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

const auth = require('./routes/auth');
const project = require('./routes/project');
const comment = require('./routes/comment');

// Colors
const info = chalk.yellow.bold;
const error = chalk.red;


// Load environment variables
if (process.env.NODE_ENV === 'test') {
  try {
    dotenv.config({ path: './config/.env.test' });
  } catch (err) {
    console.log(err);
  }
} else if (process.env.NODE_ENV !== 'production') {
  try {
    dotenv.config({ path: './config/.env.dev' });
  } catch (err) {
    console.log(err);
  }
}

// Connect to DB
// const connectDbForever = () => {
//   try {
//     connectDB();
//   } catch (err) {
//     console.log(err);
//     connectDbForever();
//   }
// };

connectDB();

connectDB();
connectDB();


// Create express app
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Prevent XSS Attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins window
  max: 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mounting Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/projects', project);
app.use('/api/v1/comments', comment);

// Error Handler
app.use(errorHandler);

// eslint-disable-next-line no-console
const server = app
  .listen(process.env.PORT,
    console.log(info(`Server running in Port ${process.env.PORT}`)));


// Handle unhandled promise rejections
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (err, promise) => {
  console.log(error(`Error: ${err.message}`));
  // CLose server and exit
  server.close(() => process.exit(1));
});

module.exports = app;
