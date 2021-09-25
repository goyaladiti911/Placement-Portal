const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Company = require('./models/company');
const Student = require('./models/student');
const Staff = require('./models/staff');

const adminRoutes = require('./routes/admin');
const staffRoutes = require('./routes/staff');
const studentRoutes = require('./routes/student');
const companyRoutes = require('./routes/company');

mongoose.connect('mongodb://localhost:27017/placementcell', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine','ejs');
app.set('views', path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: 'somesecretthisis',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use('company-local',new LocalStrategy(Company.authenticate()));
passport.use('student-local',new LocalStrategy(Student.authenticate()));
passport.use('staff-local',new LocalStrategy(Staff.authenticate())); 

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    Student.findById(id, function (err, user) {
        if(err)
            done(err);
        if(user) {
            done(null, user);
        }
        else {
            Company.findById(id, function (err, user) {
                if(err)
                    done(err);
                    if(user) {
                        done(null, user);
                    }
                    else {
                        Staff.findById(id, function (err, user) {
                            if(err)
                            done(err);
                            if(user)
                            {done(null, user);}
                        });
                    }
            });
        }
    });
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//login
app.get('/login', (req,res) => {
    res.render('login/login');
})
//studentlogin
app.get('/stulogin', (req, res) => {
    res.render('login/stulogin');
})
app.post('/stulogin', passport.authenticate('student-local',{failureFlash: true,failureRedirect: '/stulogin'}),  (req, res) => {
    req.flash('success', 'Welcome');
    res.redirect(`/student/${req.user._id}`)
})

//companylogin
app.get('/complogin', (req, res) => {
    res.render('login/complogin');
})
app.post('/complogin', passport.authenticate('company-local',{failureFlash: true,failureRedirect: '/complogin'}),  (req, res) => {
    req.flash('success', 'Welcome');
    res.redirect(`/company/${req.user._id}`)
})

//stafflogin
app.get('/stafflogin', (req, res) => {
    res.render('login/stafflogin');
})
app.post('/stafflogin', passport.authenticate('staff-local',{failureFlash: true,failureRedirect: '/stafflogin'}),  (req, res) => {
    req.flash('success', 'Welcome');
    res.redirect(`/staff/${req.user._id}/student`)
})

//logout
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully logged out!');
    res.redirect('/login')
})

//Admin
app.use('/admin', adminRoutes);

//Staff Side
app.use('/staff/:id', staffRoutes);

// Student Side
app.use('/student/:id', studentRoutes);

//Company Side
app.use('/company/:id', companyRoutes);

//Common
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No! Something Went Wrong!';
    res.status(statusCode).render('error',{err});
})

app.listen(3000,() => {
    console.log('listening on the port 3000!');
})