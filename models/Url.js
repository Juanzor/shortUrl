const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const { Schema } = mongoose;

const urlSchema = new Schema({
    origin: {
        type: String,
        unique: true,
        required: true,
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true,
        default: () => nanoid(6),
    },
});
// Primer parametro define el alias, segundo el esquema
const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
