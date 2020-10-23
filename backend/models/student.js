const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    emailID: String,
    student_name: String,
    student_class: Number,
    student_section: String,
    totalInteractionPoints: {type: Number, default: 0},
    InteractionData: {
        interactionArray: {type: Array, default: [0]},
        rawPoints: {type: Number, default: 0},
        multiplier: {type: Boolean, default: false}
    }
});

module.exports = mongoose.model("student", studentSchema);
