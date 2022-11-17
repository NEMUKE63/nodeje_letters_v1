var express = require("express");
var router = express.Router();
const db = require("../models/index");
const {Op, ConnectionRefusedError} = require("sequelize");
var convertors = require("./../program/convertors.js");
const fs = require("fs");

var {PythonShell} = require("python-shell"); //npm install python-shellの実行が必要

const sqlite3 = require("sqlite3");
const db_run = new sqlite3.Database("database_dev.sqlite3");
var selected_db = ""; //データベースのテーブル名を入力

router.get("/selecting", (req, res, next) => {

    sessionCheck(req, res);

    Promise.resolve().then(function(){
        return new Promise(function (resolve, reject) {
            if(req.cookies.table_id == null){
                console.log("selecting req.cookies.table_id == null | session.table_id: " + req.session.table_id);
                var creating_table_name = "Customers" + req.session.table_id;
                var sql_creating_table = "CREATE TABLE " + creating_table_name + " AS SELECT * FROM Customers";
                console.log(sql_creating_table);
                db_run.serialize(() => {
                    try{
                        db_run.run(sql_creating_table);
                        selected_db = creating_table_name;
                    } catch (err) {
                        var data = {
                            message: "新規表の作成に失敗しました",
                            resolution: "以下のリンクより管理者に報告してください",
                            url: "select/selecting",
                            err: err
                        };
                        res.render("general/database_error", data);
                    }finally{
                        res.cookie("table_id", req.session.table_id, {maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false}); //cookieを指定。期限は1年間
                        resolve("(1) maked new table");
                    }
                });
            } else {
                resolve("(1) already had a table");
                //何もしないよー。
            }
        })
    }).then(function(){
        return new Promise(function (resolve, reject) {
            if (!fs.existsSync("public/images/tables/" + selected_db)) {
                fs.mkdirSync("public/images/tables/" + selected_db);
                fs.mkdirSync("public/images/tables/" + selected_db + "/hagaki_red_back");
                fs.mkdirSync("public/images/tables/" + selected_db + "/hagaki_white_back");
            }
            PythonShell.run('program/makePreviewImage.py', { args: [selected_db, "red", ""] }, (err, result) => {
                if (err) throw err;
            
                console.log(result);
                console.log("python_finished");

                resolve();
            });
        })
    }).then(function(){
        return new Promise(function (resolve, reject) {
            console.log(selected_db);
            db_run.serialize(() => {
                db_run.all("select * from " + selected_db, (err, records) => {
                    if(!err){
                        address = makeAllAddress(records);
                        var data = {
                            table_name_origin: selected_db,
                            records: records,
                            address: address,
                        };
                        
                        res.render("select/selecting", data);
                    } else {
                        var data = {
                            message: "データベースからレコードの取得に失敗しました。",
                            resolution: "以下のリンクより管理者に報告してください",
                            url: "select/selecting",
                            err: err
                        };
                        res.render("general/database_error", data);
                    }
                })
            })
        })
    })
    
    /*
    PythonShell.run('program/makePreviewImage.py', { args: ["Customer", "red", ""] }, (err, result) => {
        if (err) throw err;
    
        console.log(result);
    });
    //console.log("python_finished");
    
    eval("db." + selected_db).findAll()
    .then(records => {
        //console.log("the amount of records:");
        //console.log(records);
        address = makeAllAddress(records);
        var data = {
            records: records,
            address: address,
        };
        res.render("select/selecting", data)
    })
    .catch(err => {
        var data = {
            message: "データベースからレコードの取得に失敗しました。",
            resolution: "使用するデータベースを変更するか、以下のリンクより管理者に報告してください",
            url: url,
            err: err
        };
        //注意)以下のテンプレートはまだ未完成です。
        res.render("database_error", data)
    });
    */
});

