import mongoose from "mongoose";

const UserModel = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

export default UserModel;
