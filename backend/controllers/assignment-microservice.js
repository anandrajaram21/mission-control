const assignment = require("./../models/assingment");
const student = require("./../models/student");
const logger = require("./../config/logger")

async function getStudentName(studentID) {
    return new Promise(async function (resolve, reject) {
        student.findOne({ emailID: studentID }, { student_name: 1 }, async function (err, obj) {
            if (err) {
                logger.error(err)
                resolve(null)
            } else {
                logger.debug(`Successfully got: ${obj} for the student name finder function`)
                resolve(obj.student_name)
            }
        })
    })
}


module.exports = {
    makeAssignment: async (
        class_assigned,
        section,
        teacher_assigned,
        teacher_name,
        dueDate,
        assignmentName,
        assignmentLink
    ) => {
        return new Promise(async (resolve, reject) => {
            logger.debug("called the make Assignments internal function")
            const newAssignment = new assignment({
                assignment_data: {
                    class_assigned: class_assigned,
                    section: section,
                    teacher_assigned_by: teacher_assigned,
                    teacher_name: teacher_name,
                    dueDate: dueDate,
                    assignmentName: assignmentName,
                    assignmentLink: assignmentLink,
                }
            });
            newAssignment.save((err, obj) => {
                if (err) {
                    logger.error(err)
                    resolve(false);
                } else {
                    logger.info(`made assignment ${obj}`)
                    resolve(true);
                }
            });
        });
    },

    getAssignments: async (student_class, student_section) => {
        return new Promise(async (resolve, reject) => {
            assignment.find(
                {
                    "assignment_data.class_assigned": student_class,
                    "assignment_data.section": student_section,
                    "assignment_data.open": true
                },
                async (err, obj) => {
                    if (err) {
                        logger.error(err);
                        resolve(false);
                    } else {
                        logger.debug("Student Assignments Object is ", obj)
                        resolve(obj);
                    }
                }
            );
        });
    },

    getAssignmentsTeacher: async (teacher_class, teacher_section) => {
        return new Promise(async function (resolve, reject) {
            assignment.find({
                "assignment_data.class_assigned": teacher_class,
                "assignment_data.section": teacher_section
            }, async function (err, obj) {
                if (err) {
                    logger.error(err)
                    resolve(false)
                } else {
                    logger.debug(`Successfully got: ${obj}`)
                    // as of here, we retrieve all the objects from the DB. we need to send this data to the frontend is all.
                    resolve(obj)
                }
            })
        })
    },

    requestExtension: async (student_id, assignment_id, duration) => {
        logger.debug(`Got Request for Extension: ${student_id}, ${assignment_id}, ${duration}`)
        return new Promise(async (resolve, reject) => {
            // first find the assignment, and check whether the student has already requested an extension
            assignment.findById({ _id: assignment_id }, async function (err, obj) {
                if (err) {
                    logger.error(err)
                    resolve({
                        "status": false,
                        "message": "mongo"
                    })
                } else {
                    if (obj !== null) {
                        logger.debug(`Successfully got: ${obj}`)
                        // at this point, we found the assignment, we need to still check if the student has already
                        // asked for an extension
                        for (let i = 0; i < obj.student_based_data.extensionPurchasedBy.length; i++) {
                            // we'll loop through and check if they have already purchased extension
                            if (obj.student_based_data.extensionPurchasedBy[i].student_email === student_id) {
                                resolve(false)
                                return
                            }
                        }
                        // if we reach here, we did not find them in the list of students, so let us check if they
                        // have enough points first.
                        student.findOne({ emailID: student_id }, async (err2, obj2) => {
                            if (err2) {
                                logger.error(err2);
                                resolve(false)
                            } else {
                                if (obj2 !== null) {
                                    // at this point, we have found the student as well
                                    // we need to check if the points are enough for the duration
                                    var date = obj.assignment_data.dueDate;
                                    if (duration == 1) {
                                        if (obj2.totalInteractionPoints > 50) {
                                            //success, they have enough points
                                            // now add them to the list, and deduct the points
                                            date = date + 86400
                                            obj2.totalInteractionPoints = obj2.totalInteractionPoints - 50
                                        }
                                        else {
                                            logger.info("Not enough points")
                                            resolve(false)
                                            return
                                        }
                                    }
                                    else if (duration == 2) {
                                        if (obj2.totalInteractionPoints > 150) {
                                            date = date + 172800
                                            obj2.totalInteractionPoints = obj2.totalInteractionPoints - 150
                                            // success, they have enough points
                                        }
                                        else {
                                            logger.info("Not enough points")
                                            resolve(false)
                                            return
                                        }
                                    }
                                    else {
                                        logger.debug("Wrong duration")
                                        resolve(false)
                                        return
                                    }

                                    // now add them to the list, points are already deducted.
                                    // update both
                                    obj.student_based_data.extensionPurchasedBy.push({
                                        student_name: obj2.student_name,
                                        student_email: obj2.emailID,
                                        newDueDate: date
                                    })
                                    assignment.updateOne({ _id: assignment_id }, { student_based_data: obj["student_based_data"] }, async function (err4, obj4) {
                                        if (err4) {
                                            logger.error(err4)
                                        }
                                        else {
                                            logger.debug(`Successfully got: ${obj4}`)
                                            logger.info("Updated the assignment with extension")
                                        }
                                    })

                                    // now update students

                                    student.updateOne({ emailID: student_id }, { totalInteractionPoints: obj.totalInteractionPoints }, async function (err5, obj5) {
                                        if (err5) {
                                            logger.error(err5)
                                        }
                                        else {
                                            logger.debug(`Successfully got: ${obj5}`)
                                            logger.info("Also updated student interaction points")
                                            resolve(true)
                                            return
                                        }
                                    })
                                }
                                else {
                                    logger.debug("Did not find the student")
                                    resolve(false)
                                    return
                                }
                            }
                        }
                        );
                    } else {
                        resolve({
                            "status": false,
                            "message": "did not find assignment"
                        })
                    }
                }
            })
        });
    },

    uploadCorrection: async (correctionLink, studentID, assignment_id, remarks) => {
        logger.debug(`Reached correction upload with ${correctionLink}, ${studentID}, ${assignment_id}, ${remarks}`)
        return new Promise(async (resolve, reject) => {
            assignment.findById({ _id: assignment_id }, async (err, obj) => {
                if (err) {
                    logger.error(err);
                    resolve(false);

                } else {
                    logger.debug(`Found ${JSON.stringify(obj)}`)
                    for (let i = 0; i < obj.student_based_data.submittedStudents.length; i++) {
                        if (obj.student_based_data.submittedStudents[i].studentEmail === studentID) {
                            // means that we found the appropriate student.
                            // we update the object
                            obj.student_based_data.submittedStudents[i] = {
                                student_name: obj.student_based_data.submittedStudents[i].student_name,
                                studentEmail: obj.student_based_data.submittedStudents[i].studentEmail,
                                link: obj.student_based_data.submittedStudents[i].link,
                                correctionLink: correctionLink,
                            }
                            assignment.updateOne({ _id: assignment_id }, { student_based_data: obj["student_based_data"] }, async function (err2, obj2) {
                                if (err2) {
                                    logger.error(err)
                                    resolve(false)
                                } else {
                                    logger.debug(`Successfully got: ${obj2}`)
                                    resolve(true)
                                }
                            })
                        }
                    }
                }
            });
        });
    },

    uploadAssignemnt: async (assignmentLinker, studentEmailID, assignment_id) => {
        return new Promise(async (resolve, reject) => {
            logger.debug("Reached the uploadAssignment Function inside")
            // for students to upload their assignments.
            // step 1: check if the assignment has already been uploaded
            assignment.findById({ _id: assignment_id, open: true }, async (err, obj) => {
                if (err) {
                    logger.error(err);
                    resolve(false);
                } else {
                    logger.debug(`Original Object: ${JSON.stringify(obj)}`);
                    if (obj !== null) {
                        var modified = false;
                        for (let i = 0; i < obj["student_based_data"]["submittedStudents"].length; i++) {
                            if (obj["student_based_data"]["submittedStudents"][i]["studentEmail"] === studentEmailID) {
                                // means that the student has already submitted, and wants to resubmit. we'll allow it
                                obj["student_based_data"]["submittedStudents"][i] = {
                                    studentEmail: studentEmailID,
                                    studentName: await getStudentName(studentEmailID),
                                    link: assignmentLinker,
                                    time: new Date().getTime()
                                };
                                logger.debug("Student has already submitted. Fixing it")
                                modified = true
                            }
                        }
                        if (modified) {
                            // nothing here
                        } else {
                            logger.debug("New Submission")
                            obj["student_based_data"]["submittedStudents"].push({
                                studentEmail: studentEmailID,
                                studentName: await getStudentName(studentEmailID),
                                link: assignmentLinker,
                                time: new Date().getTime()
                            });
                        }
                    }
                    logger.debug(`Changed Object: ${JSON.stringify(obj)}`);
                    assignment.updateOne(
                        { _id: assignment_id },
                        {
                            student_based_data: obj["student_based_data"]
                        },
                        async (err3, obj3) => {
                            if (err3) {
                                logger.error(err);
                            } else {
                                logger.debug(JSON.stringify(obj3))
                                //successfully updated
                                resolve(true);

                            }
                        }
                    );
                }
            }
            );
        });
    },
};
