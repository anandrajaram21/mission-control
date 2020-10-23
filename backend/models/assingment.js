const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    // assignment data is constant for the assignment, and does not have modifications
    assignment_data: {
        class_assigned: Number,
        section: String,
        teacher_assigned_by: String,
        teacher_name: String,
        dueDate: Number,
        assignmentName: String,
        assignmentLink: String,
        open: {type: Boolean, default: true},
    },
    student_based_data: {
        extensionPurchasedBy: {type: Array, default: []},
        submittedStudents: {type: Array, default: []},
    }
});

module.exports = mongoose.model("assignment", assignmentSchema);
