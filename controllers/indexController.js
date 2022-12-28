const Url = require("../models/Url");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const User = require("../models/User");
const controller = {
    leerUrls: async (req, res, next) => {
        try {
            let urls = await Url.find({ user: req.user.id }).lean();
            res.render("index", { urls, mensajes: req.flash("mensajes") });
        } catch (e) {
            console.log(e);
            req.flash("mensajes", [{ msg: e.message }]);
            return res.redirect("/");
        }
    },
    agregarUrls: async (req, res, next) => {
        const { origin } = req.body;

        try {
            const url = new Url({ origin, user: req.user.id });
            await url.save();
            req.flash("mensajes", [{ msg: "Url agregada" }]);
            res.redirect("/");
        } catch (e) {
            console.log(e);
            req.flash("mensajes", [{ msg: e.message }]);
            return res.redirect("/");
        }
    },

    eliminarUrl: async (req, res, next) => {
        try {
            const { id } = req.params;
            const url = await Url.findById(id);

            await url.remove();
            

            req.flash("mensajes", [{ msg: "Url eliminada" }]);

            return res.redirect("/");
        } catch (error) {
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/");
        }
    },
    editarUrlForm: async (req, res, next) => {
        const { id } = req.params;

        try {
            const url = await Url.findById(id);

            return res.render("editUrl", { url });
        } catch (error) {
            console.log(e);
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/");
        }
    },

    editarUrl: async (req, res, next) => {
        const { id } = req.params;
        const { origin } = req.body;

        try {
            await Url.findByIdAndUpdate(id, { origin });
            req.flash("mensajes", [{ msg: "Url editada" }]);
            res.redirect("/");
        } catch (error) {
            console.log(e);
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/");
        }
    },
    redirected: async (req, res, next) => {
        const { shortUrl } = req.params;
        try {
            const url = await Url.findOne({ shortUrl }).lean();
            res.redirect(url.origin);
        } catch (error) {
            console.log(error);
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/");
        }
    },
    perfil: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            res.render("perfil", { mensajes: req.flash("mensajes"), user: req.user, imagen: user.imagen });
        } catch (error) {
            console.log(error);
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/perfil");
        }
    },
    editarPerfil: async (req, res) => {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            const file = files.img;
            try {
                if (err) throw new Error("Fallo subida");

                if (file.originalFileName === "") throw new Error("Agrega una imagen");

                if (file.size > 50 * 1024 * 1024) throw new Error("Tamaño de imagen maximo: 50Mb");

                if (!(file.mimetype == "image/png" || file.mimetype == "image/jpeg"))
                    throw new Error("Extensiones permitidas: JPEG, PNG");

                const extension = file.mimetype.split("/")[1];
                const dirFile = path.join(__dirname, `../public/images/${req.user.id}.${extension}`);

                fs.renameSync(file.filepath, dirFile);

                const image = await Jimp.read(dirFile);
                image.resize(300, 300).quality(90).writeAsync(dirFile);

                const user = await User.findById(req.user.id);
                user.imagen = `${req.user.id}.${extension}`;

                await user.save();

                req.flash("mensajes", [{ msg: "Imagen cargada" }]);
            } catch (error) {
                console.log(error);
                req.flash("mensajes", [{ msg: error.message }]);
            } finally {
                return res.redirect("/perfil");
            }
        });
    },
};

module.exports = controller;
