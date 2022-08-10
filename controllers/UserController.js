import { validationResult } from "express-validator";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();

    return res.status(200).json({
      data: users,
      isSuccess: true,
      msg: "Get all users successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      msg: "Something went wrong!",
    });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById({ _id: id });

    res.status(200).json({
      data: user,
      isSuccess: true,
      msg: "Get User Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Something went wrong!",
    });
  }
};

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const emailExist = await UserModel.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({
      msg: "Email already exist",
      isSuccess: false,
    });
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new UserModel({
    userName: req.body.userName,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const saveUser = await user.save();
    const { ...doc } = saveUser;
    const { password, ...userInfo } = doc._doc;
    res.status(200).json({
      data: userInfo,
      isSuccess: true,
      msg: "Create User Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Something went wrong!",
    });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(404).json({
      error: errors.array(),
    });
  }

  try {
    //check email exist
    const user = await UserModel.findOne({ email: req.body.email });

    if (!Object.keys(user).length) {
      return res.status(400).json({
        msg: "Email or password is wrong",
        isSuccess: false,
      });
    }
    // validation password
    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password) {
      return res.status(400).json({
        msg: "Email or password is wrong",
        isSuccess: false,
      });
    }

    //create && assign access token
    const payload = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
    };
    jwt.sign(payload, process.env.TOKEN, { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      res.header("x-auth-token", token).json({
        token,
        msg: "Login successfully!",
        isSuccess: true,
      });
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Somthing went wrong!",
    });
  }
};
