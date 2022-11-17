var express = require("express");
var router = express.Router();

router.get("/session_out", (req, res, next) => {
    res.render("general/session_out");
});

router.get("/database_error", (req, res, next) => {
    var data = {
        message: "データベースからレコードの取得に失敗しました。",
        resolution: "使用するデータベースを変更するか、以下のリンクより管理者に報告してください",
        url: "select/selecting",
        err: "test_error",
    };
    res.render("general/database_error", data);
});

router.get("/question", (req, res, next) => {
    res.render("general/question");
});

module.exports = router;