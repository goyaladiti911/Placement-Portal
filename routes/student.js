const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {companySchema, studentSchema} = require('../schemas.js');
const Student = require('../models/student');
const Company = require('../models/company');
const {isLoggedIn, isStudent} = require('../middleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('upload a pdf file'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const validateCompany = (req, res, next) => {
    
    const {error} = companySchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else next();
}

const validateStudent = (req, res, next) => {
     
    const {error} = studentSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else next();
}

const branches = ['CS','IT','ENTC','MECH','CIVIL'];

router.get('/', isLoggedIn, isStudent, catchAsync(async (req, res) => {
    const {id} = req.params;
    const companies = await Company.find({});
    res.render('student/profile',{companies, id})
}))

router.get('/details', isLoggedIn, isStudent, catchAsync(async (req, res) => {
    const {id} = req.params;
    const s = await Student.findById(id);
    res.render('student/details',{s})
}))

router.get('/editinfo', isLoggedIn, isStudent,catchAsync (async (req,res) => {
    const {id} = req.params;
    const s = await Student.findById(id);    
    res.render('student/editInfo',{s,branches})
}))

router.get('/applications', isLoggedIn, isStudent,catchAsync (async (req, res) => {
    const {id} = req.params;
    //add the query to find all companies where application array has id
    const companies = await Company.find({applications: id}); 
    res.render('student/applications',{companies})
}))

router.put('/', isLoggedIn, isStudent,upload.single('resume'),catchAsync(async (req, res) => {
    console.log(req.file);
    const {id} = req.params;
    const {name, prn, branch, phone, personal_email, college_email, tenth, twelfth, cgpa} = req.body;
    const student = await Student.findByIdAndUpdate(id,{
        name: name,
        prn: prn,
        branch: branch,
        phone: phone,
        personal_email: personal_email,
        college_email: college_email,
        tenth: tenth,
        twelfth: twelfth,
        cgpa: cgpa,
        resume: req.file.path
    });
    req.flash('success','Successfully updated the profile!') 
    res.redirect(`/student/${id}/details`);
}))

//to add student objectid to the company applications array
router.post('/:cid', isLoggedIn, isStudent,catchAsync(async (req, res) => {
    const {id,cid} = req.params;
    const student = await Student.findById(id);
    const company = await Company.findById(cid);
    //also add a condition to check if the student id already in the array
    //if true, then flash a message and skip to redirection
    if(!company.applications.includes(id)) {
        company.applications.push(student);
        await company.save();
        req.flash('success',`Successfully Applied for ${company.name}!`) 
        res.redirect(`/student/${id}/applications`);
    }else{
        req.flash('error',`You have already applied for ${company.name}!`) 
        res.redirect(`/student/${id}/applications`);
    }        
}))

module.exports = router;