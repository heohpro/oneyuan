/**
 * @file Services
 * @author zhangwei44@meituan.com
 */


define([
    'Services/indexServices',
    'Services/goodsServices',
    'Services/userServices'
], function (indexServices, goodsServices, userServices) {

    var services = {};

    services.indexServices = indexServices;  // 首页列表页相关内容
    services.goodsServices = goodsServices; // 商品详情页
    services.userServices = userServices;   // 客服工作平

    return services;
});
