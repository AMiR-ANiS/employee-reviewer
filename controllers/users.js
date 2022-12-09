module.exports.signUp = (req, res) => {
  return res.render('user_sign_up', {
    title: 'Employee Reviewer | Sign Up'
  });
};

module.exports.signIn = (req, res) => {
  return res.render('user_sign_in', {
    title: 'Employee Reviewer | Sign In'
  });
};
