const Review = require('../models/review');
const Feedback = require('../models/feedback');
const User = require('../models/user');

// controller function for viewing list of reviews requiring feedback
module.exports.viewReviews = async (req, res) => {
  try {
    let reviews = await Review.find({
      _id: {
        $in: req.user.reviewsToFeedback
      }
    })
      .sort(`${req.query.sort}`)
      .populate({
        path: 'employee',
        select: {
          password: 0
        }
      });

    return res.render('review_requiring_feedback', {
      title: 'Employee Reviewer | View Reviews Requiring Feedback',
      reviews,
      sortBy: req.query.sort
    });
  } catch (err) {
    req.flash(
      'error',
      'Error while displaying list of reviews requiring feedback!'
    );
    return res.redirect('back');
  }
};

// controller function for displaying submit feedback page for a review
module.exports.feedbackPage = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id).populate({
      path: 'employee',
      select: {
        password: 0
      }
    });

    if (review) {
      return res.render('review_feedback_page', {
        title: 'Employee Reviewer | Feedback Review',
        review,
        employee: review.employee
      });
    } else {
      req.flash('error', '404! review not found!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while rendering review feedback page');
    return res.redirect('back');
  }
};

// controller function for submitting a feedback
module.exports.submitFeedback = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    let employee = await User.findById(req.user.id);

    if (
      review &&
      employee.reviewsToFeedback.findIndex((id) => review.id == id) !== -1
    ) {
      if (req.body.feedback_text.length === 0) {
        req.flash('error', 'Feedback cannot be empty!');
        return res.redirect('back');
      }

      let feedback = await Feedback.findOne({
        employee: employee.id,
        review: review.id
      });

      if (feedback) {
        await Feedback.findByIdAndUpdate(feedback.id, {
          text: req.body.feedback_text
        });
      } else {
        feedback = await Feedback.create({
          text: req.body.feedback_text,
          employee: employee.id,
          review: review.id
        });

        await Review.findByIdAndUpdate(review.id, {
          $push: {
            feedbacks: feedback.id
          },
          $pull: {
            employeesAssigned: employee.id
          }
        });
      }

      await User.findByIdAndUpdate(employee.id, {
        $pull: {
          reviewsToFeedback: review.id
        }
      });

      req.flash('success', 'feedback submitted successfully!');
      return res.redirect('/employee/view-reviews?sort=-stars');
    } else {
      req.flash('error', 'Invalid operation!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Error while submitting feedback for review!');
    return res.redirect('back');
  }
};
