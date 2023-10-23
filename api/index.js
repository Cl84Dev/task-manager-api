const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const verifyToken = require("./middlewares/verifyToken.js");
const addHeader = require("./middlewares/addHeader.js");

const userRouter = require("./routes/userRoutes.js");
const projectRouter = require("./routes/projectRoutes.js");
const taskRouter = require("./routes/taskRoutes.js");

dotenv.config();

const app = express();
const port = 3000;

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use(express.json());

app.use(addHeader);

app.use("/api", userRouter);

app.use(verifyToken);

app.use("/api", projectRouter);
app.use("/api", taskRouter);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kbm5ptr.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Database connected successfuly.");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
