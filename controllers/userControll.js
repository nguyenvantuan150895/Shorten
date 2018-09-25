const User = require('../models/userModel');
const Check = require('../authen/checksession');


//Handle user login
exports.login_get = (req, res) => {
   res.render("userLogin.ejs");
}
exports.login_post = (req, res) => {
    User.authentication(req.body.username, req.body.password).then((object)=>{
        req.session.user = req.body.username;
        //Check.passSession(req.session.user);
        //console.log(Check.checkSession());
        res.redirect('/manager/1');
    }, (err)=>{
        res.render("userLoginError.ejs", {user: req.body.username, pass:req.body.password});
    })
}
//Handle user sign up
exports.signup_get = (req, res) => { 
    res.render("userSignup.ejs");
}
exports.signup_post = async (req, res) => { 
    const rs = await User.add(req.body);
    User.authentication(req.body.username, req.body.password).then((object)=>{
        req.session.user = rs.username;
        res.redirect('/manager/1');
    }, (err)=>{
        console.log(err);
    })
}

//user Logout
exports.userLogout = (req, res) => {
    req.session.user = undefined;
    res.redirect('/user/login');
}



