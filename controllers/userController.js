const User = require("../models/User");
const { nanoid } = require("nanoid");

const controller = {
    loginForm: (req, res) => {
        res.render("login");
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) throw new Error("User not found");

            if (!user.cuentaConfirmada) throw new Error("Cuenta no confirmada");

            if (!(await user.comparePassword(password))) throw new Error("Contraseña incorrecta");

            res.redirect("/");
        } catch (error) {
            res.json({ error: error.message });
            console.log(error);
        }
    },
    registerForm: (req, res) => {
        res.render("register");
    },
    register: async (req, res) => {
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
            res.redirect("/user/login");
        } catch (error) {
            console.log(error);
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

            res.redirect("/user/login");
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = controller;
