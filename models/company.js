const mongoose = require('mongoose');
const Student = require('./student');
const passportLocalMongoose = require('passport-local-mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    package: {
        type: Number,
        required: true
    },
    branch: {
        type: [String],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    eligibility: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true,
        default: 'soon'
    },
    hiringInfo: {
        type: String,
        required: true,
        default: 'to be conveyed'
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    isCompany: {
        type: Boolean,
        default: true
    }
});

companySchema.plugin(passportLocalMongoose);

const Company = mongoose.model('Company',companySchema);
module.exports = Company;