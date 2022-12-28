var express = require("express");
var router = express.Router();
const controller = require("../controllers/indexController");
const urlValidator = require("../middlewares/UrlValidator");
const validationUser = require("../middlewares/verificarUser");

router.get("/", validationUser, controller.leerUrls);
router.post("/agregarUrl", validationUser, urlValidator, controller.agregarUrls);
router.delete("/eliminarUrl/:id", validationUser, controller.eliminarUrl);
router.get("/editarUrl/:id", validationUser, controller.editarUrlForm);
router.put("/editarUrl/:id", validationUser, urlValidator, controller.editarUrl);
router.get("/perfil", validationUser,  controller.perfil);
router.post("/perfil", validationUser,  controller.editarPerfil);
router.get("/:shortUrl", controller.redirected);
module.exports = router;
