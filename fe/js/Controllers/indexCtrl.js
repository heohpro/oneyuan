/**
 * @file purchaseApprovalCtrl
 * @author heqingyang@meituan.com
 */

define(function () {
    return {
        "ctrlName": "purchaseListCtrl",
        "ctrlFn": function ($scope, $modal, growl,$filter, procurementServices,$stateParams) {

            $scope.type = $stateParams.categoryId;
            $scope.pages = {};
            $scope.pages.pageNo = 1;
            $scope.pages.pageSize = 20;
            $scope.goods = [];

            var getList = function ($scope) {
                growl.addInfoMessage("数据加载中...");
                var data = {};
                data.pageNo = $scope.pages.pageNo;
                data.pageSize = $scope.pages.pageSize;
                data.typeCode = $scope.type;
                procurementServices.getCategoryDetail(data).then(
                    function (responses) {
                        if (!responses.data.status) {
                            growl.addErrorMessage(responses.data.data);
                        } else {
                            var resPageData = responses.data.data;
                            if(resPageData.pageContent && resPageData.pageContent.length){
                                $scope.goods = resPageData.pageContent;

                                $scope.pages.pageNo = resPageData.page.currentPageNo;
                                $scope.pages.pageSize = resPageData.page.pageSize;
                                $scope.pages.count = resPageData.page.totalCount;
                                $scope.pages.pageNum = resPageData.page.totalPageCount;

                                growl.addSuccessMessage("加载完成");
                            }else{
                                $scope.purchases = [];
                                $scope.pages.pageNo = 1;
                                $scope.pages.count = 0;
                                $scope.pages.pageNum = 0;
                                growl.addSuccessMessage("没有数据");
                            }
                        }
                    },
                    function (error) {
                        growl.addErrorMessage(error.status + ',' + error.statusText);
                    }
                );
            };
            getList($scope);

            $scope.$on("pager:pageIndexChanged", function (event, args) {
                event.stopPropagation();
                if ((args.pageIndex + 1) != $scope.pages.pageNo) {
                    $scope.pages.pageNo = args.pageIndex + 1;
                    getList($scope);
                }
            });

            // tab切换事件
            $scope.changeStatus = function(flag){

                $scope.type = flag;
                getList($scope);
            };

            //查看预览
            $scope.view = function(item) {
                $modal.open({
                    templateUrl: baseUrl + 'tpl/modal/purchaseList_view_modal.html?v=' + ver,
                    controller: function ($scope, $modalInstance) {
                        $scope.title = "订货单";
                        procurementServices.getPurchaseDetail(item.id).then(
                            function (responses) {
                                if (!responses.data.status) {
                                    growl.addErrorMessage(responses.data.data);
                                } else {
                                    var resPageData = responses.data.data;
                                    $scope.purchase = resPageData;
                                    $scope.purchase.skus = $scope.purchase.goodsList;
                                    angular.forEach($scope.purchase.skus,function(sku){
                                        var total = 0;
                                        angular.forEach(sku.storeItems,function(item){
                                            if(item.actualQty){
                                                total += parseInt(item.actualQty);
                                            }
                                        });
                                        sku.qty = total;
                                    });
                                    growl.addSuccessMessage("加载完成");
                                }
                            },
                            function (error) {
                                growl.addErrorMessage(error.status + ',' + error.statusText);
                            }
                        );
                        $scope.cancel = function(){
                            $modalInstance.dismiss();
                        }

                    }
                })
            }

            //直接发起审批
            $scope.publish = function(item){
                var data = {};
                data.poId = item.id;
                procurementServices.publishPurchase(data).then(
                    function (responses) {
                        if (!responses.data.status) {
                            growl.addErrorMessage(responses.data.data);
                        } else {
                            var resPageData = responses.data.data;
                            growl.addSuccessMessage("发起成功！");
                            getList($scope);
                        }
                    },
                    function (error) {
                        growl.addErrorMessage(error.status + ',' + error.statusText);
                    }
                );
            }

            //导出采购单 - 直接导出
            $scope.export = function(item){
                var data = {};
                data.poId = item.id;
                window.open('/admin/pms/po/downloadPo?poId='+data.poId);
            }

            //导出采购单 - 时间段
            $scope.exportPeriod = function(){
                $modal.open({
                    templateUrl: baseUrl + 'tpl/modal/purchase_download_modal.html?v=' + ver,
                    controller: function ($scope, $modalInstance) {
                        $scope.modalBodyText = "导出采购单";
                        $scope.download = {};
                        procurementServices.getSupplierList().then(
                            function (responses) {
                                if (!responses.data.status) {
                                    growl.addErrorMessage(responses.data.data);
                                } else {
                                    var resPageData = responses.data.data;
                                    $scope.suppliers = resPageData;
                                    growl.addSuccessMessage("加载完成");
                                }
                            },
                            function (error) {
                                growl.addErrorMessage(error.status + ',' + error.statusText);
                            }
                        );

                        // 初始化时间组件
                        $scope.today = function () {
                            //$scope.endTime = $scope.endTime || {};
                            $scope.download = $scope.download || {};
                            $scope.download.endTime = ($scope.download.endTime)?  new Date($scope.download.endTime):new Date();
                            $scope.download.startTime = ($scope.download.startTime)?  new Date($scope.download.startTime):new Date();
                        };
                        $scope.today();
                        $scope.openStatus = {};
                        $scope.open = function ($event, id) {
                            event.preventDefault();
                            event.stopPropagation();
                            if(id==1){
                                $scope.openStatus.start = true;
                            }else{
                                $scope.openStatus.end = true;
                            }
                        };
                        $scope.dateOptions = {
                            formatYear: 'yy',
                            startingDay: 1,
                            showWeeks: false
                        };

                        $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                        $scope.format = $scope.formats[0];

                        啦啦啦

                        var tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        var afterTomorrow = new Date();
                        afterTomorrow.setDate(tomorrow.getDate() + 2);
                        $scope.events =
                            [
                                {
                                    date: tomorrow,
                                    status: 'full'
                                },
                                {
                                    date: afterTomorrow,
                                    status: 'partially'
                                }
                            ];

                        $scope.getDayClass = function (date, mode) {
                            if (mode === 'day') {
                                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                                for (var i = 0; i < $scope.events.length; i++) {
                                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                                    if (dayToCheck === currentDay) {
                                        return $scope.events[i].status;
                                    }
                                }
                            }
                            return '';
                        };



                        //确认导出采购单
                        $scope.ok = function(){
                            if($scope.download.endTime<$scope.download.startTime){
                                growl.addErrorMessage("结束时间必须晚于起始时间！");
                            }else{
                                var data = {};
                                data.brandId = $scope.download.supplier.brandId;
                                data.endDay = $filter('date')($scope.download.endTime,'yyyy-MM-dd');
                                data.startDay = $filter('date')($scope.download.startTime,'yyyy-MM-dd');
                                procurementServices.downloadPeriod(data).then(
                                    function (responses) {
                                        if(responses){
                                            if(responses.data.status==0){
                                                growl.addErrorMessage(responses.data.data);
                                            }else{
                                                window.open('/admin/pms/po/batchDownloadPo?brandId='+data.brandId+'&startDay='+data.startDay+'&endDay='+data.endDay);
                                                growl.addSuccessMessage("下载成功！");
                                            }
                                        }
                                    },
                                    function (error) {
                                        growl.addErrorMessage(error.status + ',' + error.statusText);
                                    }
                                );
                            }

                        }

                        $scope.cancel = function(){
                            $modalInstance.dismiss();
                        }
                    }
                })
            }
        }
    }
});
