const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const hbs = require('hbs');

const mongoose = require('mongoose');
const FileStore = require('session-file-store')(session);

const indexRouter = require('./routes/index');
const entriesRouter = require('./routes/entries');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');


require('dotenv').config()

const app = express();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('trust proxy', 1)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

const secretSession = 'e786f16227a0f423a50912beed79b21fce05e7668e2a7f5f8164655a000902eceee060baf148f56d04e7a5cdb097896403cb219c909ad1e13f3efe0a8779cf01';
app.use(session({
  name: 'sid',
  secret: secretSession,
  resave: false,
  store: new FileStore({
    secret: secretSession,
  }),
  saveUninitialized: false,
  cookie: { secure: false },
}));


app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {

    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use((req, res, next) => {
  res.locals.email = req.session?.user?.email
  res.locals.id = req.session?.user?.id
  res.locals.phone = req.session?.user?.phone
  res.locals.nameLombard = req.session?.user?.nameLombard
  res.locals.adressLombard = req.session?.user?.adressLombard
  res.locals.managerName = req.session?.user?.managerName
  res.locals.admin = req.session?.user?.admin
  res.locals.authorised = req.session?.user?.authorised
  next()
})

app.use('/', indexRouter);
app.use('/entries', entriesRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);


app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {


  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT, () => {
  console.log("ok");
})
