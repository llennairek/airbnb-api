const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

const app = express();
app.use(formidable());

app.use("/user", userRoutes);

mongoose.connect("mongodb://localhost/airbnb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
db = mongoose.connection;
db.on("error", (error) => {
  console.log({ errorDB: error });
});
db.once("open", () => {
  console.log("Connected to the AirBNB database");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen("3000", () => {
  console.log("Server started");
});
