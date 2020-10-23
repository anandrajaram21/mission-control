const logger = require("./../config/logger")

/*
    MODELS
 */
const user = require("./../models/user");
const student = require("./../models/student");
const teacher = require("../models/teacher");

/*
    SERVICES
 */
const token_microservice = require("./../controllers/jwt-microservice");
const password_module = require("../controllers/auth-microservice");
const registration_microservice = require("./../controllers/registration-service");
const account_creation_microservice = require("./../controllers/account_creation-microservice");



module.exports = {
    authenticate: function (username, password) {
        return new Promise(async function(resolve, reject) {
            logger.debug("Reached the Authentication System")
            user.findOne({username:username}, async function(err, obj) {
                if (err) {
                    logger.error(err)
                    resolve({
                        "status":false,
                        "message":"Internal Error"
                    })
                }
                else {
                    logger.debug(`Successfully got: ${obj} while finding user`)
                    if (obj !== undefined && obj !== null) {
                        const response_from_validation = await password_module.pass_validate(password, obj["password"])
                        logger.debug(response_from_validation)
                        if (response_from_validation) {
                            // now we check if it is a student or a teacher
                            if (obj["role"] === 'student') {
                                student.findOne({emailID: username}, {
                                    student_name: 1,
                                    student_class: 1,
                                    student_section: 1
                                }, async function (err2, obj2) {
                                    if (err2) {
                                        logger.error(err)
                                        resolve({
                                            "status": false,
                                            "message":"Internal Error"
                                        })
                                    } else {
                                        logger.debug(`Successfully got: ${obj2} while finding student`)
                                        const token = token_microservice.signing(username, 'student', obj2["student_name"], obj2["student_class"], obj2["student_section"])
                                        resolve({
                                            "status": true,
                                            "token": token
                                        })
                                    }
                                })
                            } else {
                                // if not student, then obviously teacher
                                teacher.findOne({emailID: username}, {}, async function (err2, obj2) {
                                    if (err2) {
                                        logger.error(err)
                                        resolve({
                                            "status": false,
                                            "message":"Internal Error"
                                        })
                                    } else {
                                        logger.debug(`Successfully got: ${obj2} in teacher finding`)
                                        const token = token_microservice.signing(username, 'teacher', obj2["teacher_name"], obj2["teacher_class"], obj2["teacher_section"])
                                        resolve({
                                            "status": true,
                                            "token": token
                                        })
                                    }
                                })
                            }
                        } else {
                            resolve({
                                "status": false,
                                "message":"Wrong Password"
                            })
                        }
                    } else {
                        logger.debug("The user was not found")
                        resolve({
                            "status":false,
                            "message":"User not found"
                        })
                    }
                }
            })
        })
    }
}