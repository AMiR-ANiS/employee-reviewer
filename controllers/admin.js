const User = require('../models/user');
const Review = require('../models/review');
const Feedback = require('../models/feedback');

// controller function for rendering the add employee page
module.exports.addEmployeePage = (req, res) => {
  return res.render('add_employee', {
    title: 'Employee Reviewer | Add Employee'
  });
};

// controller function for adding a user
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

// controller function for rendering update employee list
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

// controller function for displaying list of employees page
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

// controller function for displaying update page
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

// controller function for updating an employee
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
      let reviewed = user.reviewed;
      if (req.body.admin === 'true') {
        emptype = 'admin';
        reviewed = false;

        user.reviewsToFeedback.forEach(async (id) => {
          await User.findByIdAndUpdate(user.id, {
            $pull: {
              reviewsToFeedback: id
            }
          });

          await Review.findByIdAndUpdate(id, {
            $pull: {
              employeesAssigned: user.id
            }
          });
        });

        let review = await Review.findOne({
          employee: user.id
        });

        if (review) {
          review.employeesAssigned.forEach(async (id) => {
            await User.findByIdAndUpdate(id, {
              $pull: {
                reviewsToFeedback: review.id
              }
            });
          });

          await Feedback.deleteMany({
            review: review.id
          });

          await Review.findByIdAndDelete(review.id);
        }

        let feedbacks = await Feedback.find({
          employee: user.id
        });

        feedbacks.forEach(async (feedback) => {
          await Review.findByIdAndUpdate(feedback.review, {
            $pull: {
              feedbacks: feedback.id
            }
          });

          await Feedback.findByIdAndDelete(feedback.id);
        });
      }

      if (passwordChanged) {
        await User.findByIdAndUpdate(user.id, {
          name: req.body.name,
          type: emptype,
          reviewed: reviewed,
          password: req.body.password
        });
      } else {
        await User.findByIdAndUpdate(user.id, {
          name: req.body.name,
          type: emptype,
          reviewed: reviewed
        });
      }

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

// controller function for displaying remove employees list
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

// controller for removing an employee
module.exports.removeEmployee = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      req.flash('error', 'To delete your account, go to your profile page!');
      return res.redirect('back');
    }

    let user = await User.findById(req.params.id);
    if (user) {
      user.reviewsToFeedback.forEach(async (id) => {
        await Review.findByIdAndUpdate(id, {
          $pull: {
            employeesAssigned: user.id
          }
        });
      });

      let review = await Review.findOne({
        employee: user.id
      });

      if (review) {
        review.employeesAssigned.forEach(async (id) => {
          await User.findByIdAndUpdate(id, {
            $pull: {
              reviewsToFeedback: review.id
            }
          });
        });

        await Feedback.deleteMany({
          review: review.id
        });

        await Review.findByIdAndDelete(review.id);
      }

      let feedbacks = await Feedback.find({
        employee: user.id
      });

      feedbacks.forEach(async (feedback) => {
        await Review.findByIdAndUpdate(feedback.review, {
          $pull: {
            feedbacks: feedback.id
          }
        });

        await Feedback.findByIdAndDelete(feedback.id);
      });

      await User.findByIdAndDelete(user.id);
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

// controller for displaying add review for employee list
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

// controller function for displaying page for adding a review for an employee
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

// controller for adding a review for an employee
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

      await User.findByIdAndUpdate(employee.id, {
        reviewed: true
      });

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

// controller function for viewing reviews
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

// controller function for displaying update reviews list
module.exports.updateReviewList = async (req, res) => {
  try {
    let reviews = await Review.find({})
      .sort(`${req.query.sort}`)
      .populate({
        path: 'employee',
        select: {
          password: 0
        }
      });

    return res.render('update_review_list', {
      title: 'Employee Reviewer | Update Reviews',
      reviews,
      sortBy: req.query.sort
    });
  } catch (err) {
    req.flash('error', 'Error while rendering review list');
    return res.redirect('back');
  }
};

// controller function for displaying page for updating a review
module.exports.updateReviewPage = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id).populate({
      path: 'employee',
      select: {
        password: 0
      }
    });

    if (review) {
      return res.render('update_review', {
        title: 'Employee Reviewer | Update Review',
        review,
        employee: review.employee
      });
    } else {
      req.flash('error', '404! review not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while rendering update review page');
    return res.redirect('back');
  }
};

