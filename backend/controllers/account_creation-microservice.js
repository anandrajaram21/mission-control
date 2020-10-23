const teacher = require("./../models/teacher");
const student = require("./../models/student");

module.exports = {
    makeTeacherAccount: async function (email, name, class_handled, section) {
        return new Promise(async (resolve, reject) => {
            // if the function returns true, hash the password, and create the user
            const newTeacher = new teacher({
                emailID: email,
                teacher_name: name,
                teacher_class: class_handled,
                teacher_section: section,
            });
            // save the user in mongoDB
            newTeacher.save(function (err, obj) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.debug(obj);
                    resolve(true);
                }
            });
        });
    },

    makeStudentAccount: async function (email, name, classattend, section) {
        return new Promise(async (resolve, reject) => {
            // if the function returns true, hash the password, and create the user
            const newStudent = new student({
                emailID: email,
                student_name: name,
                student_class: classattend,
                student_section: section,
            });
            // save the user in mongoDB
            newStudent.save(function (err, obj) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.debug(obj);
                    resolve(true);
                }
            });
        });
    },
};
