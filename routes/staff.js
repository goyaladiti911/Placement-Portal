const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {companySchema, studentSchema} = require('../schemas.js');
const Student = require('../models/student');
const Company = require('../models/company');
const {isLoggedIn, isStaff} = require('../middleware');

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
const status = ['true', 'false'];

// router.get('/', catchAsync(async (req, res) => {
//     const students = await Student.find({});
//     const companies = await Company.find({});
//     res.render('staff/staff', {students, companies})
// }))

router.get('/', isLoggedIn, catchAsync(async(req, res) => {
    const students = await Student.find({});
    res.render('staff/status', {students})
}))

router.get('/student', isLoggedIn, catchAsync(async(req, res)=> { 
    const students = await Student.find({});
    res.render('staff/students', {students})
}))

router.get('/company', isLoggedIn, catchAsync(async(req, res)=> { 
    const companies = await Company.find({});
    res.render('staff/companies', {companies})
}))


router.get('/:sid/editStu', isLoggedIn, catchAsync (async (req, res) => {
    const {sid} = req.params;
    const student = await Student.findById(sid);    
    res.render('staff/editStuCard', {student, branches, status})
}))

router.get('/:cid/editComp', isLoggedIn, catchAsync(async (req, res) => {
    const {cid} = req.params;
    const company = await Company.findById(cid);
    res.render('staff/editCard', {company, branches})
}))

router.put('/students/:sid', isLoggedIn, catchAsync(async (req, res) => {
    const {id,sid} = req.params;
    const student = await Student.findByIdAndUpdate(sid,{...req.body.student}); 
    req.flash('success','Successfully updated the student profile!')   
    res.redirect(`/staff/${id}/student`);
}))

router.put('/companies/:cid', isLoggedIn, catchAsync(async (req, res) => {
    const {id,cid} = req.params;
    const company = await Company.findByIdAndUpdate(cid,{...req.body.company});
    req.flash('success','Successfully updated the company profile!')
    res.redirect(`/staff/${id}/company`);
}))

router.delete('/companies/:cid', isLoggedIn, catchAsync(async (req, res) => {
    const {id, cid} = req.params;
    await Company.findByIdAndDelete(cid);
    req.flash('success','Successfully deleted the company profile!') 
    res.redirect(`/staff/${id}/company`)
}))

module.exports = router;

// app.post('/staff', catchAsync(async (req, res) => {
//     const company = new Company(req.body.company);
//     await company.save();
//     res.redirect('/staff')
// }))

// app.get('/staff/companies/newComp', (req, res) => {
//     res.render('staff/newCard', {branches})
// })