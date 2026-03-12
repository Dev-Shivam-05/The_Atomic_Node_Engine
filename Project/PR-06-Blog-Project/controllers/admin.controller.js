const adminController = {
  adminPanel(req, res) {
    if (req.cookies.userRole === "admin") {
      return res.render('pages/adminDashboard.ejs');
    } else {
      res.send(`Sorry Users Not Allowed`);
    }
  },
};

export default adminController;