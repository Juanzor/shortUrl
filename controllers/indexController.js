const Url = require("../models/Url");
const controller = {
    leerUrls: async (req, res, next) => {
        try {
            let urls = await Url.find().lean();
            res.render("index", { urls });
        } catch (e) {
            console.log(e);
            res.send("algo fallo");
        }
    },
    agregarUrls: async (req, res, next) => {
        const { origin } = req.body;

        try {
            const url = new Url({ origin });
            await url.save();
            res.redirect("/");
        } catch (e) {
            console.log(e);
            res.send("algo fallo");
        }
    },

    eliminarUrl: async (req, res, next) => {
        try {
            const { id } = req.params;

            await Url.findByIdAndRemove(id);
            res.redirect("/");
        } catch (error) {
            console.log(e);
            res.send("algo fallo");
        }
    },
    editarUrlForm: async (req, res, next) => {
        const { id } = req.params;

        try {
            const url = await Url.findById(id);

            return res.render("editUrl", { url });
        } catch (error) {
            console.log(e);
            res.send("algo fallo");
        }
    },

    editarUrl: async (req, res, next) => {
        const { id } = req.params;
        const { origin } = req.body;

        try {
            await Url.findByIdAndUpdate(id, { origin });
            res.redirect("/");
        } catch (error) {
            console.log(e);
            res.send("algo fallo");
        }
    },
    redirected: async (req, res, next) => {
        const { shortUrl } = req.params;
        try {
            const url = await Url.findOne({ shortUrl }).lean();
            res.redirect(url.origin);
        } catch (error) {
            console.log(error);
            res.send("algo fallo");
        }
    },
};

module.exports = controller;
