// for global url
window.basePath = '';
window.baseUrl = '';
window.ver = '2015102012';

// Require JS  Config File

require.config({
    urlArgs: ver,
    paths: {
        //'angular'       : 'lib/angular1.3.5/angular.min',
        'angular'       : 'lib/angular/angular.min',
        'jquery'        : 'lib/jquery/dist/jquery',
        'jquery-ui'     : 'lib/jquery-ui/jquery-ui',
        'ui.router'     : 'lib/angular-ui-router/release/angular-ui-router',
        'ui.select'     : 'lib/angular-ui-select/dist/select.min',
        'ui.bootstrap'  : 'lib/angular-bootstrap/ui-bootstrap.min',
        //'ui.bootstrap'  : 'lib/angular-bootstrap2/ui-bootstrap.min',
        'ui.bootstrap.tpls':'lib/angular-bootstrap/ui-bootstrap-tpls.min',
        //'ui.bootstrap.tpls':'lib/angular-bootstrap2/ui-bootstrap-tpls.min',
        'ngAnimate': 'lib/angular-animate/angular-animate.min',
        //'ngAnimate': 'lib/angular1.3.5/angular-animate.min',
        'angular-growl': 'lib/angular-growl/build/angular-growl.min',
        // 'angular-translate': 'lib/angular-translate/angular-translate.min',
        'ngSanitize': 'lib/angular-sanitize/angular-sanitize.min',
        //'ngSanitize': 'lib/angular1.3.5/angular-sanitize.min',
        'screenfull': 'lib/screenfull/dist/screenfull',
        'ngFileUpload': 'lib/ng-file-upload/ng-file-upload',
        'ngLocale' : 'lib/angular-i18n/angular-locale_zh-cn',
        'l42y.amap': 'lib/angular-amap/angular-amap',
        'ui.sortable': 'lib/angular-ui-sortable/sortable'
    },
    shim: {
        'angular': {
            'deps': ['jquery'],
            'exports': 'angular'
        },
        'ngAnimate': {
            'deps': ['angular']
        },
        'angular-translate': {
            'deps': ['angular']
        },
        'ui.router': {
            'deps': ['angular']
        },
        'ui.select': {
            'deps': ['angular']
        },
        'ui.bootstrap.tpls': {
            'deps': ['angular']
        },
        'ui.bootstrap': {
            'deps': ['ui.bootstrap.tpls']
        },
        'angular-growl': {
            'deps': ['angular']
        },
        'ngSanitize': {
            'deps': ['angular']
        },
        'ngFileUpload':{
            'deps':['angular']
        },
        'ngLocale':{
            'deps':['angular']
        },
        'l42y.amap':{
            'deps':['angular']
        },
        'ui.sortable':{
            'deps':['angular','jquery-ui']
        }
    }
});


require(["app"], function(App) {
        App.initialize();
    }
);
