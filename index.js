require('dotenv').config({path: `${process.cwd()}/.env`});
const express = require('express');
const { Pool } = require('pg');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./route/authRoute');
const eventRouter = require('./route/eventRoute');
const userRouter = require('./route/userRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const catchAsync = require('./utils/catchAsync');


//Create an instance of the Express application
const app = express();


const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};

const corsOptions ={
    origin:'https://event-nexus-frontend.vercel.app', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan('dev'));

// app routes
app.use('/', () => {
  console.log('Here now')
})
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/events', eventRouter)
app.use('/api/v1/users', userRouter)

app.use(
  '*',
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find the ${req.originalUrl} route on this server`, 404);
  })
);
// Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
