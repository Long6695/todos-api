import express from "express";
import { check } from "express-validator";
import {
  registerUser,
  getUser,
  getUsers,
  login,
  refresh,
  logout,
} from "../controllers/UserController.js";
import middlewareController from "../controllers/middlewareController.js";

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
router.post("/refresh-token", refresh);
router.post("/user/logout", middlewareController.verifyToken, logout);
export default router;
