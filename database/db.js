const mongoose = require("mongoose");
//mongoose.set("strictQuery", true);

require("dotenv").config();

const dbClient = mongoose
    .connect(process.env.URI)
    .then((m) => {
        console.log(" DB conectada 🚀🚀");
        return m.connection.getClient();
    })
    .catch((e) => console.log(e));

module.exports = dbClient;
