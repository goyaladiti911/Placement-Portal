const Joi = require('joi');

module.exports.companySchema = Joi.object({
    company: Joi.object({
        name: Joi.string().required(),
        role: Joi.string().required(),
        package: Joi.number().required().min(0),
        branch: Joi.array().items(Joi.string()).required(),
        location: Joi.string().required(),
        eligibility: Joi.number().required().min(0),
        date: Joi.string().required(),
        hiringInfo: Joi.string().required()
    }).required()
});

module.exports.studentSchema = Joi.object({
    student: Joi.object({
        name: Joi.string().required(),
        prn: Joi.string().required(),
        branch: Joi.string().required(),   
        personal_email: Joi.string().email().required(),
        college_email: Joi.string().email().required(),  
        phone: Joi.string().required(),  
        tenth:Joi.number().required().min(0),
        twelfth: Joi.number().required().min(0),
        cgpa: Joi.number().required().min(0), 
        isPlaced: Joi.boolean().default(false).required()
    }).required()
});