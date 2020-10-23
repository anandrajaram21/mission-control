const user = require("./../models/user");

module.exports = {
    checkUser: async function (username) {
        return new Promise((resolve, reject) => {
            user.findOne({username: username}, async function (err, obj) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    if (obj) {
                        console.log(obj);
                        resolve(false);
                    } else {
                        console.log(obj);
                        resolve(true);
                    }
                }
            });
        });
    },
};
