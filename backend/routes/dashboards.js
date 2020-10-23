const dashboardMicroservice = require("../controllers/dashboard-microservice");

const service = require("./../controllers/dashboard-microservice");
module.exports = (app) => {
    app.get("/api/dashboard/teacher", async function (req, res) {
        // from the token, we need to get the email, do not know how the token will be sent back, so hard to predict
        // will just be assuming var now
        var email = "";
        var data = await service.getTeacherDashboard(email);
        if (data !== false) {
            // meaning, the email was found
            res.json({
                status: 200,
                data: data,
            });
        }
        console.debug("Hit the teacher dashboard");
    });

    app.get("/api/dashboard/student", async function (req, res) {
        // from the token, we need to get the email, do not know how the token will be sent back, so hard to predict
        // will just be assuming var now
        var email = "";
        var data = await service.getStudentDashboard(email);
        if (data !== false) {
            // meaning, the email was found
            res.json({
                status: 200,
                data: data,
            });
        }
        console.debug("Hit the student dashboard");
    });

    app.get("/api/dashboard/admin", async function (req, res) {
        // from the token, we need to get the email, do not know how the token will be sent back, so hard to predict
        // will just be assuming var now
        var email = "";
        var data = await service.getAdminDashboard(email);
        if (data !== false) {
            // meaning, the email was found
            res.json({
                status: 200,
                data: data,
            });
        }
        console.debug("Hit the admin dashboard");
    });
};
