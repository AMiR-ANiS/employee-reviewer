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
