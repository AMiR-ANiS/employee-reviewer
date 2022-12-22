module.exports.setFlash = (req, res, next) => {
  res.locals.flash = {
    success: req.flash('success')[0],
    error: req.flash('error')[0]
  };

  next();
};

module.exports.checkSignInInput = (req, res, next) => {
  if (req.body.email.length === 0) {
    req.flash('error', 'Email cannot be empty!');
    return res.redirect('back');
  }

  if (req.body.password.length === 0) {
    req.flash('error', 'Password cannot be empty!');
    return res.redirect('back');
  }
  next();
};

module.exports.checkUserAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'Please Log in to continue!');
    return res.redirect('/users/sign-in');
  }
};

module.exports.setUserAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports.checkIfUserIsAdmin = (req, res, next) => {
  if (req.user.type === 'admin') {
    next();
  } else {
    req.flash('error', 'Forbidden route!');
    return res.redirect('back');
  }
};
