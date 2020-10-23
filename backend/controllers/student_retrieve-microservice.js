const student = require("./../models/student");
const logger = require("./../config/logger")
module.exports = {
    getStudents: async (classattend, section) => {
        return new Promise(async (resolve, reject) => {
            student.find(
                {student_class: classattend, student_section: section},
                async (err, obj) => {
                    if (err) {
                        logger.error(err);
                        resolve(false);
                    } else {
                        logger.debug(obj);
                        resolve(obj);
                    }
                }
            );
        });
    },
};
