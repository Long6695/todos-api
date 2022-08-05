import express from "express";

import {
  getTodos,
  getTodo,
  updateTodo,
  saveTodo,
  deleteTodo,
} from "../controllers/TodoController.js";

export const router = express.Router();

router.get("/", getTodos);
router.get("/todo/:id", getTodo);
router.post("/update/:id", updateTodo);
router.put("/", saveTodo);
router.delete("/delete/:id", deleteTodo);
