// controller function for viewing home page
module.exports.home = (req, res) => {
  return res.render('home', {
    title: 'Employee Reviewer | Home'
  });
};
