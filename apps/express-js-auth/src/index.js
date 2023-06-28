const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const path = require("path");
const User = require("./model/user");
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/user-mgmt-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password: plainTextPassword } = req.body;

    // Validate and sanitize user inputs
    if (!username || !plainTextPassword || typeof username !== "string") {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      plainTextPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ status: "ok", access_token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const { username, password: plainTextPassword } = req.body;

    // Validate and sanitize user inputs
    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "Invalid request" });
    }
    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: `Username ${username} already exists` });
    }

    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(process.env.PORT || 3005, function () {
  console.log(`Server running on port ${process.env.PORT || 3005}`);
});
