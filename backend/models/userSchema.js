import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema({

  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: [
      {
        //Check for one lowercase, uppercase and a number
        validator: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value),
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and a number",
      },
    ],
  },
  accessToken: {
    type: String,
    default: () => bcrypt.genSaltSync(),
  }
});

export const User = model("User", userSchema);
