// This file is initializing the mongodb connection
// and exporting it for use in all other files through the module.exports
const mongoose = require("mongoose");
const databaseURL = "mongodb://0.0.0.0:27017/";

const options = { useNewUrlParser: true, useUnifiedTopology: true };
// useFindAndModify: false };

mongoose.connect(databaseURL, options);

module.exports = mongoose;
