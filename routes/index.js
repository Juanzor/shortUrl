var express = require("express");
var router = express.Router();
const controller = require("../controllers/indexController");
const urlValidator = require("../middlewares/UrlValidator");

router.get("/", controller.leerUrls);
router.post("/agregarUrl", urlValidator, controller.agregarUrls);

router.delete("/eliminarUrl/:id", controller.eliminarUrl);

router.get("/editarUrl/:id", controller.editarUrlForm);
router.put("/editarUrl/:id", urlValidator, controller.editarUrl);
router.get("/:shortUrl", controller.redirected);
module.exports = router;
