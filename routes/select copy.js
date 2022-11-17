var express = require("express");
var router = express.Router();
const db = require("../models/index");
const {Op, ConnectionRefusedError} = require("sequelize");
var convertors = require("./../program/convertors.js");

var {PythonShell} = require("python-shell"); //npm install python-shellの実行が必要

const sqlite3 = require("sqlite3");
const db_run = new sqlite3.Database("database_dev.sqlite3");
var selected_db = "Customer"; //データベースのテーブル名を入力

router.get("/selecting", (req, res, next) => {
    console.log("selecting/entered");

    if(req.cookies.table_id == null){
        console.log("selecting req.cookies.table_id == null | session.table_id: " + req.session.table_id);
        var creating_table_name = "Customers" + req.session.table_id;
        var sql_creating_table = "CREATE TABLE " + creating_table_name + " AS SELECT * FROM Customers";
        console.log(sql_creating_table);
        db_run.serialize(() => {
            try{
                db_run.run(sql_creating_table);
                //selected_db = creating_table_name;
            } catch (err) {
                var data = {
                    message: "新規表の作成に失敗しました",
                    resolution: "以下のリンクより管理者に報告してください",
                    url: "select/selecting",
                    err: err
                };
                res.render("general/database_error", data);
            }
        });
    } else {
        //何もしないよー。
    }
    
    res.cookie("id", req.session.id, {maxAge: 5 * 60 * 1000, httpOnly: false}); //cookieを指定。期限は1年間。

    const promise_hagaki_maker = new Promise((resolve) => {
        PythonShell.run('program/makePreviewImage.py', { args: ["Customer", "red", ""] }, (err, result) => {
            if (err) throw err;
        
            console.log(result);
            resolve("python finished");
        });
        //console.log("python_finished");
    }).then((resolve) => {
        console.log(resolve);
        console.log(selected_db);
        db_run.serialize(() => {
            eval("db." + selected_db).findAll()
            .then(records => {
                //console.log("the amount of records:");
                //console.log(records);
                address = makeAllAddress(records);
                var data = {
                    table_name_origin: selected_db,
                    records: records,
                    address: address,
                };
                res.render("select/selecting", data);
            })
        })
        .catch(err => {
            var data = {
                message: "データベースからレコードの取得に失敗しました。",
                resolution: "使用するデータベースを変更するか、以下のリンクより管理者に報告してください",
                url: "select/selecting",
                err: err
            };
            res.render("general/database_error", data)
        });
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
    eval("db." + selected_db).findAll()
    .then(records => {
        db.sequelize.sync()
        .then(() => {
            for (var i in records) {
                eval("db." + selected_db).update({
                    state: eval("req.body.state" + records[i].id)
                },{where: {id: records[i].id}})
                //console.log("req.body.changed_" + eval("req.body.changed_" + records[i].id));
                if (eval("req.body.changed_" + records[i].id) == 1) {
                    //formから取得した住所を分割の上、以下よりデータベースに登録
                    var customer_data_1st = convertors.convertToJSON(eval("req.body.addr_1st_" + records[i].id), false);
                    var customer_data_2nd = convertors.convertToJSON(eval("req.body.addr_2nd_" + records[i].id), customer_data_1st.isAfterNum);
                    eval("db." + selected_db).update({
                        printed_name_1st: convertors.hanToZen(eval("req.body.name_1st_" + records[i].id)),
                        printed_name_2nd: convertors.hanToZen(eval("req.body.name_2nd_" + records[i].id)),
                        zip_code_1st: convertors.zenToHan(eval("req.body.zip_code_1st_" + records[i].id)),
                        zip_code_2nd: convertors.zenToHan(eval("req.body.zip_code_2nd_" + records[i].id)),
                        addr_name_1st: customer_data_1st.addr,
                        addr_num1_1st: customer_data_1st.addr_num1,
                        addr_num2_1st: customer_data_1st.addr_num2,
                        addr_num3_1st: customer_data_1st.addr_num3,
                        addr_num4_1st: customer_data_1st.addr_num4,
                        building_name_1st: customer_data_1st.building_name,
                        building_num_1st: customer_data_1st.building_num,
                        building_unit_1st: customer_data_1st.building_unit,
                        addr_name_2nd: customer_data_2nd.addr,
                        addr_num1_2nd: customer_data_2nd.addr_num1,
                        addr_num2_2nd: customer_data_2nd.addr_num2,
                        addr_num3_2nd: customer_data_2nd.addr_num3,
                        addr_num4_2nd: customer_data_2nd.addr_num4,
                        building_name_2nd: customer_data_2nd.building_name,
                        building_num_2nd: customer_data_2nd.building_num,
                        building_unit_2nd: customer_data_2nd.building_unit
                    },{where: {id: records[i].id}})
                }
            }
        })
        .then(records => {
            const promise_hagaki_maker = new Promise((resolve) => {
                PythonShell.run('program/makePreviewImage.py', { args: ["Customer", "red", ""] }, (err, result) => {
                    if (err) throw err;
                
                    console.log(result);
                    resolve("python finished");
                });
            }).then((resolve) => {
                eval("db." + selected_db).findAll()
                .then(records => {
                    console.log("select/selected");
                    //console.log(records);
                    var data = {
                        table_name_origin: selected_db,
                        records: records
                    }
                    res.render("select/selected", data)
                });
            });
        })
        .catch(err => {
            var data = {
                message: "データベースからレコードの取得に失敗しました。",
                resolution: "使用するデータベースを変更するか、以下のリンクより管理者に報告してください",
                url: "select/selected",
                err: err
            }
            res.render("general/database_error", data)
        });
    });
});

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

module.exports = router;
