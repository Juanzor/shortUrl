const { log } = require("console");
const { URL } = require("url");
const urlValidator = (req, res, next) => {
    try {
        const { origin } = req.body;
        const urlFront = new URL(origin);

        if (urlFront !== "null") {
            return next();
        } else {
            throw new Error("Invalid");
        }
    } catch (error) {
        return res.send("URL no valida");
    }
};

module.exports = urlValidator;
