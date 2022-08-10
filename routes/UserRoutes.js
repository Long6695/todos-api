import express from "express";
import { check } from "express-validator";
import {
  registerUser,
  getUser,
  getUsers,
  login,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.post(
  "/user/register",
  check("userName", "User name is required").not().isEmpty(),
  check("email", "Email is required").not().isEmpty().isEmail(),
  check("password", "Password is required").not().isEmpty(),
  registerUser
);
router.post(
  "/user/login",
  check("email", "Email is required").not().isEmpty().isEmail(),
  check("password", "Password is required").not().isEmpty(),
  login
);
export default router;
