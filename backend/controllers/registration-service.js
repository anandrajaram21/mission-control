const user = require("./../models/user");
const hashing = require("./auth-microservice");
const conflict = require("./conflict_check-microservice");
module.exports = {
    makeUser: async function (username, password, role) {
        return new Promise(async (resolve, reject) => {
            // then check if the user already exists using a function
            const isExisting = await conflict.checkUser(username);
            if (isExisting) {
                // if the function returns true, hash the password, and create the user
                const hashedPassword = await hashing.hashPassword(password);
                const newUser = new user({
                    username: username,
                    password: hashedPassword,
                    role: role,
                });
                // save the user in mongoDB
                newUser.save(function (err, obj) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        console.debug(obj);
                        resolve(obj);
                    }
                });
            } else {
                // if the function returns false, it means that the user already exists.
                // resolve false here
                resolve(false);
            }
        });
    },
};
