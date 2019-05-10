var multer = require('multer');

var storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, './Images');
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname);
    }
});

var filefilter = function (req, file, cb) {
    if (file == undefined) {
        return cb(null, true);
    }
    else {
        if (file.fieldname == 'image') {
            if (file.originalname.match(/\.(png|jpeg|jpg)$/)) {
                return cb(null, true);
            }
            else {
                return cb({ status: 400, message: 'in image only image is allowed' });
            }
        }
        // else if (file.fieldname == 'myfile') {
        //     return cb(null, true);
        // }
        else {
            if (file.originalname.match(/\.(pdf)$/)) {
                return cb(null, true);
            }
            else {
                return cb({ status: 400, message: "Only Pdf is Allow" });
            }
        }
    }
}
var upload = multer({
    storage: storage, limits: {
        filesize: 1024 * 1024 * 10
    }, fileFilter: filefilter
});

module.exports = upload; 