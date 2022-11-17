"use strict";

exports.separateStrings = function(input_str) {
    var splited_str = new Array(2);
    if( input_str.indexOf("区") != -1){
        //文字列が「区」を含む場合の処理。「区」で分割。
        splited_str = input_str.split("区");
        splited_str[0] = splited_str[0] + "区";
    } else {
        //文字列が「区」を含まない場合の処理。「市」で分割。
        splited_str = input_str.split("市");
        splited_str[0] = splited_str[0] + "市";
    };
    var data = new Array(2);
    data[0] = this.convertToJSON(splited_str[0], false);
    data[1] = this.convertToJSON(splited_str[1], data[0].isContainNum);
    return data;
};

exports.convertToJSON = function(input_str, isAfterNum) {
    //console.log("convertToJSON");
    var data = {
        "addr": null,
        "addr_num1": null,
        "addr_num2": null,
        "addr_num3": null,
        "addr_num4": null,
        "building_name": null,
        "building_num": null,
        "building_unit": null,
        "isAfterNum": isAfterNum,
    };

    //console.log("input_str before ");
    if( input_str == null || input_str == "" ) {
        //console.log("input_str was null " + data.isAfterNum);
        return data;
    };
    //console.log("input_str after ");

    var converted_str = this.zenToHan(input_str).replace(/ /g, "");

    if (!isAfterNum) { //番号の処理が終わっていた場合、建物名と地名の区別がつかない為、その仕分け。
        var [addr_name, addr_num_and_building_temp] = this.split_null(converted_str, /[0-9]/); //番号により町名以前とX丁目以降を分割
    } else {
        var [addr_name, addr_num_and_building_temp] = [null, converted_str];
    };
    //console.log("passed1");

    if (addr_num_and_building_temp == null) {
        data.addr = addr_name;
        return data;
    }
    //console.log("passed2");

    addr_num_and_building_temp = addr_num_and_building_temp.replace("丁目", "-").replace("番地", "-").replace("番", "-"); //住所の漢字表現をハイフンに置き換え　.replace("号", "")はXX号室と混ざるため削除

    if (!isAfterNum) {
        var [nums_temp, building_temp] = this.split_null(addr_num_and_building_temp, /[^0-9-]/); //番号とハイフン以外によりX丁目以前と建物名を分割
        data.isAfterNum = true;
    } else {
        var [nums_temp, building_temp] = [null, addr_num_and_building_temp];
    };
    //console.log("passed3");

    var nums = new Array(4).fill(null)
    if (nums_temp != null){
        var nums = nums_temp.split("-");
        if (nums[(nums.length)-1] == ""){
            nums[nums.length-1] = null; //丁目などで終わった際に配列の末尾がemptyになるのを防ぐため
        };
        for (var i=(nums.length); i<4; i++){
            nums[i] = null; //余った個所をnullで穴埋め
        };
    };
    //console.log("passed4");
        
    if (building_temp != null) {
        //console.log("passed_building_temp");
        //console.log(building_temp);
        var [building_name, building_num_and_unit_temp] = this.split_null(building_temp, /[0-9]/); 
        //console.log(building_num_and_unit_temp);
        var [building_num, building_unit] = this.split_null(building_num_and_unit_temp, /[^0-9a-zA-Z]/);
        
    } else {
        var building_name = null;
        var building_num = null;
        var building_unit = null;
    };
    //console.log("passed5");
    
    
    data.addr = addr_name;
    data.addr_num1 = nums[0];
    data.addr_num2 = nums[1];
    data.addr_num3 = nums[2];
    data.addr_num4 = nums[3];
    //console.log("passed5_1");
    data.building_name = this.hanToZen(building_name);
    //console.log("passed5_2");
    data.building_num = building_num;
    data.building_unit = this.hanToZen(building_unit);
    //console.log("passed6");

    return data;
};

exports.zenToHan = function(input_str) { //変換は英数記号に限る
    if(input_str == null || input_str == ""){
        return null
    };
    var han_str = input_str.replace(/[！-～]/g,
    function( selected_str ) {
        return String.fromCharCode( selected_str.charCodeAt(0) - 0xFEE0 );
    });
   
    //文字の例外処理
    return han_str.replace(/”/g, "\"")
    .replace(/’/g, "'")
    .replace(/‘/g, "`")
    .replace(/￥/g, "\\")
    .replace(/　/g, " ")
    .replace(/〜/g, "~")
    .replace(/―/g, "-")
    .replace(/‐/g, "-")
    //.replace(/ー/g, "-"); 顧客の名称や建物の名称に長音記号が含まれる場合に不適切。
};

exports.hanToZen = function(input_str) { //変換は英数記号に限る
    if(input_str == null || input_str == ""){
        return null
    };
    var zen_str = input_str.replace(/[!-~]/g,
    function( selected_str ) {
        return String.fromCharCode( selected_str.charCodeAt(0) + 0xFEE0 );
    });

    //文字の例外処理
    return zen_str.replace(/\"/g, "”")
    .replace(/'/g, "’")
    .replace(/`/g, "‘")
    .replace(/\\/g, "￥")
    .replace(/~/g, "〜")
    .replace(/-/g, "ー");
    //.replace(/ー/g, "-"); 顧客の名称や建物の名称に長音記号が含まれる場合に不適切。
};

exports.split_null = function(split_str, key_str){ //この関数内で半角への返還は行わないので事前に行うこと

    var data = new Array(2);

    var index_first_num = split_str.search(key_str);
    console.log("index_first_num:"+ index_first_num);

    if (index_first_num == 0){ //前半分が空欄の場合の対処
        //str.searchの戻り値は""(空白)であるため、データベースに準拠してnullを代入。
        data[0] = null;
        data[1] = split_str.substr(index_first_num)
    } else if (index_first_num == -1) { //後半分が空欄の場合の対処
        data[0] = split_str
        data[1] = null;
    } else {
        data[0] = split_str.substr(0, index_first_num)
        data[1] = split_str.substr(index_first_num)
    };

    return data
}

//以下のコードは一時的な検証用。リリース時は削除してOK

exports.checkingNumber = function(input_str) {
    var converted_str = this.zenToHan(input_str);
    var index_first_num = converted_str.search(/[0-9]/); //番号により町名以前とX丁目以降を分割
    console.log(index_first_num);
    var addr_name = converted_str.substr(0, index_first_num-1);
    if (addr_name == ""){
        addr_name = null;
    }
    console.log(addr_name);
    if (addr_name == null){
        console.log("addr_name is null")
    } else if (addr_name == ""){
        console.log("addr_name is empty")
    };
    var addr_num_and_building_temp = converted_str.substr(index_first_num);
    console.log(addr_num_and_building_temp);
};