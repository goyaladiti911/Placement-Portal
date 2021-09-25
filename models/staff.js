const mongoose = require('mongoose');
require('mongoose-type-email');
const passportLocalMongoose = require('passport-local-mongoose');

const staffSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
    // email: {
    //     type: String,
    //     required: true
    // },
    isStaff: {
        type: Boolean,
        default: true
    }
});

staffSchema.plugin(passportLocalMongoose);

const Staff = mongoose.model('Staff',staffSchema);
module.exports = Staff;