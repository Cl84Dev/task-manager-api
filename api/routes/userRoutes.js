const express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { error500 } = require("../helpers/errorHandling.js");
const codeGenerator = require("../helpers/codeGenerator.js");
const verifyToken = require("../middlewares/verifyToken.js");

dotenv.config();

const saltRounds = 10;

const userRouter = express.Router();

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.SERVICE_EMAIL,
    pass: process.env.SERVICE_PASSWORD,
  },
});

//Public routes
userRouter.post("/signup", async (req, res) => {
  const { username, password, email, name } = req.body;

  if (!username || !password || !email || !name) {
    res.status(422).json({ error: "Faltam um ou mais dados." });
    return;
  }

  try {
    const result = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).exec();

    if (result) {
      res.status(422).json({ error: "Usuário ou email já existe." });
      return;
    }
  } catch (error) {
    error500(error, res);
    return;
  }

  bcrypt.hash(password, saltRounds, async (error, hash) => {
    if (error) {
      error500(error, res);
      return;
    }

    const newUser = {
      username,
      password: hash,
      email,
      name,
      email_checked: false,
    };

    try {
      await User.create(newUser);
      res.status(201).json({ message: "Usuário criado com sucesso." });
    } catch (error) {
      error500(error, res);
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422).json({ error: "Faltam um ou mais dados." });
    return;
  }

  try {
    const user = await User.findOne({
      username: username,
    }).exec();

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    bcrypt.compare(password, user.password, (error, result) => {
      if (error) {
        error500(error, res);
        return;
      }
      if (result) {
        const token = jwt.sign({ username: user.username }, process.env.SECRET);
        res
          .status(200)
          .json({ message: "Usuário logado com sucesso.", token: token });
      } else {
        res.status(422).json({ error: "Senha inválida." });
        return;
      }
    });
  } catch (error) {
    error500(error, res);
    return;
  }
});

//Private routes
userRouter.patch("/checkemail", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(422).json({ error: "Email não informado." });
    return;
  }

  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    let code = codeGenerator();

    await User.updateOne({ _id: user._id }, { recover: code }).catch(
      (error) => {
        error500(error, res);
        return;
      }
    );

    const mailOptions = {
      from: process.env.SERVICE_EMAIL,
      to: user.email,
      subject: "Gerenciador de Tarefas - Código de Recuperação",
      text: `Seu código de recuperação é: ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        error500(error, res);
        return;
      } else {
        const token = jwt.sign({ email: user.email }, process.env.SECRET);
        res.status(200).json({
          message:
            "Código de recuperação enviado para o email do usuário com sucesso.",
          token: token,
        });
      }
    });
  } catch (error) {
    error500(error, res);
    return;
  }
});

userRouter.post("/checkcode", verifyToken, async (req, res) => {
  const { email } = req.user;
  const { code } = req.body;

  if (!email) {
    res.status(403).json({ error: "Operação não permitida." });
    return;
  }

  if (!code) {
    res.status(422).json({ error: "Código não informado." });
    return;
  }

  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    if (code === user.recover) {
      const token = jwt.sign({ email: user.email }, process.env.SECRET, {
        expiresIn: "10m",
      });
      res
        .status(200)
        .json({ message: "Código de recuperação validado.", token: token });
    } else {
      res.status(422).json({ error: "Código de recuperação inválido." });
    }
  } catch (error) {
    error500(error, res);
    return;
  }
});

userRouter.patch("/recover", verifyToken, async (req, res) => {
  const { email } = req.user;
  const { password } = req.body;

  if (!email) {
    res.status(403).json({ error: "Operação não permitida." });
    return;
  }

  if (!password) {
    res.status(422).json({ error: "Nova senha não informada." });
    return;
  }

  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    bcrypt.hash(password, saltRounds, async (error, hash) => {
      if (error) {
        error500(error, res);
        return;
      }

      await User.updateOne({ _id: user._id }, { password: hash }).catch(
        (error) => {
          error500(error);
          return;
        }
      );

      res.status(200).json({ message: "Senha alterada com sucesso." });
    });
  } catch (error) {
    error500(error, res);
    return;
  }
});

module.exports = userRouter;
