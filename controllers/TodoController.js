import TodoModel from "../models/ToDoModel.js";

export const getTodos = async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);
  const startOffset = (page - 1) * limit;
  const endOffset = startOffset + limit;

  try {
    const todos = await TodoModel.find().sort({ data: -1 });
    const total = todos.length;

    const result = {
      limit,
      page,
      total,
      data: todos,
    };

    if (total === 0) {
      res.status(200).json(result);
      return;
    }

    result.data = todos.slice(startOffset, endOffset);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      isSuccess: false,
    });
  }
};

export const getTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await TodoModel.findById({ _id: id });

    res.status(200).json({
      data: todo,
      msg: "Get Todo Successfully...",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      isSuccess: false,
    });
  }
};

export const saveTodo = async (req, res) => {
  const { text } = req.body;
  const todo = new TodoModel({
    text,
  });
  try {
    const saveTodo = await todo.save();
    res.status(200).json({
      data: saveTodo,
      msg: "Added successfully...",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      isSuccess: false,
    });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { text, isCompleted } = req.body;
  try {
    const todo = await TodoModel.findByIdAndUpdate(
      id,
      { $set: { text, isCompleted } },
      { new: true }
    );

    if (!todo) {
      res.status(404).json({
        msg: "Not found",
        isSuccess: false,
      });
    }

    res.status(200).json({
      data: todo,
      msg: "Update Todo Successfully...",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      isSuccess: false,
    });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    await TodoModel.findByIdAndDelete({ _id: id });

    res.status(200).json({
      msg: "Delete Todo Successfully...",
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      isSuccess: false,
    });
  }
};
