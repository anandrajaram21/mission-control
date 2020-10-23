/*
    MODELS
 */
const user = require("./../models/user");
const student = require("./../models/student");
const teacher = require("../models/teacher");

/*
    SERVICES
 */
const login_microservice = require("./../controllers/login-microservice")
const registration_microservice = require("./../controllers/registration-microservice")
const logger = require("./../config/logger")

module.exports = (app) => {
    app.post("/login", async function (req, res) {
        logger.info(`Reached Login Method. Request is: ${req.body} `)
        logger.debug(`Credentials sent are: Username: ${req.body.username} and Password ${req.body.password}`)
        const response = await login_microservice.authenticate(req.body.username, req.body.password)
        if(response["status"]) {
            res.status(200).json({
                "message":"Successful",
                "token":response["token"]
            })
        }
        else {
            res.status(403).json({
                "message":response["message"]
            })
        }
    }),
        app.post("/register", async function (req, res) {
            logger.debug(`The username is ${req.body.username} password is ${req.body.password} name is ${req.body.name} class is ${req.body.grade} section is ${req.body.section}`)
            logger.debug(`Type of grade is ${typeof req.body.grade}`)
            const grade_convert = parseInt(req.body.grade, Number)
            logger.debug(`Type of grade is ${typeof grade_convert}`)
            const response = await registration_microservice.register_user(req.body.username, req.body.password, req.body.role, req.body.name, req.body.grade, req.body.section)
            if(response["status"]) {
                logger.info("Created a user")
                res.status(200).json({
                    "message":"Created user successfully"
                })
            }
            else {
                logger.error(response["message"])
                res.status(500).json({
                    "message":"did not create user"
                })
            }
        });
};
