import env from './env.js';
import express from 'express';
import connectDB from './db/connectUser.js';
import users from './routes/web.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const port = process.env.PORT || 5000;
// const dataBase_URL = process.env.dataBase_URL || 'mongodb://127.0.0.1:27017';
const dataBase_URL = process.env.DATABASE_URL;

// using middleware for getting html form data
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Create MongoStore instance
const MongoStoreSession = MongoStore(session);

// Configure session middleware
app.use(
  session({
    secret: 'jhdbbkbdvbjbkbdbkjbdboggbkftsrsdv',
    resave: false,
    saveUninitialized: true,
    store: new MongoStoreSession({
      mongooseConnection: mongoose.connection,
      collection: 'sessions', 
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, 
      secure: true, 
      httpOnly: true,
    },
  })
);

app.use(session({
  name: 'logout',
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));


// Set views directory
app.set('views', join(__dirname, 'views'));

// Set view engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(join(__dirname, 'public')));

// Serve static files for specific routes
app.use('/edit', express.static(join(__dirname, 'public')));
app.use('/delete', express.static(join(__dirname, 'public')));
app.use('/logout', express.static(join(__dirname, 'public')));
app.use('/update', express.static(join(__dirname, 'public')));



// Connecting with Database
connectDB(dataBase_URL)
  .then(() => {        
    app.use('/', users);
  })
  .catch((error) => {
    app.get('*', (req, res) => {
      res.render('servererror', { serverError: "Database Connection failed, Please Check Your network Connection" });
    });
  });

app.listen(port, () => console.log(`App is Running on port ${port}`));

export default app;