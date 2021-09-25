module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isStudent = (req, res, next) => {
    if (req.user.isStudent === true && req.user._id == req.params.id) {
        return next();
    }
    req.flash('error', 'You must login to excess this page!');
    res.redirect('/stulogin');
};

module.exports.isCompany = (req, res, next) => {
    if (req.user.isCompany === true && req.user._id == req.params.id) {
        return next();
    }
    req.flash('error', 'You must login to excess this page!');
    res.redirect('/complogin');
};
    
module.exports.isStaff = (req, res, next) => {
    if (req.user.isStaff === true && req.user._id == req.params.id) {
        return next();
    }
    req.flash('error', 'You must login to excess this page!');
    res.redirect('/stafflogin');
};
       