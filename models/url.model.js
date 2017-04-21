///
/// \file   url.model.js
/// \brief  The database model for our shortened URL.
///

// Import
const Mongoose      = require("mongoose");
const Schema        = Mongoose.Schema;

// Define Schema
const URLSchema     = Schema({
    originalURL: {
        type: String,
        required: [ true, "You must provide a URL to shorten!" ]
    },
    shortenedID: String
});

// Export
module.exports = Mongoose.model("URL", URLSchema);