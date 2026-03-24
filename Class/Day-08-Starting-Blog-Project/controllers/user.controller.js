const userController = {
  userDashboard(req, res) {
    console.log(req.cookies);
    if (req.cookies.userRole === "user") {
      res.send(`These Is User DashBoard!!!!`);
    } else {
      res.send(`Sorry Admins Not Allowed`);
    }
  },
};

export default userController;
