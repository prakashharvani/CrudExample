var mongoose = require('mongoose');

const usermodel = require('../model/userModel');
const UserMaster = mongoose.model('user', usermodel.userSchema);

const dao = require('../dao/baseDao');
// var mv = require('mv');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const superAdminDetail = require('./superAdminDetails')


class Usercontroller {
    insertUser(req, res) {
        var { firstName, mobileNumber, lastName, email, password, gender } = req.body;

        var userData = {
            mobileNumber: mobileNumber,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: bcrypt.hashSync(password, 11),
            gender: gender,
            image: req.files[0].path,                            //req.files.image.name 
            pdf: req.files[1].path
        };

        usermodel.create(userData, (err, data) => {
            if (err) {
                res.send({ status: 400, message: err.message });
            }
            else {
                res.send({ status: 200, data: data });
            }
        });

    }

    getallUser(req, res) {

        let userDao = new dao(UserMaster);
        let query = {
            email: {
                $not: {
                    $eq: superAdminDetail.superAdmin.email
                }
            }
        };

        let option = {
            sort: {
                'createdAt': -1
            }
        };
        var columnName = null
        var clumnValue = null
        var key = null
        var cname = null
        if (req.body['search']['value']) {
            query['$or'] = [];
        }

        // for global search
        for (let i = 0; i < 5; i++) {
            // for if null value
            if (req.body['search']['value']) {

                if (req.body['columns'][i]['data']) {
                    columnName = req.body['columns'][i]['data']
                    clumnValue = req.body['search']['value'];
                    key = columnName,
                        query['$or'].push({
                            [key]: {
                                $regex: clumnValue,
                                $options: 'i'
                            }
                        })
                }

            }
            if (req.body['order'][0]['column'] == i) {
                cname = req.body['columns'][i]['data'];
                option = {
                    sort: {
                        [cname]: (req.body['order'][0]['dir'] == 'asc') ? 1 : -1
                    }
                };
            }
        }

        option['offset'] = parseInt(req.body['start']);
        option['limit'] = parseInt(req.body['length']);
        option['collation'] = { locale: "en_US", numericOrdering: true }

        userDao.findWithPeginate(query, option).then((data) => {
            res.send({ status: 200, data: data })
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
    }

    getUserById(req, res) {

        usermodel.findOne({ _id: mongoose.Types.ObjectId(req.params.userId) }).then((data) => {
            res.send({ status: 200, data: data });
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
    }

    login(req, res) {

        var em = { email: req.body.email };
        var pass = req.body.password;
        usermodel.findOne(em).then((data) => {

            bcrypt.compare(pass, data.password).then((result) => {
                if (result) {
                    const token = jwt.sign(em, 'abcdef', { expiresIn: '1h' });
                    res.send({ status: 200, data: token });
                }
                else {
                    res.send({ status: 400, message: "password is wrong" });
                }

            }).catch((err) => {
                res.send({ status: 400, message: "password is wrong" });
            });
        }).catch((err) => {
            res.send({ status: 400, message: "please email is not valid" });
        });

    }

    deleteUserById(req, res) {
        usermodel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.userId) }).then((data) => {
            res.send({ status: 200, data: data });
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
    }

    findByIdAndUpdate(req, res) {

        var { firstName, mobileNumber, lastName, email, password, gender } = req.body;

        var userData = {
            mobileNumber: mobileNumber,
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
        };

        if (req.files.length > 0) {
            if (req.files.length == 2) {
                userData['image'] = req.files[0].path;
                userData['pdf'] = req.files[1].path;
            }
            else {
                if (req.files[0].fieldname == "image") {
                    userData['image'] = req.files[0].path;
                }
                else {
                    userData['pdf'] = req.files[0].path;
                }
            }
        }
        else {
            // console.log("-el--->", req.files);
        }
        if (password) {
            userData['password'] = bcrypt.hashSync(password, 11);
        }
        else {
            console.log("-el--->", password);
        }
        usermodel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.userId) }, { $set: userData }).then((data) => {
            res.send({ status: 200, data: data });
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        })
    }

}

var user = new Usercontroller();

module.exports = user;