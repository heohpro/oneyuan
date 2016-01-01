'use strict';

/* Factories */

define([], function() {

    function initialize(app) {
        // 错误统一处理
        app.factory('errorProcessing', ['$rootScope','growl', function($rootScope, growl) {

            var errorProcessing = {
                response: function(response) {
                   //TODO response.config.headers["Content-Type"],不能通过这个接口判断
                   //TODO  所有的请求tpl的url都为tpl/..;而所有的后端请求都为/XX/XX

                    // 判断服务端请求结果
                    if(response.config.url.match(/^\//)){
                        // 无权限跳转处理
                        if(response.data.status == void 0){
                            $rootScope.$state.go("access.unauthorized");
                            return response;   // 跳转之后代码还会继续执行，故需要返回
                        }
                        // 错误处理
                        if (!response.data.status) {
                            growl.addErrorMessage(response.data.data);
                        }
                    }
                    return response;
                },
                responseError: function(error){
                    growl.addErrorMessage(error.status + "," + error.statusText);
                    return error;
                }
            };
            return errorProcessing;
        }]);
    }
    return {
        initialize: initialize
    };
});
