const ShortUrl = require('../models/urlModel');
const md5 = require('md5');


//Handle get short URL
exports.shortUrl_get = (req, res) => {
    res.render('shortenUrl.ejs');
};
//Handle post short Url
exports.shortUrl_post = (req, res) => {   
    CreateShortUrl(req.body.url, req.session.user).then((resolve) => {
        res.render('shortUrlResult.ejs', {oldUrl: resolve.oldUrl, newUrl:resolve.newUrl });
    }, (err) => {
        console.log(err);
    });  
};

// Create short Url
let CreateShortUrl = (longUrl, session_user) => {
    let random = Math.floor(100000 +  Math.random() * 900000);
    let base62 = convertBase62(random);
    let url = mapping(base62);
    let oldUrl = longUrl;
    let hash = md5(oldUrl);
    let newUrl = "localhost:3000/" + url;
    const objectUrl = {random: random,md5: hash, oldUrl: oldUrl, newUrl : newUrl, user : session_user};
    return new Promise((resolve, reject) => {
        ShortUrl.checkExistUrl(hash).then((exist_url) =>{
            resolve (exist_url);
        },(reject) => {
                ShortUrl.saveUrl(objectUrl).then((result) => {
                    resolve (result);
            }, (err) => {
                console.log("Can not create new url");
            })
        } )
    })
}

// Get oldUrl by newUrl
exports.get_oldUrl = (req, res) => {
    let url = req.hostname + ":3000" + req.url;
    ShortUrl.get_oldUrl(url).then((result) => {
        res.redirect(result.oldUrl);
    }, (reject) => {
        //Don't handle because this url original
    })
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

// Manager url
exports.urlManager = (req, res) => {
    page_current = req.params.page;
    ShortUrl.getTotalRecordByAccount(req.session.user).then((count) => {
        ShortUrl.getAllUrl(page_current, req.session.user).then((url) => {
            res.render("userManager.ejs", {url:url, page:page_current, count: count, user: req.session.user});
        }, (err) => {
            console.log("Error while try get url in database");
        })
    }, (reject) => {
        console.log("Error while get total record");
    })
 }

exports.urlManager_post = (req, res) => {
    CreateShortUrl(req.body.url, req.session.user).then(() => {
        ShortUrl.getTotalRecordByAccount(req.session.user).then((count) => {
            const last_page = Math.ceil(count/5);
            var path = "/manager/" + last_page;
            res.redirect(path);
        }, (err) => {console.log("Error urlManager_port get total record")});
        
    }, (err) => {
        console.log("Can not create new Url");
    })
}


//Delete Url
exports.urlDelete = (req, res) => {
    const idDelete = req.params.id;
    ShortUrl.urlDelete(idDelete).then((resolve) => {
        const pathDele = "/manager/" + page_current.toString();
        res.redirect(pathDele);
    }, (reject) => {
        res.send("Error while delete record!");
    })
}






