// Server file

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const db = require("./config/db");
const port = process.env.PORT || 3000;

app.use(express.json());

// routes

app.listen(port, () => console.log(`Node JS server listening on port ${port}`));
