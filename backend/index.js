require("dotenv").config();

const express = require("express");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");

const mongoose = require("mongoose");

var cors = require("cors");

// express app
const app = express();

app.use(
  cors({
    origin: ["https://productivity-workspace.vercel.app"],
    methods: ["GET", "POST", "PATCH", "DELETE"]
  })
);

//middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);

// connect to db
const port = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(port, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch(error => {
    console.log(error);
  });

module.exports = app;
