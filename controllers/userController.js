const User = require("../models/User");
const { validationResult } = require("express-validator");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
require("dotenv").config();

const controller = {
    loginForm: (req, res) => {
        return res.render("login", { mensajes: req.flash("mensajes") });
    },

    login: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash("mensajes", errors.array());
            return res.redirect("/user/login");
        }

        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });

            if (!user) throw new Error("No existe ese email");

            if (!user.cuentaConfirmada) throw new Error("Cuenta no confirmada");

            if (!(await user.comparePassword(password))) throw new Error("Contraseña incorrecta");
            req.login(user, (err) => {
                if (err) throw new Error("Super error");

                return res.redirect("/");
            });
        } catch (error) {
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/user/login");
        }
    },
    registerForm: (req, res) => {
        res.render("register", { mensajes: req.flash("mensajes") });
    },
    register: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash("mensajes", errors.array());
            return res.redirect("/user/register");
        }

        const { userName, password, email } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) throw new Error("User already exists");

            user = new User({
                userName,
                password,
                email,
                tokenConfirm: nanoid(),
            });

            await user.save();

            const transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: process.env.USEREMAIL,
                    pass: process.env.PASSEMAIL,
                },
            });

            await transport.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: user.email, // list of receivers
                subject: "Verifica tu cuenta ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<a href= "${process.env.PATHEROKU || 'http://localhost:3000'}/user/confirmar/${
                    user.tokenConfirm
                }">Verifica tu cuenta</a>`, // html body
            });

            req.flash("mensajes", [{ msg: "Revisa tu correo electronico y valida tu cuenta" }]);
            return res.redirect("/user/login");
        } catch (error) {
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/user/register");
        }
    },
    confirmarCuenta: async (req, res) => {
        const { tokenConfirm } = req.params;

        try {
            const user = await User.findOne({ tokenConfirm });

            if (!user) throw new Error("User not found");

            user.tokenConfirm = null;
            user.cuentaConfirmada = true;

            await user.save();
            req.flash("mensajes", [{ msg: "Cuenta verificada" }]);

            return res.redirect("/user/login");
        } catch (error) {
            req.flash("mensajes", [{ msg: error.message }]);
            res.redirect("/user/login");
        }
    },
    logout: (req, res) => {
        req.logout(() => res.redirect("/user/login"));
    },
};

module.exports = controller;
