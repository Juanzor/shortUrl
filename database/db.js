const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
mongoose
    .connect(process.env.URI)
    .then(() => console.log("   DB conectada 🚀🚀"))
    .catch((e) => console.log(e));
        
    
