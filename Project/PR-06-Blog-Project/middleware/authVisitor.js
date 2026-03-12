import User from "../models/user.model.js";

const adminCredentials = {
  adminEmail: "admin@shivam.com",
  adminPassword: "123456",
  role: "admin",
};

export const authVisitor = async (req, res) => {
  try {
    console.log(`Request Body ;-  ${req.body}`);
    
    const { visitorEmail, visitorPassword } = req.body;
    
    console.log(visitorEmail);
    console.log(visitorPassword);
    
    if (!visitorEmail || !visitorPassword) {
      return res.status(400).send("Email and password required");
    }

    if (
      adminCredentials.adminEmail === visitorEmail &&
      adminCredentials.adminPassword === visitorPassword
    ) {
      res.cookie("userId", "admin_id");
      res.cookie("userRole", "admin");
      return res.redirect("/admin/dashboard");
    }

    const findUser = await User.findOne({ userEmail: visitorEmail });

    if (!findUser) {
      return res.status(401).send("No User Found");
    }

    if (findUser.userPassword !== visitorPassword) {
      return res.status(401).send("Password Is Wrong...");
    }

    res.cookie("userId", findUser._id.toString());
    res.cookie("userRole", "user");

    return res.redirect("/user/dashboard");
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).send("Server error");
  }
};

export const checkAdmin = (req, res, next) => {
  const userRole = req.cookies.userRole;

  if (!userRole) {
    return res.redirect("/");
  }

  if (userRole === "admin") {
    next();
  } else {
    return res.redirect("/user/dashboard"); // ✅ Redirect non-admins
  }
};

export const checkUser = (req, res, next) => {
  const userRole = req.cookies.userRole;

  if (!userRole) {
    return res.redirect("/");
  }

  if (userRole === "user" || userRole === "admin") {
    next(); 
  } else {
    return res.redirect("/");
  }
};