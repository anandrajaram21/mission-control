module.exports = (app) => {
    //unprotected routes

    require("./routes/core")(app); // core routes, such as alive or not.
    require("./routes/auth")(app); // authentication routes
    require("./routes/dashboards")(app); // dashboard routes
    require("./routes/interactTeacher")(app); // interaction routes
    require("./routes/assignment-interaction")(app); // assignment routes
    require("./routes/data-valut")(app); // vault
};
