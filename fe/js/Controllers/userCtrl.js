/**
 * @file App
 * @author zhangwei44@meituan.com
 */



define(function () {
    return {
        "ctrlName": "AppCtrl",
        "ctrlFn": function ($scope, $state, $modal, $window, $rootScope, userServices, growl,$location) {
            // add 'ie' classes to html
            var isSmartDevice = function ($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            };

            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

            $scope.logoutUrl = basePath + '/admin/user/logout';
            $scope.basePath = basePath;
            // location.href = location.href.replace(location.search,"");
            $rootScope.username = '';

            $scope.app = {
                name: ' 供应链业务管理后台',
                signinname: '供应链业务管理后台',
                version: 'v0.4.2.1',
                ver: window.ver,
                settings: {
                    // headerFixed: !0,
                    // asideFixed: !0,
                    // asideFolded: !1,
                    // asideDock: !1,
                    // container: !1
                    themeID: 1,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: false,
                    asideFolded: false
                }
            };

            // check login
            //userServices.getUser().then(
            //    function (responses) {
            //        // 无权限跳转处理
            //        if(responses.data.status == void 0){
            //            $state.go("access.unauthorized");
            //            return;   // 跳转之后代码还会继续执行，故需要返回
            //        }
            //        if (!responses.data.status) {
            //            growl.addErrorMessage(responses.data.data);
            //        } else {
            //            var menus = responses.data.data.menus, // 权限模块列表
            //                allState = $state.get(), // 所有路由
            //                stateName = ""; // 路由名称
            //            $scope.appMenu = {}; // 获取权限菜单对象列表
            //            for (var i = 0; i < menus.length; i++) {
            //                var menuList = [],   // 获取二级菜单对象列表
            //                    obj = {};
            //                for (var j = 0; j < menus[i].menus.length; j++) {
            //                    stateName = "app." + menus[i].url.slice(1) + "." + menus[i].menus[j].url.slice(1); //路由名称：app.一级.二级
            //                    obj = getMenuByUrl(allState, stateName, menus[i].menus[j].title);  // 根据url查询路由信息
            //                   if(obj){
            //                       menuList.push(obj);
            //                   }
            //                }
            //                $scope.appMenu[menus[i].url.slice(1)] = {"list": menuList};  //封装对象，以一级菜单为对象key进行存储
            //            }
            //            $rootScope.username = responses.data.data.name;
            //        }
            //    },
            //    function (error) {
            //        growl.addErrorMessage(error.status + ',' + error.statusText);
            //    }
            //);
            //
        }
    };
});
