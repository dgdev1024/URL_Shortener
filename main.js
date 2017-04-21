///
/// \file   main.js
/// \brief  The main entry point of our program.
///

// Imports
const Mongoose = require("mongoose");

// The database URL
const DatabaseURL = process.env.DATABASE_URL;

// Connect to the Database
Mongoose.connect(DatabaseURL);
let db = Mongoose.connection;

// Check for connection errors.
db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

// Run our server once the DB connection goes through.
db.once("open", require("./server"));