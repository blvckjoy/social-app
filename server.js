require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
   .connect(process.env.MONGODB_URI)
   .then(() => console.log("Connected to Database"))
   .catch((error) => console.error(error));

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
app.use("/users", userRouter);
app.use("/posts", postRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
