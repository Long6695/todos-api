import { validationResult } from "express-validator";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let refreshTokens = [];

const generateAccessToken = (user) => {
  const payload = {
    _id: user._id,
    userName: user.userName,
    email: user.email,
  };
  return jwt.sign(payload, process.env.TOKEN, {
    expiresIn: "30s",
  });
};

const generateRefreshToken = (user) => {
  const payload = {
    _id: user._id,
    userName: user.userName,
    email: user.email,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: "365d",
  });
};

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
    await user.save();
    res.status(200).json({
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
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({
        msg: "Email or password is wrong",
        isSuccess: false,
      });
    }

    const { password, ...others } = user._doc;

    //create && assign access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    res.status(200).json({
      accessToken,
      data: others,
      isSuccess: true,
      msg: "Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      msg: "Somthing went wrong!",
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({
        isSuccess: false,
      });
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res
        .status(403)
        .json({ isSuccess: false, msg: "Refresh token is not valid!" });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) throw err;

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
      isSuccess: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json({
      isSuccess: true,
      msg: "Log out successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isSuccess: false,
      msg: "Something went wrong!",
    });
  }
};
