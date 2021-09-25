const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {companySchema, studentSchema} = require('../schemas.js');
const Student = require('../models/student');
const Company = require('../models/company');
const Staff = require('../models/staff');

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

router.get('/', (req, res) => {
    res.render('admin/admin')
})
router.get('/registerStu', (req, res) => {
    res.render('admin/student', {branches, status})
})
router.post('/registerStu', catchAsync(async (req, res) => {
    try {
            const student = req.body.student;
            const newstu = new Student ({
            username:student.username, 
            name: student.name,
            prn: student.prn,
            branch: student.branch,
            phone: student.phone,
            personal_email: student.personal_email,
            college_email: student.college_email,
            cgpa: student.cgpa,
            isPlaced: student.isPlaced,
            isStudent: true
        });
        const regStu = await Student.register(newstu, student.password);
        // console.log(regStu);
        req.flash('success','Successfully created the student profile!');
        res.redirect('/admin'); 
    } catch (e) {
        req.flash('error',e.message);
        res.redirect('/admin/registerStu');
    }
}))

router.get('/registerComp', (req, res) => {
    res.render('admin/company', {branches})
})

router.post('/registerComp', catchAsync(async (req, res) => {
    try {
            const company = req.body.company;
            const newComp = new Company ({
            username: company.username,
            name: company.name,
            role: company.role,
            package: company.package,
            branch: company.branch,
            location: company.location,
            eligibility: company.eligibility,
            isCompany: true        
        });
        const regComp = await Company.register(newComp, company.password);
        // console.log(regComp);
        req.flash('success','Successfully created the company profile!');
        res.redirect('/admin');
    } catch (e) {
        req.flash('error',e.message);
        res.redirect('/admin/registerComp');
    }
}))

router.get('/registerStaff', (req, res) => {
    res.render('admin/staff')
})

router.post('/registerStaff', catchAsync(async (req, res) => {
    try {
        const staff = req.body.staff;
        const newStaff = new Staff ({
            username: staff.username,
            isStaff: true
        });
        const regStaff = await Staff.register(newStaff, staff.password);
        console.log(regStaff);
        req.flash('success', 'Successfully created the staff profile!');
        res.redirect('/admin');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/admin/registerStaff');
    }
}))

module.exports = router;