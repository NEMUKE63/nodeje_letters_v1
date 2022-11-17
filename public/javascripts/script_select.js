"use strict";

console.log("script_select was read");

$(".hagaki_pic" + ".clickable").on("click", function(){
    console.log("clicked item");
    var type = Number($(this).siblings("input:radio:checked").val());
    console.log(type);
    switch(type){
        case 1:
            $(this).siblings("input:radio[value='2']").prop("checked", true);
            console.log("1 clicked");
            break;
        case 2:
            $(this).siblings("input:radio[value='3']").prop("checked", true);
            console.log("2 clicked");
            break;
        case 3:
            $(this).siblings("input:radio[value='1']").prop("checked", true);
            console.log("3 clicked");
            break;
    }
});

$(".customer_name" + ".editable").on("click", function(){
    console.log("clicked customer_name");
    $(this).toggleClass("active");
    $(this).nextAll(".separate_line").toggleClass("active");
    $(this).nextAll(".text_editter").slideToggle(500);
});

$(".zip_code_1st,.zip_code_2nd,.name_1st,.name_2nd,.addr_1st,.addr_2nd").on("input", function(event){
    //console.log("ipput was actibated.");
    //console.log($(this).val());
    //console.log($(this).get(0).defaultValue);
    if ($(this).val() === $(this).get(0).defaultValue){
        $(this).nextAll(".changed").val("0");
        //console.log("ipput if");
        console.log($(this).parents(".item").find("img").attr("src"));
        console.log($(this).parents(".item").attr("id"));
        console.log("../images/hagaki_red_back/hagaki" + $(this).parents(".item").attr("id") + ".png")
        $(this).parents(".item").find("img").attr("src", ("../images/tables/Customer/hagaki_red_back/hagaki" + $(this).parents(".item").attr("id") + ".png"));
    } else {
        $(this).nextAll(".changed").val("1");
        //console.log("ipput else");
        $(this).parents(".item").find("img").attr("src", "../images/general/changed.png");
    };
});

$(".file_printer_btns.letters .print").on("click", function(){
    //prgram to print letters
});

$(".file_printer_btns.letters .download").on("click", function(){
    //prgram to dounload letters
});

$(".file_printer_btns.test .print").on("click", function(){
    //prgram to print test
});

$(".file_printer_btns.test .download").on("click", function(){
    //prgram to download test
});
