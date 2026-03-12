const userController = {
  userDashboard(req, res) {
    console.log(req.cookies);
    if (req.cookies.userRole === "user") {
      return res.render("pages/userDashboard.ejs");
    } else if (req.cookies.userRole === "admin") {
      res.send(`Sorry Admins Not Allowed`);
    }else {
       res.redirect('/');
    }
  },
};

export default userController;
