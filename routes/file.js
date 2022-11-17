var express = require("express");
var router = express.Router();

var id_counter = 0;
var haveNotSession = false;

router.get("/", (req, res, next) => {
    console.log("req.session.table_id: " + req.session.table_id);
    if(req.session.table_id == null){
        haveNotSession = true;
    } else {
        haveNotSession = false;
    }

    if(req.cookies.table_id == null){
        console.log("file/haveNotCookie");
        id_counter += 1;
        req.session.table_id = id_counter; //過去に来訪したことがない人
    } else {
        console.log("file/haveCookie");
        //console.log("res:cookie table_id" + res.cookies.table_id);
        console.log("req:cookie table_id: " + req.cookies.table_id);
        req.session.table_id = req.cookies.table_id; //過去に来訪した人のCookieから読み取り
    }

    var data = {
        haveNotSession: haveNotSession,
    }
    console.log("haveNotSession: "+ haveNotSession);
    res.render("file/file_register", data);
});

router.post("/column_selecter", (req, res, next) => {
    sessionCheck(req, res);
    res.render("file/column_selecter");
});

router.get("/not_found", (req, res, next) => {
    sessionCheck(req, res);
    res.render("file/not_found");
});

function sessionCheck(req, res) {
    if (req.session.table_id == null){
        res.redirect("/general/session_out");
    }

    return req.session.table_id;
}

module.exports = router;