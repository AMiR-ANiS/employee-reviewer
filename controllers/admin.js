const User = require('../models/user');

module.exports.addEmployee = (req, res) => {
  return res.render('add_employee', {
    title: 'Employee Reviewer | Add Employee'
  });
};

module.exports.createEmployee = async (req, res) => {
  try {
    if (req.body.name.length === 0) {
      req.flash('error', 'Name cannot be empty!');
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
        type: 'employee'
      });
      req.flash('success', 'Employee added successfully!');
      return res.redirect('/');
    }
  } catch (err) {
    req.flash('error', 'Error while adding employee!');
    return res.redirect('back');
  }
};
