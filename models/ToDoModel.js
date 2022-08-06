import mongoose from "mongoose";
const todoScheme = mongoose.model(
  "Todos",
  new mongoose.Schema(
    {
      text: {
        type: String,
        required: true,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )
);

export default todoScheme;
