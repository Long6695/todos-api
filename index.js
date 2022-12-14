import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routes/TodoRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/todos", router);
app.use("/auth", userRoutes);

const PORT = process.env.PORT || 8080;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((x) => console.log(`MongoDB connected ${x}`))
  .catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Project with Nodejs Express and MongoDB",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
