// middleware for sending flash messages from request to response for views
module.exports.setFlash = (req, res, next) => {
  res.locals.flash = {
    success: req.flash('success')[0],
    error: req.flash('error')[0]
  };

  return next();
};

// middleware for checking sign in input by the user
module.exports.checkSignInInput = (req, res, next) => {
  if (req.body.email.length === 0) {
    req.flash('error', 'Email cannot be empty!');
    return res.redirect('back');
  }

  if (req.body.password.length === 0) {
    req.flash('error', 'Password cannot be empty!');
    return res.redirect('back');
  }
  return next();
};

// middleware for checking if user is authenticated using passport js
module.exports.checkUserAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'Please Log in to continue!');
    return res.redirect('/users/sign-in');
  }
};

// middleware for setting user in response.locals for views if user is authenticated
module.exports.setUserAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  return next();
};

// middleware for checking if user is admin
module.exports.checkIfUserIsAdmin = (req, res, next) => {
  if (req.user.type === 'admin') {
    return next();
  } else {
    req.flash('error', 'Invalid route!');
    return res.redirect('back');
  }
};

// middleware for checking if user is employee
module.exports.checkIfUserIsEmployee = (req, res, next) => {
  if (req.user.type === 'employee') {
    return next();
  } else {
    req.flash('error', 'Invalid route!');
    return res.redirect('back');
  }
};
