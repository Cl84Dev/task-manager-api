const express = require("express");
const verifyToken = require("../middlewares/verifyToken.js");
const UserController = require("../controllers/UserController.js");

const userRouter = express.Router();

//Public routes
userRouter.post("/signup", UserController.signup);

userRouter.post("/login", UserController.login);

//Private routes
userRouter.patch("/checkemail", UserController.checkEmail);

userRouter.post("/checkcode", verifyToken, UserController.checkCode);

userRouter.patch("/recover", verifyToken, UserController.recover);

module.exports = userRouter;
