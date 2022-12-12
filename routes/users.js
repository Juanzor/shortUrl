var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

router.get("/login", userController.loginForm);
router.post("/login", userController.login);
router.get("/register", userController.registerForm);
router.get("/confirmar/:tokenConfirm", userController.confirmarCuenta);
router.post("/register", userController.register);

module.exports = router;
