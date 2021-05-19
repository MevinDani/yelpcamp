const { campGroundSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const AppError = require("./utils/AppError");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signedIn first");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateSchema = (req, res, next) => {
  const { error } = campGroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 404);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campgrounds = await Campground.findById(id);
  if (!campgrounds.author.equals(req.user._id)) {
    req.flash("error", "Sorry you do not have permission to that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "Sorry you do not have permission to that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 404);
  } else {
    next();
  }
};
