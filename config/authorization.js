module.exports = {
   isLoggedIn: (req, res, next) => {
   if (!req.isAuthenticated()) {
      req.flash('error-message', 'Please login to continue.');
      res.redirect('/auth/login');
   } else {
      next();
   }
   }
}