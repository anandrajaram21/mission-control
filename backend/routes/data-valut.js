const student = require('./../models/student')
const logger = require("./../config/logger")
const assignment = require("./../models/assingment")
module.exports = function (app) {

    app.get('/api/vault', async function(req, res) {
        logger.info("Accessing the Vault")
        student.find({}, async function (err, obj) {
            if (err) {
                logger.error(err)
            }
            else {
                logger.debug(`Successfully got all student data`)
                // now let us get assignment data as well
                assignment.find({}, async function(err2, obj2) {
                    if (err2) {
                        logger.error(err)
                    }
                    else {
                        logger.debug(`Successfully got all assignment data`)
                        res.status(200).json({
                            "student_data":obj,
                            "assignment_data":obj2
                        })
                    }
                })
            }
        })
    })
}