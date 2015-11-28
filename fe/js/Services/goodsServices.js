/**
 * @file goodsServices
 * @author heqingyang@meituan.com
 */

define(function () {
    return function ($http, $state) {
        return {
            getGoodsDetail: function(goodsId){
                return $http({
                    method: "get",
                    url: basePath+"/goods/"+goodsId,
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
