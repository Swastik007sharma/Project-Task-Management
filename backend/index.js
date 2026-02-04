const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// Routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Connect to MongoDB and start the server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
