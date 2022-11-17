"use strict"

$("body").on("dragover", function(event){
    event.preventDefault();
    //please write the program in case that a file grag on
});

$("#file_uploader").on("dragover", function(event){
    event.preventDefault();
    //please write the program in case that a file grag on
});

$("body").on("dragleave", function(event){
    event.preventDefault();
    //please write the program in case that a file grag leave
});

$("#file_uploader").on("dragleave", function(event){
    event.preventDefault();
    //please write the program in case that a file grag leave
});

$("#file_uploader").on("drop", function(event){
    var  org_event = event;
    if (event.originalEvent){
        org_event = event.originalEvent
    }

    org_event.preventDefault();
    uploaded_file.files = org_event.dataTransfer.files;
    console.log(uploaded_file.files.name);
    //please write the program in case that a file grag on
});

$("#delete_file").on("click", function(){ //<button type="button" id="delete_file"></button>
    $("#uploaded_file").val(null);
    //please write program to delete file_icon
});

$(".file_selector_item a").hover(
    function(){
        $(this).children("img").addClass("hover");
    },
    function(){
        $(this).children("img").removeClass("hover");
    }
);

$(".cookie_btn").on("click", function(){
    $(this).parents(".agree_cookie_base").toggleClass("closed");
    $(this).delay(1000).queue(function(){
        $(this).parents(".agree_cookie_base").toggleClass("none");
    });
    
});