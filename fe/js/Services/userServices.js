/**
 * @file dcServices
 * @author penglu02@meituan.com
 */

define(function () {
    return function ($http, $state) {
        return {
            getData: function(){
                return $http({
                    method: "post",
                    url: basePath+"/admin/dc/dcuploadlist",
                    data:{}
                });
            },
            deleteRule: function(id,type){
                return $http({
                    method: "post",
                    url: basePath+"/admin/dc/delete",
                    data: {"batchId":id,"fileType":type}
                });
            },
            newRebateRule: function (promotion,rule){
                return $http({
                    method: "post",
                    url: basePath+"/admin/promoRule/shareRebate/add",
                    data: {
                        "promoBegin": promotion.promoBegin,
                        "promoEnd": promotion.promoEnd,
                        "promoName": promotion.promoName,
                        "rule": {
                            "couponEndDate": rule.couponEndDate,
                            "couponBeginDate": rule.couponBeginDate,
                            "couponId": rule.couponId,
                            "couponMoney": rule.couponMoney,
                            "ruleDesc": encodeURIComponent(rule.ruleDesc),
                            "shareDesc": rule.shareDesc,
                            "shareImage": rule.shareImage,
                            "shareTitle": rule.shareTitle,
                            "validDays": rule.validDays
                        }
                    }
                })
            }
        };
    };
});
