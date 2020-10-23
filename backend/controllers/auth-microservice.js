const bcrypt = require("bcrypt");
const saltRounds = 9;
module.exports = {
    hashPassword: async function (plaintext_password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(plaintext_password, saltRounds, function (
                err,
                hashedPassword
            ) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.debug("Hashed a password: ", hashedPassword);
                    resolve(hashedPassword);
                }
            });
        });
    },

    pass_validate: (plaintext, hashed) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plaintext, hashed, (err, response) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },
};
