const User = require('../models/user');

module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  } else {
    return res.render('user_sign_up', {
      title: 'Employee Reviewer | Sign Up'
    });
  }
};

module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  } else {
    return res.render('user_sign_in', {
      title: 'Employee Reviewer | Sign In'
    });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    if (req.body.name.length === 0) {
      req.flash('error', 'Username cannot be empty!');
      return res.redirect('back');
    }

    if (req.body.email.length === 0) {
      req.flash('error', 'Email cannot be empty!');
      return res.redirect('back');
    }

    if (req.body.password.length === 0) {
      req.flash('error', 'Password cannot be empty!');
      return res.redirect('back');
    }

    if (req.body.password !== req.body.confirm_password) {
      req.flash('error', 'Password and confirm password should match!');
      return res.redirect('back');
    }

    let emptype = 'employee';
    if (req.body.admin === 'true') {
      emptype = 'admin';
    }

    let user = await User.findOne({
      email: req.body.email
    });

    if (user) {
      req.flash('error', 'User with that email already exists!');
      return res.redirect('back');
    } else {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        type: emptype
      });
      req.flash(
        'success',
        'User registered successfully!, Please log in to continue!'
      );
      return res.redirect('/users/sign-in');
    }
  } catch (err) {
    req.flash('error', 'Error in registering user!');
    return res.redirect('back');
  }
};

module.exports.createSession = (req, res) => {
  req.flash('success', 'Welcome!');
  return res.redirect('/');
};

module.exports.destroySession = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Log out successful!');
    return res.redirect('/');
  });
};

module.exports.updatePage = async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select({ password: 0 });

    return res.render('update_profile', {
      title: 'Employee Reviewer | Update Profile',
      user
    });
  } catch (err) {
    req.flash('error', 'Error while rendering update page');
    return res.redirect('back');
  }
};

module.exports.update = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);

    if (req.body.name.length === 0) {
      req.flash('error', 'Name cannot be empty!');
      return res.redirect('back');
    }

    let passwordChanged = false;
    if (req.body.password.length !== 0) {
      passwordChanged = true;
    }

    if (req.body.password !== req.body.confirm_password) {
      req.flash('error', 'Password and confirm password should match!');
      return res.redirect('back');
    }

    user.name = req.body.name;

    if (passwordChanged) {
      user.password = req.body.password;
    }

    await user.save();
    req.flash('success', 'Profile updated successfully!');
    return res.redirect('/');
  } catch (err) {
    req.flash('error', 'Error while updating profile!');
    return res.redirect('back');
  }
};
