const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash(
        "success",
        `Hello ${req.user.username}, Welcome to the YelpCamp!!`
      );
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", `Welcome Back ${req.user.username}`);
  const returnUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(returnUrl);
};

module.exports.logout = (req, res) => {
  req.flash("success", `Goodbye ${req.user.username},See you soon!`);
  req.logout();
  res.redirect("/campgrounds");
};
