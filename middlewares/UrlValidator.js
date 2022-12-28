const { URL } = require("url");
const urlValidator = (req, res, next) => {
    try {
        const { origin } = req.body;
        const urlFront = new URL(origin);

        if (urlFront !== "null") {
            return next();
        } else {
            throw new Error("Ruta invalida");
        }
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

module.exports = urlValidator;
