/**
 * @file indexServices
 * @author jingubang2008@126.com
 */

define(function () {
    return function ($http, $state) {
        return {
            getGoodsListByCategory: function(data){
                return $http({
                    method: "get",
                    url: basePath+"/goods",
                    params: data
                });
            },
            getCategoryList: function(data){
                return $http({
                    method: "get",
                    url: basePath+"/goods/types"
                });
            }
        };
    };
});
