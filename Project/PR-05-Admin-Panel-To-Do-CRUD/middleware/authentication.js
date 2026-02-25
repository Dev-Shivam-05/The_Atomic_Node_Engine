export const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/");
  }

  if (req.user.role === "admin") {
    next();
  } else {
    res.redirect("/home");
  }
};

export const auth = (req, res, next) => {
  const userCookie = req.cookies && req.cookies.user;

  if (!userCookie) {
    return res.redirect("/");
  }

  try {
    const user = JSON.parse(userCookie);
    if (!user || !user.role) {
      return res.redirect("/");
    }
    req.user = user;
    next();
  } catch (error) {
    res.redirect("/");
  }
};
