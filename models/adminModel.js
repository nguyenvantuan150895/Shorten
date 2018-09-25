
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/URLdatabase', { useNewUrlParser: true });
const adminSchema = new mongoose.Schema({
    accAdmin: String,
    password: String,
    email: String
})

const admin = mongoose.model ('admins', adminSchema);

// authentication account admin
module.exports.authentication = (accAdmin, password) => {
    return new Promise((resolve, reject) => {
       admin.find({accAdmin: accAdmin, password: password} , (err, result) => {
           if(result.length == 1) resolve(result[0]);
           else reject(err);
       })
    })           
};

//get total link & user
module.exports.getTotal = () => {
    // return new Promise((resolve, reject) => {
       
    // }) 
    admin.find({user:"user1"} , (err, result) => {
        if(!err){
            console.log("TOTO:", result);
        }else console.log("loi me roi");
    })          
};