// controller function for updating a review of an employee
module.exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (review) {
      if (req.body.review_text.length === 0) {
        req.flash('error', 'Review text cannot be empty!');
        return res.redirect('back');
      }

      if (!req.body.stars) {
        req.flash('error', 'Please specify employee rating!');
        return res.redirect('back');
      }

      await Review.findByIdAndUpdate(review.id, {
        text: req.body.review_text,
        stars: req.body.stars
      });

      req.flash('success', 'review updated successfully!');
      return res.redirect('/admin/update-review-list?sort=-stars');
    } else {
      req.flash('error', '404! review not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while updating review for employee!');
    return res.redirect('back');
  }
};

// controller function for displaying assign employees for reviews page
module.exports.assignEmployeeList = async (req, res) => {
  try {
    let reviews = await Review.find({})
      .sort(`${req.query.sort}`)
      .populate({
        path: 'employee',
        select: {
          password: 0
        }
      });

    return res.render('assign_employee_list', {
      title: 'Employee Reviewer | Assign Employees for feedback',
      reviews,
      sortBy: req.query.sort
    });
  } catch (err) {
    req.flash('error', 'Error while rendering review list');
    return res.redirect('back');
  }
};

// controller function for displaying page for assigning employees to participate in an employee's performance review
module.exports.assignEmployeePage = async (req, res) => {
  try {
    let review = await Review.findById(req.query.id).populate({
      path: 'employee',
      select: {
        password: 0
      }
    });

    if (review) {
      let employees = await User.find({
        type: 'employee'
      })
        .select({ password: 0 })
        .sort(`${req.query.sort}`);

      return res.render('assign_employee', {
        title: 'Employee Reviewer | Assign Employees',
        review,
        employees,
        sortBy: req.query.sort,
        employee: review.employee
      });
    } else {
      req.flash('error', '404! review not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash(
      'error',
      'Error while rendering assign employees for review page'
    );
    return res.redirect('back');
  }
};

// controller function for assigning employees to give feedback for an employee's performance review
module.exports.assignEmployees = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (review) {
      for (let i = 0; i < req.body.length; i++) {
        if (req.body[i]) {
          let employee = await User.findById(req.body[i]);
          if (!employee || employee.type !== 'employee') {
            req.flash('error', 'invalid operation!');
            return res.redirect('back');
          }
        }
      }

      review.employeesAssigned.forEach(async (id) => {
        await Review.findByIdAndUpdate(review.id, {
          $pull: {
            employeesAssigned: id
          }
        });
        await User.findByIdAndUpdate(id, {
          $pull: {
            reviewsToFeedback: review.id
          }
        });
      });

      for (let i = 0; i < req.body.length; i++) {
        if (req.body[i]) {
          await Review.findByIdAndUpdate(review.id, {
            $push: {
              employeesAssigned: req.body[i]
            }
          });
          await User.findByIdAndUpdate(req.body[i], {
            $push: {
              reviewsToFeedback: review.id
            }
          });
        }
      }

      req.flash('success', 'employees assigned successfully!');
      return res.redirect('/admin/assign-employee-list?sort=-stars');
    } else {
      req.flash('error', '404! review not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while assigning employees for feedback!');
    return res.redirect('back');
  }
};

// controller function for rendering feedbacks for a review
module.exports.viewFeedbacks = async (req, res) => {
  try {
    let review;

    if (req.query.sort === 'date') {
      review = await Review.findById(req.params.id)
        .populate({
          path: 'employee',
          select: {
            password: 0
          }
        })
        .populate({
          path: 'feedbacks',
          options: {
            sort: {
              updatedAt: 1
            }
          },
          populate: {
            path: 'employee',
            select: {
              password: 0
            }
          }
        });
    } else if (req.query.sort === '-date') {
      review = await Review.findById(req.params.id)
        .populate({
          path: 'employee',
          select: {
            password: 0
          }
        })
        .populate({
          path: 'feedbacks',
          options: {
            sort: {
              updatedAt: -1
            }
          },
          populate: {
            path: 'employee',
            select: {
              password: 0
            }
          }
        });
    }

    if (review) {
      return res.render('feedback_list', {
        title: 'Employee Reviewer | View Feedbacks',
        review,
        employee: review.employee,
        feedbacks: review.feedbacks,
        sortBy: req.query.sort
      });
    } else {
      req.flash('error', 'review not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while displaying review feedbacks!');
    return res.redirect('back');
  }
};
