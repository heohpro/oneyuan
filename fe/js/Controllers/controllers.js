/**
 * @file Controllers
 * @author zhangwei44@meituan.com
 */



define([
    'Controllers/AppCtrl',
    'Controllers/indexCtrl',
    'Controllers/goodsCtrl',
    'Controllers/userCtrl'
], function (AppCtrl, indexCtrl, goodsCtrl, userCtrl) {
    var initialize = function (app) {
        app.controller(AppCtrl.ctrlName, AppCtrl.ctrlFn);
        app.controller(indexCtrl.ctrlName, indexCtrl.ctrlFn);  // 首页列表页
        app.controller(goodsCtrl.ctrlName, goodsCtrl.ctrlFn);  // 商品详情页
        app.controller(userCtrl.ctrlName, userCtrl.ctrlFn); // 用户信息页
    };

    return {
        initialize: initialize
    };
});
