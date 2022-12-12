const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcryptjs = require("bcryptjs");

const userSchema = new Schema({
    userName: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    tokenConfirm: { type: String, default: null },
    cuentaConfirmada: { type: Boolean, default: false },
});

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    try {
        user.password = await bcryptjs.hash(user.password, 10);
    } catch (error) {
        console.log(error);
        next();
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
