const auth = require("./../controllers/authorization-microservice");
const getStudents = require("./../controllers/student_retrieve-microservice");
const ptsService = require("./../controllers/points_control-microservice");
const logger = require("./../config/logger")
module.exports = (app) => {
    app.get("/api/interaction/getStudents", async (req, res) => {
        // this route, if the teacher is authenticated, gets all the students for the particular class
        // first, we check if the teacher is authorized to access this route this way
        logger.debug("Called GetStudents route")
        logger.debug("header: ", req.headers.authorization)
        const authenticated = await auth.authoriseTeacher(
            req.headers.authorization
        );
        logger.debug(`We are now: ${authenticated}`)
        if (authenticated !== false) {
            logger.debug("We are now authorized to access the getStudents Function")
            // now this means that our user is authorized to access this function
            // let us get her the students of her class!
            const studs = await getStudents.getStudents(
                authenticated["grade"],
                authenticated["section"]
            );
            if (studs !== false) {
                res.status(200).json({
                    object: studs,
                });
            }
        } else {
            res.status(403).json({
                message: "This JWT is invalid / user is not authenticated.",
            });
        }
    });

    app.post("/api/interaction/addPoints", async (req, res) => {
        // this route is used to add points to students
        const authenticated = await auth.authoriseTeacher(req.headers.authorization);
        logger.debug("header: ", req.headers.authorization)
        logger.debug(`student_id, ${req.body.student_id}`)
        logger.debug(`authenticated or not:, ${authenticated}`)
        if (authenticated !== false) {
            // it means that we are authenticated successfully
            // we need to have the student's email id sent to us, to process this request, quite simply
            if (
                req.body.student_id !== null &&
                req.body.student_id !== "" &&
                req.body.student_id !== undefined
            ) {
                logger.debug(` Giving points to ${req.body.student_id}`);
                // now that means we have the student id defined as well, and that we can just increase points
                const response = await ptsService.addPoints(req.body.student_id);
                if (response) {
                    res.status(200).json({
                        message: "Successfully Incremented Points",
                    });
                } else {
                    res.status(500).json({
                        message:
                            "Either the student does not exist, or something else went wrong",
                    });
                }
            } else {
                res.status(403).json({
                    message: "No Student ID supplied",
                });
            }
        } else {
            res.status(403).json({
                message: "Teacher is not authenticated",
            });
        }
    });
};
