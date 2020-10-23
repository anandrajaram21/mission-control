/*
    IMPORTS
 */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require('./config/logger')
var morgan = require('morgan')
var rfs = require('rotating-file-stream') // version 2.x
const path = require('path')
/*
    INITIALIZATIONS
 */

require("dotenv").config();
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

require("./routes")(app);

/*
    STARTING THE SERVER
 */

app.listen(process.env.PORT || 80, process.env.IP || "0.0.0.0", function (
    req,
    res
) {
    logger.info("Server Started");
});


/*
   CONNECTING TO MONGODB
 */
mongoose
    .connect(process.env.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => logger.info("MongoDB Connected"))
    .catch((err) => console.error(err));
