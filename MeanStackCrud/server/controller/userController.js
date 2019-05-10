const usermodel = require('../model/userModel');
// var mv = require('mv');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');


class Usercontroller {
    insertUser(req, res) {
        var { firstName, lastName, email, password, gender } = req.body;

        var userData = {
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
        usermodel.find().then((data) => {
            res.send({ status: 200, data: data });
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
                if(result){
                    const token = jwt.sign(em, 'abcdef', { expiresIn: '1h' });
                    res.send({ status: 200, data: token });
                }
                else{
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

        var { firstName, lastName, email, password, gender } = req.body;

        var userData = {
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
        if(password){
            userData['password'] =  bcrypt.hashSync(password, 11);
        }
        else{
            console.log("-el--->",password );
        }
        usermodel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.userId)},{$set:userData}).then((data)=>{
            res.send({ status: 200, data: data });
        }).catch((err)=>{
            res.send({ status: 400, message: err.message });
        })
    }

}

var user = new Usercontroller();

module.exports = user;