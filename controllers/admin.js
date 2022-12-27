const User = require('../models/user');
const Review = require('../models/review');

module.exports.addEmployeePage = (req, res) => {
  return res.render('add_employee', {
    title: 'Employee Reviewer | Add Employee'
  });
};

module.exports.addEmployee = async (req, res) => {
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
      req.flash('success', 'Employee added successfully!');
      return res.redirect('/');
    }
  } catch (err) {
    req.flash('error', 'Error while adding employee!');
    return res.redirect('back');
  }
};

module.exports.updateEmployeeList = async (req, res) => {
  try {
    let employees = await User.find({ _id: { $ne: req.user.id } })
      .select({ password: 0 })
      .sort(`${req.query.sort}`);

    return res.render('update_employee_list', {
      title: 'Employee Reviewer | Update Employees',
      employees,
      sortBy: req.query.sort
    });
  } catch (err) {
    req.flash('error', 'Error while displaying employee list');
    return res.redirect('back');
  }
};

module.exports.employeeList = async (req, res) => {
  try {
    let employees = await User.find({ _id: { $ne: req.user.id } })
      .select({ password: 0 })
      .sort(`${req.query.sort}`);

    return res.render('employee_list', {
      title: 'Employee Reviewer | View Employees',
      employees,
      sortBy: req.query.sort
    });
  } catch (err) {
    req.flash('error', 'Error while displaying employee list');
    return res.redirect('back');
  }
};

module.exports.updatePage = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      req.flash(
        'error',
        'To update your profile, click your username at the top'
      );
      return res.redirect('back');
    }
    let employee = await User.findById(req.params.id).select({ password: 0 });

    if (employee) {
      return res.render('update_employee', {
        title: 'Employee Reviewer | Update Employee',
        employee
      });
    } else {
      req.flash('error', '404! user not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while rendering update page');
    return res.redirect('back');
  }
};

module.exports.updateEmployee = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      req.flash(
        'error',
        'To update your profile, click your username at the top'
      );
      return res.redirect('back');
    }

    let user = await User.findById(req.params.id);
    if (user) {
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

      let emptype = user.type;
      if (req.body.admin === 'true') {
        emptype = 'admin';
      }

      user.name = req.body.name;
      user.type = emptype;
      if (passwordChanged) {
        user.password = req.body.password;
      }

      await user.save();
      req.flash('success', 'employee updated successfully!');
      return res.redirect('/admin/update-employee-list?sort=name');
    } else {
      req.flash('error', '404! user not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while updating employee!');
    return res.redirect('back');
  }
};

module.exports.removeEmployeeList = async (req, res) => {
  try {
    let employees = await User.find({ _id: { $ne: req.user.id } })
      .select({ password: 0 })
      .sort(`${req.query.sort}`);

    return res.render('remove_employee_list', {
      title: 'Employee Reviewer | Remove Employees',
      employees,
      sortBy: req.query.sort
    });
  } catch (err) {
    req.flash('error', 'Error while rendering employee list');
    return res.redirect('back');
  }
};

module.exports.removeEmployee = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      req.flash('error', 'To delete your account, go to your profile page!');
      return res.redirect('back');
    }

    let user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      req.flash('success', 'employee removed successfully!');
      return res.redirect('/admin/remove-employee-list?sort=name');
    } else {
      req.flash('error', '404! user not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while removing employee!');
    return res.redirect('back');
  }
};

module.exports.addReviewList = async (req, res) => {
  try {
    let employees = await User.find({
      type: 'employee',
      reviewed: false
    })
      .select({ password: 0 })
      .sort(`${req.query.sort}`);

    return res.render('add_review_list', {
      title: 'Employee Reviewer | Add Reviews',
      employees,
      sortBy: req.query.sort
    });
  } catch (err) {
    req.flash('error', 'Error while rendering employee list');
    return res.redirect('back');
  }
};

module.exports.addReviewPage = async (req, res) => {
  try {
    let employee = await User.findById(req.params.id).select({ password: 0 });

    if (
      employee &&
      employee.type === 'employee' &&
      employee.reviewed === false
    ) {
      return res.render('add_review', {
        title: 'Employee Reviewer | Add Review',
        employee
      });
    } else {
      req.flash('error', '404! user not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while rendering add review page');
    return res.redirect('back');
  }
};

module.exports.addReview = async (req, res) => {
  try {
    let employee = await User.findById(req.params.id);

    if (
      employee &&
      employee.type === 'employee' &&
      employee.reviewed === false
    ) {
      if (req.body.review_text.length === 0) {
        req.flash('error', 'Review text cannot be empty!');
        return res.redirect('back');
      }

      if (!req.body.stars) {
        req.flash('error', 'Please specify employee rating!');
        return res.redirect('back');
      }

      let review = await Review.create({
        text: req.body.review_text,
        stars: req.body.stars,
        employee: req.params.id
      });

      employee.reviewed = true;
      await employee.save();
      req.flash('success', 'employee reviewed successfully!');
      return res.redirect('/admin/add-review-list?sort=name');
    } else {
      req.flash('error', '404! user not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while adding review for employee!');
    return res.redirect('back');
  }
};

module.exports.viewReviews = async (req, res) => {
  try {
    let reviews = await Review.find({})
      .sort(`${req.query.sort}`)
      .populate({
        path: 'employee',
        select: {
          password: 0
        }
      });

    return res.render('review_list', {
      title: 'Employee Reviewer | View Reviews',
      reviews,
      sortBy: req.query.sort
    });
  } catch (err) {
    req.flash('error', 'Error while rendering employee reviews!');
    return res.redirect('back');
  }
};
