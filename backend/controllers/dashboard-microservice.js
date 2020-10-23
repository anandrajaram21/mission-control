const student = require("./../models/student");
const teacher = require("./../models/teacher");

module.exports = {
    getTeacherDashboard: async function (email) {
        return new Promise(async (resolve, reject) => {
            teacher.findOne({emailID: email}, (err, obj) => {
                if (err) {
                    console.error(err);
                    resolve(false);
                } else {
                    if (obj) {
                        console.debug(obj);
                        resolve(obj);
                    } else {
                        console.debug(obj);
                        resolve(false);
                    }
                }
            });
        });
    },

    getStudentDashboard: async function (email) {
        return new Promise(async (resolve, reject) => {
            student.findOne({emailID: email}, (err, obj) => {
                if (err) {
                    console.error(err);
                    resolve(false);
                } else {
                    if (obj) {
                        console.debug(obj);
                        resolve(obj);
                    } else {
                        console.debug(obj);
                        resolve(false);
                    }
                }
            });
        });
    },

    getAdminDashboard: async function (email) {
        return new Promise(async (resolve, reject) => {
            admin.findOne({emailID: email}, (err, obj) => {
                if (err) {
                    console.error(err);
                    resolve(false);
                } else {
                    if (obj) {
                        console.debug(obj);
                        resolve(obj);
                    } else {
                        console.debug(obj);
                        resolve(false);
                    }
                }
            });
        });
    },
};
