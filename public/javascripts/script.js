"use strict";

console.log("script was read");

$(window).on("load resize", function(){
    console.log("footer fix");
    const window_height = $(window).height(); //画面の高さを取得
    const footer_height = $("footer").outerHeight(); //footerの枠線込みの高さを取得
    const footerposition = $("footer").offset();//footerの位置の高さを取得
    //footerの高さと位置の合計がウィンドウの高さに達していないとき
    if ( (footer_height + footerposition.top ) < window_height ) {
        $("footer").addClass("footer_fix"); //画面下固定用のクラスを付与
    } else {
        $("footer").removeClass("footer_fix"); //画面下固定用のクラスを付与
    }
});
