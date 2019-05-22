
var mongoose = require('mongoose');

const usermodel = require('../model/userModel');
const UserMaster = mongoose.model('user', usermodel.userSchema);

const supAdminDetail = require('./superAdminDetails');
const bcrypt = require('bcrypt');
const dao = require('../dao/baseDao');

function superAdminCreate() {

    let userDao = new dao(UserMaster);

    userDao.findOne({email: 'prakash.harvani@codezeros.com'}).then( result => {
        if(result) {
            console.log('--- SuperAdmin already Exist --- ')
        } else {
            console.log('--- SuperAdmin Crearted Successfully ---');
            supAdminDetail.superAdmin.password = bcrypt.hashSync(supAdminDetail.superAdmin.password, 11)
            userDao.save(supAdminDetail.superAdmin);
        }
    })
}

module.exports = {
    superAdminCreate
}