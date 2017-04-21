///
/// \file   url.controller.js
/// \brief  Controller functions for our URL database models.
///

// Imports
const Mongoose      = require("mongoose");
const URLModel      = require("../models/url.model");

// Constants for our encodings.
const Alphabet      = "0123456789abcdefghijklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const Base          = Alphabet.length;

// The number of URLs in our DB.
let   URLCount      = 10000;

///
/// \fn     encode
/// \brief  Encodes the given number into our custom base.
///
/// \param  num         The number to be encoded.
///
/// \return The encoded string.
///
/// \see    Alphabet
///
function encode (num) {
    // Store our result in this string.
    let encoded = "";

    // Encode the string.
    while (num) {
        let remainder = num % Base;
        num = Math.floor(num / Base);
        encoded = Alphabet[remainder].toString() + encoded;
    }

    return encoded;
}

///
/// \fn     isURL
/// \brief  Checks to see if the string given is a valid URL.
///
/// \param  str         The string to be checked.
///
/// \return True if the string is a valid URL.
///
function isURL (str) {
    var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    var url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
}

// Export Functions
module.exports = {
    ///
    /// \fn     initialize
    /// \brief  Initializes the URL controller.
    ///
    /// This function queries the database, once connected, and
    /// fetches the number of documents therein. The URLCount variable
    /// is updated as appropriate.
    ///
    /// The callback function passed in takes two arguments, the error if
    /// one should occur (err will be null if there is no error) and the
    /// number of documents if this function is successful.
    ///
    /// \param  callback        The callback function to be called.
    ///
    initialize: (callback) => {
        URLModel.count({}, (err, data) => {
            if (err) {
                callback(err);
            }

            URLCount += data;
            callback(null, data);
        });
    },

    ///
    /// \fn     create
    /// \brief  Maps the given URL to a short ID and adds it to the database.
    ///
    /// As above, this function also takes a callback function that is called
    /// when the function is complete.
    ///
    /// \param  url             The URL to be shortened.
    /// \param  callback        The callback function to be called.
    ///
    create: (url, callback) => {
        if (isURL(url) === false) {
            callback(`${url} is not a valid URL.`);
        } else {
            URLModel.create({
                originalURL: url,
                shortenedID: encode(++URLCount)
            }, (err, document) => {
                if (err) {
                    callback(err);
                }

                callback(null, document);
            });
        }
    },

    ///
    /// \fn     read
    /// \brief  Fetches a URL mapped to the given ID.
    ///
    /// The URL will be passed into the callback function passed in.
    ///
    /// \param  id              The short ID to be queried.
    /// \param  callback        The callback function to be called.
    ///
    read: (id, callback) => {
        URLModel.findOne({ shortenedID: id }, (err, data) => {
            if (err) {
                callback(err);
            }
            
            if (data) {
                callback(null, data);
            } else {
                callback(`Short URL Not Found: ${id}`);
            }
        });
    }
}