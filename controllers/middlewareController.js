import jwt from "jsonwebtoken";

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.TOKEN, (err, data) => {
        if (err) {
          return res.status(403).json({
            msg: "Token is not valid!",
          });
        }
        req.user = data;
        next();
      });
    } else {
      return res.status(401).json({
        msg: "You're not authenticated!",
      });
    }
  },
};

export default middlewareController;
