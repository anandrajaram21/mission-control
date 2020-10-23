const logger = require("./../config/logger")
const registration_service = require("./registration-service")
const account_creation_microservice = require("./account_creation-microservice")
module.exports = {
    register_user: async function(username, password, role, name, grade, section) {
        return new Promise(async function(resolve, reject) {
            // first, we create the "user"
            const response = await registration_service.makeUser(username, password, role)
            if(response) {
                // meaning that we were able to create the user
                // check the roles first
                if (role === 'student') {
                    const account_response = await account_creation_microservice.makeStudentAccount(username, name, grade, section)
                    if(account_response) {
                        // means that the account was successfully crated
                        resolve({
                            "status":true,
                            "object":true
                        })
                    }
                }
                else {
                    // means teacher automatically
                    const account_response = await account_creation_microservice.makeTeacherAccount(username, name, grade, section)
                    if(account_response) {
                        // means that the account was successfully crated
                        resolve({
                            "status":true,
                            "object":true
                        })
                    }
                }
            }
            else {
                // meaning user was not created, so account should not be created
                resolve({
                    "status":"false",
                    "message":"User was not made. Likely because it is conflicted"
                })
            }
        })
    }
}