router.post("/selected", (req, res, next) => {

    sessionCheck(req, res);

    Promise.resolve().then(function(){
        return new Promise(function (resolve, reject) {
            db_run.serialize(() => {
                db_run.all("select * from " + selected_db, (err, records) => {
                    if(!err){
                        try{
                            for (var i in records) {
                                db_run.run("UPDATE " + selected_db + " SET state = " + eval("req.body.state" + records[i].id) + " WHERE id = " + records[i].id);
                                if (eval("req.body.changed_" + records[i].id) == 1) {
                                    //formから取得した住所を分割の上、以下よりデータベースに登録
                                    var customer_data_1st = convertors.convertToJSON(eval("req.body.addr_1st_" + records[i].id), false);
                                    var customer_data_2nd = convertors.convertToJSON(eval("req.body.addr_2nd_" + records[i].id), customer_data_1st.isAfterNum);
                                    var sql_updating_elements = 
                                    "printed_name_1st = " + attachWQuote(convertors.hanToZen(eval("req.body.name_1st_" + records[i].id))) + ", " +
                                    "printed_name_2nd = " + attachWQuote(convertors.hanToZen(eval("req.body.name_2nd_" + records[i].id))) + ", " +
                                    "zip_code_1st = " + attachWQuote(convertors.zenToHan(eval("req.body.zip_code_1st_" + records[i].id))) + ", " +
                                    "zip_code_2nd = " + attachWQuote(convertors.zenToHan(eval("req.body.zip_code_2nd_" + records[i].id))) + ", " +
                                    "addr_name_1st = " + attachWQuote(customer_data_1st.addr) + ", " +
                                    "addr_num1_1st = " + attachWQuote(customer_data_1st.addr_num1) + ", " +
                                    "addr_num2_1st = " + attachWQuote(customer_data_1st.addr_num2) + ", " +
                                    "addr_num3_1st = " + attachWQuote(customer_data_1st.addr_num3) + ", " +
                                    "addr_num4_1st = " + attachWQuote(customer_data_1st.addr_num4) + ", " +
                                    "building_name_1st = " + attachWQuote(customer_data_1st.building_name) + ", " +
                                    "building_num_1st = " + attachWQuote(customer_data_1st.building_num) + ", " +
                                    "building_unit_1st = " + attachWQuote(customer_data_1st.building_unit) + ", " +
                                    "addr_name_2nd = " + attachWQuote(customer_data_2nd.addr) + ", " +
                                    "addr_num1_2nd = " + attachWQuote(customer_data_2nd.addr_num1) + ", " +
                                    "addr_num2_2nd = " + attachWQuote(customer_data_2nd.addr_num2) + ", " +
                                    "addr_num3_2nd = " + attachWQuote(customer_data_2nd.addr_num3) + ", " +
                                    "addr_num4_2nd = " + attachWQuote(customer_data_2nd.addr_num4) + ", " +
                                    "building_name_2nd = " + attachWQuote(customer_data_2nd.building_name) + ", " +
                                    "building_num_2nd = " + attachWQuote(customer_data_2nd.building_num) + ", " +
                                    "building_unit_2nd = " + attachWQuote(customer_data_2nd.building_unit) + "";
                                    console.log("UPDATE " + selected_db + " SET " + sql_updating_elements + " WHERE id = " + records[i].id);
                                    
                                    db_run.run("UPDATE " + selected_db + " SET " + sql_updating_elements + " WHERE id = " + records[i].id);
                                } else {
                                    //何もしないよー。
                                }
                            }
                            resolve("(1) update finished");
                        } catch (err) {
                            var data = {
                                message: "データの更新に失敗しました。",
                                resolution: "以下のリンクより管理者に報告してください",
                                url: "select/selecting",
                                err: err
                            };
                            res.render("general/database_error", data);
                        }
                    } else {
                        var data = {
                            message: "データベースで更新のためのレコードの取得に失敗しました。",
                            resolution: "以下のリンクより管理者に報告してください",
                            url: "select/selected",
                            err: err
                        }
                        res.render("general/database_error", data);
                    }
                })
            })
        })
    }).then(function(){
        return new Promise(function (resolve, reject) {
            PythonShell.run('program/makePreviewImage.py', { args: [selected_db, "red", ""] }, (err, result) => {
                if (err) throw err;
            
                console.log(result);
                resolve("python red finished");
            })
        })
    }).then(function(){
        return new Promise(function (resolve, reject) {
            var folder = "public/images/tables/" + selected_db + "/hagaki_white_back"

            fs.readdir(folder, function(err, files){
                if(err){
                  throw err;
                }
                files.forEach(function(file){
                    fs.unlink(folder + "/" + file, function(err){
                        if(err){
                            throw(err);
                        }
                        console.log("removed " + file);
                    });
                });
                resolve("delete files finished");
            })
        })
    }).then(function(){
        return new Promise(function (resolve, reject) {
            PythonShell.run('program/makePreviewImage.py', { args: [selected_db, "white", "WHERE state = 1"] }, (err, result) => {
                if (err) throw err;
            
                console.log(result);
                console.log("python white finished");
                resolve("python white finished");
            })
        })
    }).then(function(){
        return new Promise(function (resolve, reject) {
            PythonShell.run('makePDF.py', { args: [selected_db] }, (err, result) => {
                if (err) throw err;
            
                console.log("python make PDF finished");
                resolve("python make PDF finished");
            })
        })
    }).then(function(){
        return new Promise(function (resolve, reject) {
            PythonShell.run('program/makeLettersIcon.py', { args: [selected_db] }, (err, result) => {//印刷のプレビュー画像作成
                if (err) throw err;
            
                console.log("python make icon finished");
                resolve("python make icon finished");
            })
        })
    }).then(function(){
        return new Promise(function (resolve, reject) {
            db_run.serialize(() => {
                db_run.all("select * from " + selected_db, (err, records) => {
                    if(!err){
                        var data = {
                            table_name_origin: selected_db,
                            records: records
                        }
                        res.render("select/selected", data)
                    } else {
                        var data = {
                            message: "更新後に再度取得を行ったところ、データベースからレコードの取得に失敗しました。",
                            resolution: "以下のリンクより管理者に報告してください",
                            url: "select/selected",
                            err: err
                        };
                        res.render("general/database_error", data);
                    }
                })
            })
        })
    })
})

