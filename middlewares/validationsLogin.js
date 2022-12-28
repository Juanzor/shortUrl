const { body } = require("express-validator");

const validations = [
    body("email", "Ingrese email valido").trim().notEmpty().bail().isEmail().normalizeEmail(),
    body("password", "Ingrese contraseña con minimo 6 caracteres").trim().isLength({ min: 6 }),
];

module.exports = validations;
