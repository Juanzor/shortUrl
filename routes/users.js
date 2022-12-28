var express = require("express");
var router = express.Router();
const validationsRegister = require("../middlewares/validationsRegister");
const validationsLogin = require("../middlewares/validationsLogin");
const userController = require("../controllers/userController");

router.get("/login",userController.loginForm);
router.post("/login", validationsLogin, userController.login);
router.get("/register", userController.registerForm);
router.post("/register", validationsRegister, userController.register);
router.get("/confirmar/:tokenConfirm", userController.confirmarCuenta);
router.get("/logout", userController.logout);

module.exports = router;
