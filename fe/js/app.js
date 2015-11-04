define(
    ["angular",
        "Services/services",
        "Directives/directives",
        "Filters/filters",
        "Factories/factories",
        "Controllers/controllers",
        "ui.router",
        "ui.select",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "ngAnimate",
        "ngSanitize",
        "angular-growl",
        "ngFileUpload",
        "ngLocale",
        "l42y.amap",
        "ui.sortable"
    ],
    function (angular, Services, Directives, Filters, Factories, Controllers) {
        var initialize = function () {

            var app = angular.module("shopApp", ['ui.router', 'ui.select', 'ui.bootstrap', 'ui.bootstrap.tpls', 'angular-growl', 'ngSanitize', 'ngAnimate', 'ngFileUpload', "ngLocale","l42y.amap", "ui.sortable"]);

            app.config(['growlProvider', function (growlProvider) {
                growlProvider.onlyUniqueMessages(true);
                growlProvider.globalTimeToLive(3000);
            }]);

            // 配置错误统一处理拦截器
            //app.config(['$httpProvider', function($httpProvider) {
            //    $httpProvider.interceptors.push('errorProcessing');
            //}]);

            app.config(['AmapProvider', function (AmapProvider) {
                AmapProvider.config = {
                    key:'0edad6a52f7aea959910417d48b4d60b', // Amap API key, see http://api.amap.com/key
                    version: '1.3' // which Amap API version to use, see http://lbs.amap.com/api/javascript-api/changelog/
                };
            }]);

            app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }]);

            function configureTemplateFactory($provide) {
                // Set a suffix outside the decorator function
                var cacheBuster = window.ver;

                function templateFactoryDecorator($delegate) {
                    var fromUrl = angular.bind($delegate, $delegate.fromUrl);
                    $delegate.fromUrl = function (url, params) {
                        if (url !== null && angular.isDefined(url) && angular.isString(url)) {
                            url += (url.indexOf("?") === -1 ? "?" : "&");
                            url += "v=" + cacheBuster;
                        }

                        return fromUrl(url, params);
                    };

                    return $delegate;
                }

                $provide.decorator('$templateFactory', ['$delegate', templateFactoryDecorator]);
            }

            app.config(['$provide', configureTemplateFactory]);

            app.config(function ($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: baseUrl + 'tpl/app.html'
                    })
                    .state('app.index', {
                        url: "/index",
                        templateUrl: baseUrl + 'tpl/index.html'
                    })
                    //首页列表页

                    //.state('app.procurement.uploadPurchase',{
                    //    url: '/addpurchase/:purchaseId',
                    //    templateUrl: baseUrl + 'tpl/purchase_upload.html',  // 发起采购对应模版
                    //    params:{
                    //        purchaseId:0,
                    //        obj: {}
                    //    }
                    //})




                $urlRouterProvider.otherwise("/app/index");

            });


            Filters.initialize(app);
            Factories.initialize(app);

            app.factory(Services);
            app.directive(Directives);
                // controller initialize
            Controllers.initialize(app);

            angular.bootstrap(document, ["shopApp"]);

        };
        return {
            initialize: initialize
        };
    });
