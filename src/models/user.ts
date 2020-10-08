import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const clientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      minlength: 8
    },
    fullName: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      default: 'notProvided'
    },
    googleId: {
      type: String,
      default: 'notOauth'
    }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
);

const clientModel = mongoose.model("Users", clientSchema);

export default clientModel;
