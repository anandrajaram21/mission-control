const auth = require("../controllers/authorization-microservice");
const asms = require("./../controllers/assignment-microservice");
const ptms = require("./../controllers/points_control-microservice");
const logger = require("./../config/logger")
module.exports = (app) => {
    /*
    Gets all the assignments due for the given student.
    */

    app.get("/api/student/assignment/getAssignments", async (req, res) => {
        logger.info("Called GetAssignments route")
        logger.debug("header: ", req.headers.authorization)
        const authenticated = await auth.authoriseStudent(
            req.headers.authorization
        );

        if (authenticated !== false) {
            const resp = await asms.getAssignments(
                authenticated["grade"],
                authenticated["section"]
            );
            if (resp !== false) {
                logger.debug(resp)
                res.status(200).json({
                    object: resp,
                });
            } else {
                res.status(500).json({
                    message: "Something went wrong",
                });
            }
        } else {
            res.status(403).json({
                message: "No Auth",
            });
        }
    });
    /*
    Allows a student to submit a particular assignment
    */
    app.post("/api/student/assignment/submitAssignment", async (req, res) => {
        logger.info("Called Submit Assignment route")
        logger.debug(`header: , ${req.headers.authorization}`)
        logger.debug(`assignment link: , ${req.body.assignmentLink}`)
        logger.debug(`assignment ID: ", ${req.body.assignmentID}`)


        const authenticated = await auth.authoriseStudent(
            req.headers.authorization
        );

        if (authenticated !== false) {
            logger.debug("Authenticated as ", authenticated["username"])
            const resp = await asms.uploadAssignemnt(
                req.body.assignmentLink,
                authenticated["username"],
                req.body.assignmentID
            );
            if (resp) {
                // means that the upload was successful
                res.status(200).json({
                    message: "Uploaded Successfully",
                });
            } else {
                res.status(500).json({
                    message: "Was not able to upload it",
                });
            }
        } else {
            res.status(403).json({
                message: "No Auth",
            });
        }
    });

    app.post("/api/assignments/student/requestExtension", async (req, res) => {
        const authenticated = await auth.authoriseStudent(
            req.headers.authorization
        );

        if (
            authenticated !== false
        ) {
            const resp = await asms.requestExtension(
                authenticated["username"],
                req.body.assignmentID,
                req.body.duration
            );
            if (resp) {
                res.status(200).json({
                    message: "Purchased Extension",
                });
            } else {
                res.status(500).json({
                    message: "Not Enough Points / Cannot Stack",
                });
            }
        } else {
            res.staus(403).json({
                message: "No Auth",
            });
        }
    });

    app.get("/api/assignments/teacher/getAssignments", async (req, res) => {
        logger.info("Called Teacher Get Assignments route")
        logger.debug("header: ", req.headers.authorization)
        const authenticated = await auth.authoriseTeacher(
            req.headers.authorization
        );

        if (authenticated !== false) {
            const resp = await asms.getAssignmentsTeacher(
                authenticated["grade"],
                authenticated["section"]
            );
            if (resp !== false) {
                res.status(200).json({
                    object: resp,
                });
            } else {
                res.status(500).json({
                    message: "Something went wrong",
                });
            }
        } else {
            res.status(403).json({
                message: "No Auth",
            });
        }
    });

    app.post("/api/assignments/teacher/makeAssignment", async (req, res) => {
        logger.info("Called Teacher make assignment route")
        logger.debug("header: ", req.headers.authorization)
        const authenticated = await auth.authoriseTeacher(
            req.headers.authorization
        );

        console.log(req.headers.authorization)

        if (
            authenticated !== false
        ) {
            //means we are authorized by this point, so
            console.debug("Authenticated")
            logger.debug(`Type of date is is ${typeof req.body.dueDate}`)
            const date_convert = parseInt(req.body.dueDate, Number)
            logger.debug(`Type of date is ${typeof date_convert}`)
            logger.debug(date_convert)
            const response = await asms.makeAssignment(
                authenticated["grade"],
                authenticated["section"],
                authenticated["username"],
                authenticated["name"],
                date_convert,
                req.body.assignmentName,
                req.body.assignmentLink
            );

            if (response) {
                res.status(200).json({
                    message: "Successfully Created Assignment",
                });
            } else {
                res.status(500).json({
                    message: "failed to create assignment",
                });
            }
        } else {
            res.status(403).json({
                message:
                    "Either Auth Failed, or you failed to supply the required parameters",
            });
        }
    });

    app.post("/api/assignment/teacher/uploadCorrection", async (req, res) => {
        logger.info("Called Teacher upload correction route")
        logger.debug("header: ", req.headers.authorization)
        const authenticated = await auth.authoriseTeacher(
            req.headers.authorization
        );
        logger.debug(`Auth is ${authenticated}`)
        if (authenticated !== false) {
            const resp = await asms.uploadCorrection(
                req.body.correctionLink,
                req.body.studentID,
                req.body.assignmentID,
                req.body.remarks
            );
            if (resp) {
                logger.debug(`Sending out network request with 200`)
                res.status(200).json({
                    message: "Uploaded Correction Successfully",
                });
            } else {
                logger.debug(`Network request failed. 500 being sent out`)
                res.status(500).json({
                    message: "Something went wrong",
                });
            }
        } else {
            res.status(403).json({
                message:
                    "Either Auth Failed, or you failed to supply the required parameters",
            });
        }
    });

    app.get("/api/student/getPoints", async (req, res) => {
        const authenticated = await auth.authoriseStudent(
            req.headers.authorization
        );
        if (authenticated !== false) {
            const resp = await ptms.sendPoints(authenticated["username"]);
            if (resp) {
                res.status(200).json({ points: resp["totalInteractionPoints"], multiplier: resp["InteractionData"]["multiplier"] });
            } else {
                res.status(500).send("No");
            }
        }
    });
};