/*
router.get("/test", (req, res, next) => {
    selected_db = "Customer1"

    PythonShell.run('makePDF.py', { args: [selected_db] }, (err, result) => {
        if (err) throw err;

        console.log(result);
        console.log("python make PDF finished");
    })

    res.render("general/session_out")
})
*/

function makeAllAddress(records){

    var address = [];
    for (var i in records){
        address[i] = new Array(2).fill("");
    };

    var address_temp = "";
    var parts_temp = "";
    var order = ["1st", "2nd"];
    var elements = ["addr_name", "addr_num1", "addr_num2", "addr_num3", "addr_num4", "building_name", "building_num", "building_unit"];

    for (var i in records){
        for (var j in order) {
            address_temp = "";
            for (var k in elements) {
                parts_temp = "";
                if (eval("records[" + i + "]." + elements[k] + "_" + order[j]) == null){
                    parts_temp = "";
                } else {
                    parts_temp = eval("records[" + i + "]." + elements[k] + "_" + order[j]);
                };
                if ((k >= 2 && k <= 4) && (parts_temp != "")){
                    parts_temp = "-" + parts_temp;
                };
                address_temp += parts_temp;
            }
            address[i][j] = address_temp;
        }
    }
    return address;
}

function attachWQuote(recieved_text){
    if(recieved_text == null){
        return null;
    } else {
        return "'" + recieved_text + "'";
    }
}

function sessionCheck(req, res) {
    if (req.session.table_id == null){
        res.redirect("/general/session_out");
    }

    return req.session.table_id;
}

module.exports = router;
