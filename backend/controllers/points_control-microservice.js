const student = require("./../models/student");
const logger = require("./../config/logger")
module.exports = {
    addPoints: async (studentid) => {
        return new Promise(async (resolve, reject) => {
            student.findOne({ emailID: studentid }, async (err, obj) => {
                if (err) {
                    logger.error(err);
                    resolve(false);
                } else {
                    if (obj !== {} && obj !== null) {
                        var multiplier = false;
                        var current_date = new Date().getTime()
                        // we check, if the last interaction is older than a day, but not older than 2 days
                        // if it is, we switch on the multiplier. if its older than 2 days, your multiplier is switched off!
                        if (current_date - obj.InteractionData.interactionArray[-1] <= 172800 && current_date - obj.InteractionData.interactionArray[-1] >= 86400) {
                            // means that the multiplier is on
                            multiplier = true;
                        } else {
                            multiplier = false;
                        }
                        if (multiplier) {
                            obj.totalInteractionPoints = obj.totalInteractionPoints + 4;
                        } else {
                            obj.totalInteractionPoints = obj.totalInteractionPoints + 2;
                        }
                        logger.debug(obj);
                        obj.InteractionData.interactionArray.push(new Date().getTime())
                        obj.InteractionData.rawPoints = obj.InteractionData.rawPoints + 1;
                        obj.InteractionData.multiplier = multiplier
                        logger.debug(obj);
                        student.updateOne(
                            { emailID: studentid },
                            {
                                totalInteractionPoints: obj["totalInteractionPoints"],
                                InteractionData: obj.InteractionData
                            },
                            async (err2, obj2) => {
                                if (err2) {
                                    logger.error(err);
                                    resolve(false);
                                } else {
                                    logger.debug(obj2);
                                    resolve(true);
                                }
                            }
                        );
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    },

    sendPoints: async (studentid) => {
        return new Promise(async (resolve, reject) => {
            student.findOne(
                { emailID: studentid },
                { totalInteractionPoints: 1, InteractionData: 1 },
                async (err, obj) => {
                    if (err) {
                        console.error(err);
                    } else {
                        resolve(obj);
                    }
                }
            );
        });
    },
};
