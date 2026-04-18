const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/minicoding")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const assignmentRoutes = require("./routes/assignments");
console.log("type of assignmentRoutes =", typeof assignmentRoutes);

app.use("/assignments", assignmentRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});