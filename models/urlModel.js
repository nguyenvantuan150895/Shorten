
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/URLdatabase', { useNewUrlParser: true });
const urlSchema = new mongoose.Schema({
    random: String,
    md5: String,
    oldUrl: String,
    newUrl: String,
    user: Object
})
const url = mongoose.model ('url', urlSchema);


// Save url ( old and new )
module.exports.saveUrl = (objectURl) => {
    return new Promise((resolve, reject) => {
        url.create(objectURl, (err, result) => {
            if(!err){
                return resolve(result);
            } else {
                return reject(false);
            }
        }) 
    })   
}
// Check url already exists in database
module.exports.checkExistUrl = (md5) => {
    return new Promise((resolve, reject) => {
        url.find({md5:md5}, (err, result) => {
            const len = result.length;
            if(len == 1){
                return resolve(result[0]);
            } else {
                return reject(false);
            }
        })
     })    
}

//get oldUrl by newUrl
module.exports.get_oldUrl = (url1) => {
    return new Promise((resolve, reject) => {
        url.find({newUrl: url1}, (err, result) => {
            const len = result.length;
            //console.log("Result:", result);
            if(len == 1){
                return resolve(result[0]);
            } else {
                return reject(false);
            }
        })
     })     
}


//get all URL in one page
module.exports.getAllUrl = (page, account) => {
    return new Promise((resolve, reject) => {
        const pagesize = 5;
        url.find({user: account}).skip(pagesize*(page-1)).limit(pagesize).exec((err, url) =>{
            if(!err){
                resolve(url);
            }else{
                reject(err);
            }
        }); 
    })  
};

//delete Url
module.exports.urlDelete = (id) => {
    return new Promise((resolve, reject) => {
        url.deleteOne({_id:id}, (err, result) => {
            if(err)reject(err)
            else resolve(result);
        })
    })
}

// get Total record
module.exports.getTotalRecordByAccount = (account) => {
    return new Promise((resolve, reject) => {
        url.countDocuments({user:account},( err, count) =>{
            if(err)reject(err)
            else resolve(count);
        }); 
    })   
}
//get Total link
module.exports.getTotalLink = () => {
    return new Promise((resolve, reject) => {
        url.countDocuments(( err, count) =>{
            if(err)reject(err)
            else resolve(count);
        }); 
    })   
}

// get 10 record one page (manager URL)
module.exports.getAllUrl10= (page) => {
    return new Promise((resolve, reject) => {
        const pagesize = 10;
        url.find().skip(pagesize*(page-1)).limit(pagesize).exec((err, urls) =>{
            if(err) reject(err);
            else resolve(urls);
        }); 
    })  
};

//find by ID
module.exports.findByID = (id) => {
    return new Promise((resolve, reject) => {
        url.findById(id, (err, user) => {
            if(err) reject(err);
            else resolve(user);
        });  
    })
}
