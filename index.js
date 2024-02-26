require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI;
const JWT_SECRETE = process.env.JWT_SECRETE;
const PORT = process.env.PORT;
const users = require("./userModel");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// db connection
mongoose
  .connect(DB_URI)
  .then((res) => console.log("Db is connected"))
  .catch((err) => console.loog(err));

// api
app.get("/", (req, res) => {
  res.status(200).json("Working");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      res.status(404).json("User already exist please Login");
    } else {
      const newUser = new users({
        email,
        password,
      });
      await newUser.save();
      const token = jwt.sign({ email }, JWT_SECRETE);
      res.status(201).json({ newUser, token });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await users.findOne({ email });
    if (user) {
      if (user.password === password) {
        const token = jwt.sign({ email }, JWT_SECRETE);
        let admin = false;
        if (email === "admin@email.com") {
          admin = true;
        }
        res.status(200).json({ user, token, admin });
      } else {
        res.status(404).json("Invalid credentials");
      }
    } else {
      res.status(404).json("Invalid credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.listen(PORT, () => {
  console.log("Server is running.");
});
