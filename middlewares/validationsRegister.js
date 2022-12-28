const { body } = require("express-validator");

const validations = [
    body("userName", "Ingrese nombre valido").trim().notEmpty().escape(),
    body("email", "Ingrese email valido").trim().notEmpty().bail().isEmail().normalizeEmail().escape(),
    body("password", "Ingrese contraseña con minimo 6 caracteres")
        .trim()
        .isLength({ min: 6 })
        .bail()
        .custom((value, { req }) => {
            if (value != req.body.password_confirmation) {
                throw new Error("No coinciden contraseñas");
            } else {
                return value;
            }
        }),
];

module.exports = validations;
