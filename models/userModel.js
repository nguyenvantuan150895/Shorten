
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/URLdatabase', { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
})

const user = mongoose.model ('user', userSchema);

// add new account from sign up
module.exports.add  = (object) => {
    return new Promise((resolve, reject) => {
        user.create(object,(err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    })           
};

//authentication account user
module.exports.authentication = (username, password) => {
    return new Promise((resolve, reject) => {
        user.find({username:username, password: password}, (err, result) => {
            if(result.length == 1) resolve(result[0]);
            else reject(err);
        })
    })  
}

//get Total user
module.exports.getTotalUser = () => {
    return new Promise((resolve, reject) => {
        user.countDocuments(( err, count) =>{
            if(err)reject(err)
            else resolve(count);
        }); 
    })  
}

// get all user by page number
module.exports.getAllUser= (page) => {
    return new Promise((resolve, reject) => {
        const pagesize = 10;
        user.find().skip(pagesize*(page-1)).limit(pagesize).exec((err, users) =>{
            if(err) reject(err);
            else resolve(users);
        }); 
    })  
};


//find by ID
module.exports.findByID = (id) => {
    return new Promise((resolve, reject) => {
        user.findById(id, (err, user) => {
            if(err) reject(err);
            else resolve(user);
        });  
    })
}

// Update record by ID
module.exports.update = (id, object) => {
    return new Promise((resolve, reject) => {
        user.updateOne({_id:id}, object, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}

//Delete record by ID
module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        user.deleteOne({_id:id}, (err, result) => {
           if(err) reject(err);
           else resolve(result);
         })
    })
}


