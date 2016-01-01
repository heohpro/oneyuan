'use strict';

/* Filters */

define([], function() {

    function initialize(app) {
        app.filter('property', function (){
            return function (items, input){
                if(input !== undefined){
                    var arr = [];
                    $.each(items, function (key, value){

                        var v = value.join();

                        if(key.indexOf(input)> -1 && v.indexOf(input)> -1){
                            arr.push(this);
                        }
                    });

                    return arr;
                }else{
                    return items;
                }
            }
        });
        app.filter('shopNameFilter', function () {
            return function (item,input) {
                var arr = [],search = new RegExp(input,'ig');
                angular.forEach(item,function (val,index) {
                    if(search.test(val.shopName)){
                        arr.push(val.shopName);
                    }
                });
                return arr;
            }
        });
        app.filter('userType',function(){
            return function(input){
                var content="";
                switch(input){
                    case 0 :
                        content = "普通用户";
                        break;
                    case 1 :
                        content = "管理员用户";
                        break;
                }
                return content;
            }
        });
        app.filter('defalutContent',function(){
            return function(input){
                return (input==''||input==null)? '无':input
            }
        });
        app.filter('decodeConfigValue', function () {
            return function (item) {
                return decodeURIComponent(item);
            }
        });
        app.filter('characters', function () {
            return function (input,chars,breakOnWord) {
                if (isNaN(chars)) return input;
                if (chars <= 0) return '';
                if (input && input.length > chars) {

                    //中文字符用**替换
                    var _input = input.replace(/[^\x00-\xff]/g,"**");
                    _input =  _input.substring(0, chars);
                    _input = _input.replace(/\u002A\u002A/g,"*");
                    var len = _input.length;
                    input = input.substring(0, len);

                    if (!breakOnWord) {
                        var lastspace = input.lastIndexOf(' ');
                        //get last space
                        if (lastspace !== -1) {
                            input = input.substr(0, lastspace);
                        }
                    }else{
                        while(input.charAt(input.length-1) === ' '){
                            input = input.substr(0, input.length -1);
                        }
                    }
                    return input + '…';
                }
                return input;
            };
        });
        // 售卖价计算
        app.filter('calculateValue', function () {
            return function (item) {
                var arr = item.split(' ');
                if(arr[0] && arr[1] && arr[1]!= "null"){
                    return (parseFloat(arr[0]) * (parseFloat(arr[1])*0.01 + 1 )).toFixed(2);
                }
            }
        });
        // 毛利计算
        app.filter('calculateGross', function () {
            return function (item) {
                var arr = item.split(' ');
                // 毛利计算公式:(售卖价-成本价)/成本价
                if (arr[0] && arr[1] && arr[0] >= 0 && arr[1] >= 0) {
                    return (((arr[1] - arr[0]) / arr[0]) * 100).toFixed(1) + "%";  //百分比格式，保留1位小数
                }
            }
        });
        // 出库单状态
        app.filter('outboundStatus', function () {
            return function (outboundStatus) {
                if (outboundStatus === 1) {
                    return '草稿';
                } else if (outboundStatus === 2) {
                    return '出库中';
                } else {
                    return '出库完成';
                }
            }
        });
    }
    return {
        initialize: initialize
    };
});
