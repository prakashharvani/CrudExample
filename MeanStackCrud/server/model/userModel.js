const mongoose= require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName :{
        type:String,
        required :true
    },
    lastName:{
        type:String,
        required :true
    },
    email:{
        type:String,
        required :true,
        unique:true
    },
    mobileNumber : {
        type: String
    },
    password: {
        type :String,
        required :true
    },
    gender : {
        type : String,
        enum : ['male','female']
    },
    image:{
        type : String,
        required: true 
    },
    pdf:{
        type : String,
        required: true 
    }
}, { timestamps:false}, { versionKey: true});

userSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('user',userSchema);