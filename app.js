const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var session = require('express-session');

require('./config/passport');

const auth = require('./middlewares/auth');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const positionsRouter = require('./routes/positions');

const db = require('./database/db');
db.connectToDatabase(process.env.DB_URL);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(
    {
        secret: 'secret',
        key: 'session-key',
        cookie: {
            httpOnly: false
        },
        resave: true,
        saveUninitialized: true
    }
));

app.use('/home', indexRouter);
app.use('/auth', authRouter);
app.use('/positions', positionsRouter);

module.exports = app;
