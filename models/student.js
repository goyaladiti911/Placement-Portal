const mongoose = require('mongoose');
require('mongoose-type-email');
const passportLocalMongoose = require('passport-local-mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    prn: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true,
        enum: ['CS','IT','ENTC','MECH','CIVIL']
    },   
    personal_email: {
            type: String,
            required: true
    },
    college_email: {
            type: String,
            required: true
    },  
    phone: {
        type: String,
        required: true,
        default: '0123456789'
    },  
    tenth: {
            type: Number,
            required: true,
            default: 0
    },
    twelfth: {
            type: Number,
            required: true,
            default: 0
    },
    cgpa: {
            type: Number,
            required: true
    }, 
    isPlaced: {
        type: Boolean,
        default: false,
        required: true
    },
    resume: {
        data: Buffer,
        contentType: String
    },
    isStudent: {
        type: Boolean,
        default: true
    },
    company: {
        type: String,
        required: true,
        default: 'Unplaced'
    }
});

studentSchema.plugin(passportLocalMongoose);

const Student = mongoose.model('Student',studentSchema);
module.exports = Student;