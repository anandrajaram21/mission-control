module.exports = (app) => {
    app.get("/", async function (req, res) {
        console.debug("Hit the homepage");
        res.json({
            status: 200,
            message: "API service is online",
        });
    });

    app.get("/error", async function (req, res) {
        console.error("Hit the internal error page");
        res.json({
            status: 500,
            message: "internal-error",
        });
    });
};
