const jwms = require("./jwt-microservice");
const logger = require("./../config/logger")
module.exports = {
  authoriseTeacher: async (token) => {
    return new Promise(async (resolve, reject) => {
      const teach = await jwms.total_verification(token);
      if (teach !== false && teach["role"] === "teacher") {
        logger.debug(`Successfully logged in ${teach}`)
        resolve(teach);
      } else {
        resolve(false);
      }
    })
  },

  authoriseStudent: async (token) => {
    return new Promise(async (resolve, reject) => {
      const stud = await jwms.total_verification(token);
      if (stud !== false && stud["role"] === "student") {
        logger.debug(`Successfully logged in ${stud}`)
        resolve (stud);
      } else {
        resolve(false);
      }
    })
  },
};
