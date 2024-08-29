import { User } from "../models/userSchema";

export const authenticateUser = async (req, res, next) => {
  const user = await User.findOne({ accessToken: req.header("Authorization") });
  if (user) {
    req.user = user;
    next();
  } else {
    res
      .status(401)
      .json({ message: "Couldn't authenticate User. Please try again." });
  }
};
