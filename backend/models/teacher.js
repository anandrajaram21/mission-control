const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    emailID: String,
    teacher_name: String,
    teacher_class: Number,
    teacher_section: String,
});

module.exports = mongoose.model("teacher", teacherSchema);
