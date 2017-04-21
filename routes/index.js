///
/// \file   index.js
/// \brief  Routing for our index page.
///

// Imports
const Express       = require("express");
const URLController = require("../controllers/url.controller");
const Router        = Express.Router();

// Home Route
Router.get("/", (req, res) => {
    res.sendFile("index.html");
});

//
// This route takes a URL as a parameter, maps it to a unique ID and
// adds it to the database.
//
Router.get("/shorten/*", (req, res) => {
    // Get the first wildcard parameter submitted to the user.
    const param = req.params[0];

    URLController.create(param, (err, data) => {
        if (err) {
            // Let the user know what went wrong.
            req.json({ error: err });
        } else {
            // If the item is successfully added, show the URL and its
            // new ID in a JSON response.
            res.json({
                originalURL: data.originalURL,
                shortenedID: data.shortenedID
            });
        }
    });
});

//
// This route allows the user to check where a shortened link will take
// them. This will allow them to determine whether or not the destination
// is safe.
//
Router.get("/check/:id", (req, res) => {    
    URLController.read(req.params.id, (err, data) => {
        if (err) {
            // Let the user know what went wrong.
            res.json({ error: err });
        } else {
            // Show the user the ID and the actual URL in a JSON response.
            res.json({
                originalURL: data.originalURL,
                shortenedID: data.shortenedID
            });
        }
    });
});

//
// This route takes a shortened ID as a parameter, attempts to find
// a URL associated with the ID in the database, then, if successful,
// redirects the user to the page in question.
//
Router.get("/:id", (req, res) => {
    URLController.read(req.params.id, (err, data) => {
        if (err) {
            // Let the user know what went wrong.
            res.json({ error: err });
        } else {
            // Redirect the user to the URL.
            res.redirect(data.originalURL);
        }
    });
});

module.exports = Router;