const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Url = require('../models/urlModel');
const md5 = require('md5');


//Handle get adminLogin
exports.login_get = (req, res) => {
    res.render("adminLogin.ejs");
};
exports.login_post = (req, res) => {
    Admin.authentication(req.body.accAdmin, req.body.password).then((result) => {
        req.session.admin = req.body.accAdmin;
        res.redirect("/admin/manager");
    }, (err) => {
        res.render("adminLoginErr.ejs");
    })
};

// admin logout
exports.logout = (req, res) => {
    req.session.admin = undefined;
    res.redirect("/admin/login");
}

// admin manager
exports.manager = async (req, res) => {
    try {
        let totalUser = await User.getTotalUser();
        let totalLink = await Url.getTotalLink();
        res.render("adminManager.ejs", {admin: req.session.admin, totalUser: totalUser, totalLink: totalLink});
    } catch (e) {
        return Promise.reject(e);
    }
};
// admin manager user
exports.managerUser = async (req, res) => {
    page_current = req.params.page;
    try {
        let totalUser = await User.getTotalUser();
        let users = await User.getAllUser(page_current);
        res.render('adminManagerU.ejs',{users: users, admin:req.session.admin, page: page_current, totalUser: totalUser});
    } catch(e) {
        console.log("err");
    }
};

// add new user
exports.addUser_get = async (req, res) => {
    res.render("add_user.ejs", {admin:"req.session.admin"});
};

exports.addUser_post = async (req, res) => {
    try {
        await User.add(req.body);
        let totalUser =  await User.getTotalUser();
        let last_page = Math.ceil(totalUser/10);
        let path = '/admin/manager/user/' + last_page.toString();
        res.redirect(path);
    } catch(e) {
        console.log("Error: addUser_post");
    }
};

//update User
exports.updateUser_get = async (req, res) => {
    id = req.params.id;
    try{
        user = await User.findByID(id,req.body);
        res.render("update_user.ejs", {admin:req.session.admin, user: user});
    } catch (e) {
        console.log("Error updateUser_get");
    }
};

exports.updateUser_post = async (req, res) => {
    try {
        
        let result = await User.update(id, req.body);
        let path = '/admin/manager/user/' + page_current.toString();
        res.redirect(path);
    } catch (e) {
        console.log("Error updateUser_post");
    }
};

//Delete User
exports.deleteUser = async (req, res) => {
    id = req.params.id;
    try{
        let result = await User.delete(id);
        let path = '/admin/manager/user/' + page_current.toString();
        res.redirect(path);
    } catch (e) {
        console.log("Error deleteUser");
    }
};
// Detail User
exports.detailUser = async (req, res) => {
    id = req.params.id;
    try{
        user = await User.findByID(id,req.body);
        res.render("detail_user.ejs", {admin:req.session.admin, user: user, page: page_current});
    } catch (e) {
        console.log("Error detailUser");
    }
};

// manager Link
exports.managerLink = async (req, res) => {
    pageUrl = req.params.page;
    try {
        let totalLink = await Url.getTotalLink();
        let urls = await Url.getAllUrl10(pageUrl);
        //console.log("test thu:", urls);
        res.render('adminManagerLink.ejs',{urls: urls, admin:req.session.admin, page: pageUrl, totalLink: totalLink});
    } catch(e) {
        console.log("Error managerLink");
    }
};

// Detail Link
exports.detailLink = async (req, res) => {
    id = req.params.id;
    try{
        let url = await Url.findByID(id);
        res.render("detail_link.ejs", {admin:req.session.admin, page:pageUrl, url: url});
    } catch (e) {
        console.log("Error detailLink");
    }
};

// Delete Link
exports.deleteLink = async (req, res) => {
    id = req.params.id;;
    try{
        let result = await Url.urlDelete(id);
        let path = '/admin/manager/link/' + pageUrl.toString();
        res.redirect(path);
    } catch (e) {
        console.log("Error deleteUrl");
    }
};
// Add link
exports.addLink_get = async (req, res) => {
    res.render("add_link.ejs", {admin:"req.session.admin"});
};

exports.addLink_post = async (req, res) => {
    
    try{
        let random = Math.floor(100000 +  Math.random() * 900000);
        let base62 = convertBase62(random);
        let url = mapping(base62);
        let oldUrl = req.body.oldUrl;
        let hash = md5(oldUrl);
        let newUrl = "localhost:3000/" + url;
        const objectUrl = {random: random,md5: hash, oldUrl: oldUrl, newUrl : newUrl, user : req.body.user};
        let result = await Url.saveUrl(objectUrl);
        let totalLink = await Url.getTotalLink();
        let last_page = Math.ceil(totalLink/10);
        let path = '/admin/manager/link/' + last_page.toString();
        res.redirect(path);
    } catch(e) {
        console.log(e);
    }   
}

//Algorithm convert base10 to base62
let convertBase62 = (number) => {
    let digits = [];
    let num = Number(number);
    while ( num > 0 ) {
        digits.push(num%62);
        num = parseInt(num/62);
    }
    return digits.reverse();
}

// mapping a->z,A->Z,0->9 with 0->61
let mapping = (arr) => {
    let url ="";
    for ( i = 0; i < arr.length; i++){
        if( Number(arr[i]) >=0 &&  Number(arr[i]) <= 25 ){
            url =  url +  String.fromCharCode( Number(arr[i]) + 97 );
        }
        if( Number(arr[i]) >= 26 &&  Number(arr[i]) <= 51 ) {
            url = url +  String.fromCharCode( Number(arr[i]) + 39 );
        }
        if( Number(arr[i]) >= 52 &&  Number(arr[i]) <= 61){
            url = url + (Number(arr[i]) - 52);
        }
    }
    return url;
}




