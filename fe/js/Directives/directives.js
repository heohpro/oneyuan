'use strict';

define(function () {

    var directives = {};

    directives.uiButterbar = function ($rootScope, $anchorScroll) {
        return {
            restrict: "AC",
            template: '<span class="bar"></span>',
            link: function(scope, el, attrs) {
                el.addClass('butterbar hide');
                scope.$on('$stateChangeStart', function(event) {
                    $anchorScroll();
                    el.removeClass('hide').addClass('active');
                });
                scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState ) {
                    event.targetScope.$watch('$viewContentLoaded', function(){
                        el.addClass('hide').removeClass('active');
                    })
                });
            }
        };
    }

    directives.uiToggleClass = function ($timeout, $document) {
        return {
            restrict: 'AC',
            link: function(scope, el, attr) {
                el.on('click', function(e) {
                    e.preventDefault();
                    var classes = attr.uiToggleClass.split(','),
                            targets = (attr.target && attr.target.split(',')) || Array(el),
                            key = 0;
                    angular.forEach(classes, function( _class ) {
                        var target = targets[(targets.length && key)];
                        ( _class.indexOf( '*' ) !== -1 ) && magic(_class, target);
                        $( target ).toggleClass(_class);
                        key ++;
                    });
                    $(el).toggleClass('active');

                    function magic(_class, target){
                        var patt = new RegExp( '\\s' +
                                _class.
                                    replace( /\*/g, '[A-Za-z0-9-_]+' ).
                                    split( ' ' ).
                                    join( '\\s|\\s' ) +
                                '\\s', 'g' );
                        var cn = ' ' + $(target)[0].className + ' ';
                        while ( patt.test( cn ) ) {
                            cn = cn.replace( patt, ' ' );
                        }
                        $(target)[0].className = $.trim( cn );
                    }
                });
            }
        };
    }

    directives.uiScroll = function ($location, $anchorScroll) {
        return {
            restrict: 'AC',
            link: function(scope, el, attr) {
                el.on('click', function(e) {
                    $location.hash(attr.uiScroll);
                    $anchorScroll();
                });
            }
        };
    }

    directives.uiFullscreen = function () {
        return {
            restrict: 'AC',
            template:'<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
            link: function(scope, el, attr) {
                // el.addClass('hide');
                // uiLoad.load('js/libs/screenfull.min.js').then(function(){
                //     if (screenfull.enabled) {
                //         el.removeClass('hide');
                //     }
                //     el.on('click', function(){
                //         var target;
                //         attr.target && ( target = $(attr.target)[0] );
                //         el.toggleClass('active');
                //         screenfull.toggle(target);
                //     });
                // });
            }
        };
    }

    directives.uiNav = function ($rootScope, $anchorScroll, $timeout) {
        return {
            restrict: "AC",
            link: function(scope, el, attr) {
                var _window = $(window),
                _mb = 768,
                wrap = $('.app-aside'),
                next,
                backdrop = '.dropdown-backdrop';
                // unfolded
                el.on('click', 'a', function(e) {
                    next && next.trigger('mouseleave.nav');
                    var _this = $(this);
                    _this.parent().siblings( ".active" ).toggleClass('active');
                    _this.next().is('ul') &&  _this.parent().toggleClass('active') &&  e.preventDefault();
                    // mobile
                    _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.app-aside').removeClass('show off-screen') );
                });

                // folded & fixed
                el.on('mouseenter', 'a', function(e){
                    next && next.trigger('mouseleave.nav');
                    $('> .nav', wrap).remove();
                    if ( !$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb )) return;
                    var _this = $(e.target)
                    , top
                    , w_h = $(window).height()
                    , offset = 50
                    , min = 150;

                    !_this.is('a') && (_this = _this.closest('a'));
                    if( _this.next().is('ul') ){
                         next = _this.next();
                    }else{
                        return;
                    }

                    _this.parent().addClass('active');
                    top = _this.parent().position().top + offset;
                    next.css('top', top);
                    if( top + next.height() > w_h ){
                        next.css('bottom', 0);
                    }
                    if(top + min > w_h){
                        next.css('bottom', w_h - top - offset).css('top', 'auto');
                    }
                    next.appendTo(wrap);

                    next.on('mouseleave.nav', function(e){
                        $(backdrop).remove();
                        next.appendTo(_this.parent());
                        next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
                        _this.parent().removeClass('active');
                    });

                    $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next){
                        next && next.trigger('mouseleave.nav');
                    });

                });

                wrap.on('mouseleave', function(e){
                    next && next.trigger('mouseleave.nav');
                    $('> .nav', wrap).remove();
                });
            }
        };
    }

    directives.uiPager = function ($rootScope, $anchorScroll) {
        return {
            restrict: 'E',
            scope: {},
            controller: function ($scope) {

                var pagerConfig = {
                    itemsPerPage: 20,
                    text: {
                        first: '首页',
                        previous: '上一页',
                        next: '下一页',
                        last: '末页'
                    }
                };

                $scope.pages = [];

                $scope.currentPage = 0;
                $scope.totalPages = 1;
                $scope.totalItems = 0;
                $scope.pageOffset = 0;

                var initialized = false;

                $scope.$watch("totalItems", function () {

                    if($scope.currentPage === -1){
                        return;
                    };

                    if ($scope.totalItems % $scope.itemsPerPage == 0) {
                        $scope.totalPages = $scope.totalItems / $scope.itemsPerPage;
                    } else {
                        $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
                    }

                    if ($scope.totalPages == 0) {
                        $scope.totalPages = 1;
                    }

                    if (initialized) {
                        if ($scope.pageOffset > $scope.totalPages) {
                            $scope.pageOffset = 0;

                            if (($scope.currentPage < $scope.pageOffset)
                                || ($scope.currentPage >= $scope.pageOffset + $scope.pages.length)) {
                                $scope.currentPage = 0;
                            }
                        }
                    }
                    resetPageList();

                    initialized = true;

                    if ($scope.pages[$scope.currentPage - $scope.pageOffset]) {
                        $scope.pages[$scope.currentPage - $scope.pageOffset].active = true;
                    }


                    $scope.selectPage($scope.currentPage);
                });

                function getOffset(page) {
                    var offset = Math.min(page, $scope.totalPages - $scope.listSize);
                    if (offset < 0) {
                        offset = 0;
                    }

                    return offset;
                }

                function resetPageList() {
                    $scope.pages = [];

                    var last = Math.min($scope.pageOffset + $scope.listSize, $scope.totalPages);
                    for (var i = $scope.pageOffset; i < last; i++) {
                        $scope.pages.push({
                            text: i,
                            pageIndex: i,
                            active: false
                        });
                    }
                };

                $scope.getText = function (key) {
                    return pagerConfig.text[key];
                };

                $scope.isFirst = function () {
                    return $scope.currentPage <= 0;
                };

                $scope.isLast = function () {
                    return $scope.currentPage >= $scope.totalPages - 1;
                };

                $scope.selectPage = function (value) {
                    if ((value >= $scope.totalPages) || (value < 0)) {
                        return;
                    }

                    if ($scope.pages[$scope.currentPage - $scope.pageOffset]) {
                        $scope.pages[$scope.currentPage - $scope.pageOffset].active = false;
                    }

                    if ((value < $scope.pageOffset) || (value >= $scope.pageOffset + $scope.pages.length)) {
                        var offset = getOffset(value);
                        if (offset != $scope.pageOffset) {
                            $scope.pageOffset = offset;
                            resetPageList();
                        }
                    }

                    $scope.currentPage = value;

                    $scope.pages[$scope.currentPage - $scope.pageOffset].active = true;

                    $scope.$emit("pager:pageIndexChanged", $scope.pages[$scope.currentPage - $scope.pageOffset]);
                };

                $scope.first = function () {
                    if (this.isFirst()) {
                        return;
                    }
                    this.selectPage(0);
                };

                $scope.last = function () {
                    if (this.isLast()) {
                        return;
                    }
                    this.selectPage(this.totalPages - 1);
                };

                $scope.previous = function () {
                    if (this.isFirst()) {
                        return;
                    }
                    this.selectPage(this.currentPage - 1);
                };

                $scope.next = function () {
                    if (this.isLast()) {
                        return;
                    }
                    this.selectPage(this.currentPage + 1);
                };
            },
            link: function (scope, element, attrs) {
                scope.itemsPerPage = (attrs.itemsperpage - 0) || 10;
                scope.listSize = (attrs.listsize - 0) || 10;

                 attrs.$observe("pageno", function (value) {
                     scope.currentPage = value - 1;
                 });

                attrs.$observe("totalitems", function (value) {
                    scope.totalItems = value;
                });
            },
            templateUrl: baseUrl+'tpl/blocks/pager.html'
        };
    },
    directives.uiMap = function ($timeout, $document,$parse,Amap) {
        return {
            restrict: 'E',
            template: '<div id="map" style="width:100%;height:530px"></div>',
            link: function(scope, el, attr) {
                var eleMap = el.children();
                var longitude = attr.longitude;
                var latitude = attr.latitude;
                var regionCode = attr.regioncode;

                var windowsArr = new Array();
                var marker = new Array();

                Amap.promise.then(function(){
                    var mapObj = new AMap.Map(eleMap[0].id,{
                        resizeEnable: true,
                        view : new AMap.View2D({
                            zoom:17,
                            center:new AMap.LngLat(longitude,latitude)
                        })
                    });
                    function placeSearch(){
                        var Search;
                        AMap.service(["AMap.PlaceSearch"], function() {
                            Search = new AMap.PlaceSearch();  //构造地点查询类
                            //详情查询
                            Search.getDetails(regionCode, function(status, result){
                                if(status === 'complete' && result.info === 'OK'){
                                    placeSearch_CallBack(result);
                                }
                            });
                        });
                    }
                    placeSearch();
                    function placeSearch_CallBack(data){
                        var poiArr = data.poiList.pois;
                      ////添加marker
                        var lngX = poiArr[0].location.getLng();
                        var latY = poiArr[0].location.getLat();
                        var markerOption = {
                            map:mapObj,
                            icon:"http://webapi.amap.com/images/0.png",
                            position:new AMap.LngLat(lngX, latY)
                        };
                        var mar =new AMap.Marker(markerOption);
                        marker.push(new AMap.LngLat(lngX, latY));

                        //添加infowindow
                        var infoWindow = new AMap.InfoWindow({
                            content:"<h4><font color=\"#00a6ac\">&nbsp;&nbsp;" + poiArr[0].name +"</font></h4>"+TipContents(poiArr[0].type,poiArr[0].address,poiArr[0].tel,poiArr[0].citycode,poiArr[0].adcode,poiArr[0].postcode,poiArr[0].website,poiArr[0].email),
                            size:new AMap.Size(300,0),
                            autoMove:true,
                            offset:{x:0, y:-20}
                        });
                        windowsArr.push(infoWindow);
                        mapObj.setCenter(mar.getPosition());
                        var aa = function(e){infoWindow.open(mapObj,mar.getPosition());};
                        AMap.event.addListener(mar, "mouseover", aa);

                    }
                    function TipContents(type,address){  //信息窗体内容
                        if (type == "" || type == "undefined" || type == null || type == " undefined" || typeof type == "undefined") {
                            type = "暂无";
                        }
                        if (address == "" || address == "undefined" || address == null || address == " undefined" || typeof address == "undefined") {
                            address = "暂无";
                        }
                        var str ="&nbsp;&nbsp;地址：" + address + "<br />&nbsp;&nbsp;类型："+ type + " <br />";
                        return str;
                    }
                    el.html(mapObj.r);
                });
            }
        };
    }

    return directives;
});
