import jwt from "jsonwebtoken";

export const auth = async (req, res) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).json({
      msg: "Access denined",
      isSuccess: false,
    });
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN);

    return res.status(200).json({
      data: user,
      isSuccess: true,
    });
  } catch (error) {

    return res.status(500).json({
      isSuccess: false,
      msg: "Something went wrong!",
    });
  }
};
