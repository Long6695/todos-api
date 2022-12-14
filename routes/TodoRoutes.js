import express from "express";
import middlewareController from "../controllers/middlewareController.js";

import {
  getTodos,
  getTodo,
  updateTodo,
  saveTodo,
  deleteTodo,
} from "../controllers/TodoController.js";

export const router = express.Router();

router.get("/", middlewareController.verifyToken, getTodos);
router.get("/todo/:id", middlewareController.verifyToken, getTodo);
router.put("/update/:id", middlewareController.verifyToken, updateTodo);
router.post("/", middlewareController.verifyToken, saveTodo);
router.delete("/delete/:id", middlewareController.verifyToken, deleteTodo);
