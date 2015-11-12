/**
 * @file indexServices
 * @author jingubang2008@126.com
 */

define(function () {
    return function ($http, $state) {
        return {
            getCategoryList: function(){
                return $http({
                    method: "get",
                    url: basePath+"/goods/types",
                });
            },
            getCategoryDetail: function(data){
                return $http({
                    method: "get",
                    url: basePath+"/goods/types",
                    params: data
                });
            }
        };
    };
});
