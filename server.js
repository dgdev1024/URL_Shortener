///
/// \file   server.js
/// \brief  The Express server functionality.
///

// Imports
const Path          = require("path");
const Mongoose      = require("mongoose");
const Express       = require("express");
const BodyParser    = require("body-parser");
const URLController = require("./controllers/url.controller");

// Export
module.exports = () => {
    URLController.initialize((err, data) => {
        if (err) {
            console.error(err);
        }

        console.log(`Shortened URLs in Database: ${data}.`);
    });

    // Express
    const App = Express();

    // Body Parser Middleware
    App.use(BodyParser.json());
    App.use(BodyParser.urlencoded({ extended: true }));

    // Static Files
    App.use(Express.static(Path.join(__dirname, "public")));

    // Index Routing
    App.use("/", require("./routes/index"));

    // Listen
    const Port = process.env.PORT || 3000;
    const Server = App.listen(Port, () => {
        console.log(`Listening on Port ${Port}...`);
    });
};