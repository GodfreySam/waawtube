const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const mongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const ejs = require('ejs');
const flash = require('connect-flash');

// Global Variables
const { globalVariables } = require('./config/configuration');

// Passport config
require('./config/passport.config')(passport);


//  Database connection
mongoose.connect('mongodb://localhost/waawtube')
   .then(connected => console.log('Daatabase connected successfully'))
   .catch(err => console.log('Error connecting to DB', err));

// initialize  express app
const app = express()

// Configure express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
   secret: 'another-secret',
   saveUninitialized: true,
   resave: true,
   cookie: { maxAge: Date.now() + 3600 * 24 * 60 * 60 },
   store: mongoStore.create({
      mongoUrl: 'mongodb://localhost/waawtube',
      ttl: 3600 * 24 * 60 * 60
   })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(flash());
app.use(globalVariables);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes (Routes grouping)
const defaultRoutes = require('./routes/default/default.routes');
const authRoutes = require('./routes/auth/auth.routes');
const videoRoutes = require("./routes/video/video.routes");

app.use('/', defaultRoutes);
app.use('/auth', authRoutes);
app.use('/video', videoRoutes);

// app.get('/contact', (req, res) => {
//    res.send('Contact page');
// });

// Catch 404 and forward to error handler
app.use((req, res, next) => {
   res.render('error404');
   next();
});

//  assign port to a variable
const port = process.env.PORT || 3700;

app.listen(port, () => console.log(`server running on http://localhost:${port}`));