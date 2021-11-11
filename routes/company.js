const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {companySchema, studentSchema} = require('../schemas.js');
const Company = require('../models/company');
const {isLoggedIn, isCompany} = require('../middleware');

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

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    const company = await Company.findById(id).populate('applications');
    res.render('company/profile',{company,branches})
}))

router.get('/details', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    const c = await Company.findById(id);
    res.render('company/details', {c})
}))

router.get('/editinfo', isLoggedIn, catchAsync (async (req,res) => {
    const {id} = req.params;
    const company = await Company.findById(id);
    
    res.render('company/editInfo',{company,branches})
}))

router.put('/', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    const company = await Company.findByIdAndUpdate(id,{...req.body.company});
    req.flash('success','Successfully updated the profile!') 
    res.redirect(`/company/${id}/details`);
}))

module.exports = router;