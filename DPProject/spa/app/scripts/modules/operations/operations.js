"use strict";

angular
    .module('app.operations', [])
    .controller('OperationsController', [
        '$http', '$scope', '$rootScope', 'sweetAlert', 'operationsService', 'NgTableParams', '$modal', '$resource', '$timeout', '$filter', '$interval',
        function ($http, $scope, $rootScope, sweetAlert, service, NgTableParams, $modal, $resource, $timeout, $filter, $interval)
        {
            $scope.periods = service.getPeriods();
            $rootScope.periodDate = _.find($scope.periods, { key: moment().startOf('month').format('MM/DD/YYYY') });

            $rootScope.getGridEl = function (n) {
                return angular.element($('.' + n + '-table')[0]);
            };

            $rootScope.getGrid = function (n) {
                return $rootScope.getGridEl(n).scope()[ n + 'Params' ];
            }

            $rootScope.getDataSet = function (n) {
                return $rootScope.getGrid(n).settings().dataset;
            };

            $scope.sum = function sum(data, field) {
                var x = _.sumBy(data, field);
                return x;
            };

            $rootScope.recalcSalesTotal = function () {
                var gridScope = $rootScope.getGridEl('sales').scope();
                var dataset = $rootScope.getDataSet('sales');
                $rootScope.totalSalesAmount = gridScope.sum(dataset, 'amount');
            };

            $scope.reloadPurchasesGrid = function () {
                var Purchases = $resource('api/Journal/purchases', null, {
                    list: { method: 'POST' }
                });
                Purchases.list({
                    page: 1,
                    count: 10,
                    week: $rootScope.week.toString().replace(/\ /g, '')
                }).$promise.then(function (data) {
                    $scope.purchasesParams = new NgTableParams({
                        // initial grouping
                        group: "date"
                    }, {
                        dataset: data.purchasesList
                    });
                    $rootScope.totalPurchasesAmount = $scope.sum(data.purchasesList, 'amount');
                });
            };

            // Added by Yordano
            $scope.reloadSalesGrid = function () {
                var Sales = $resource('api/Journal/sales', null, {
                    list: { method: 'POST' }
                });
                Sales.list({
                    page: 1,
                    count: 10,
                    week: $rootScope.week.toString().replace(/\ /g, '')
                }).$promise.then(function (data) {
                    $scope.salesParams = new NgTableParams({
                        // initial grouping
                        group: 'customerGroup'
                    }, {
                        dataset: data.saleList
                    });
                    function isLastPage() {
                        return $scope.salesParams.page() === totalPages();
                    }
                    function totalPages() {
                        return Math.ceil($scope.salesParams.total() / $scope.salesParams.count());
                    }
                    $rootScope.totalSalesAmount = $scope.sum(data.saleList, 'amount');
                    $scope.isLastPage = isLastPage;
                });
            };

            $scope.getWeekDate = function (_month, week) {
                $rootScope.week = $scope.weeksOfMonth[week].value;

                $rootScope.today = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
                $rootScope.minDate = $filter('date')($rootScope.week.split(' - ')[0],
                    'MM-dd-yyyy');
                $rootScope.maxDate = $filter('date')($rootScope.week.split(' - ')[1],
                    'MM-dd-yyyy');

                // Tomado de el fuente de Homer donde explica el datepicker
                $rootScope.datesDisabled = function (date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
                };

                $rootScope.dateOptions = {
                    formatYear: 'yyyy',
                    startingDay: 1
                };

                // Tomado de el fuente de Homer donde explica el datepicker
                $rootScope.openCal = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $rootScope.calOpened = true;
                };

                $scope.reloadSalesGrid();
                $scope.reloadPurchasesGrid();
            };

            $scope.getWeeksOfMonth = function () {
                $scope.weeksOfMonth = service.getWeeksOfMonth($rootScope.periodDate.key);
                $scope.getWeekDate($rootScope.periodDate.key, 0);
            };
            $scope.getWeeksOfMonth();

            $rootScope.toolBar = {
                visible: true,
                subTitle: "Operaciones",
                subTitleDesc: "Administrador de operaciones diarias.",
                optionToolbar: [{
                    type: "select",
                    label: "Periodo",
                    data: $scope.periods,
                    cls: '',
                    'ng-controller': '',
                    change: $scope.getWeeksOfMonth
                }],
                buttonToolbar: [{
                    text: "Cerrar Periodo",
                    cls: "btn-danger",
                    icon: "fa fa-lock",
                    fn: function () { alert("Estas seguro?") },
                    disabled: function () {
                        return $scope.gridSelectedItem == null
                    }
                }]
            };

            // Added by Yordano
            $scope.salesDialog = function (salesAction, saleData) {
                $rootScope.salesAction = salesAction;
                $rootScope.calOpened = false;
                $scope.unselect('sale');
                $rootScope.editSaleData = saleData;
                $rootScope.salesOperationDialog = $modal.open({
                    animation: true,
                    templateUrl: 'spa/app/scripts/modules/operations/salesDialog.html',
                    controller: 'SalesOperationController',
                    windowClass: "hmodal-info",
                    size: 'md'
                });
            };

            $scope.purchasesDialog = function (purchasesAction, purchaseData) {
                $rootScope.purchasesAction = purchasesAction;
                $rootScope.calOpened = false;
                $rootScope.editPurchaseData = purchaseData;
                $rootScope.purchasesOperationDialog = $modal.open({
                    animation: true,
                    templateUrl: 'spa/app/scripts/modules/operations/purchasesDialog.html',
                    controller: 'PurchasesOperationController',
                    windowClass: "hmodal-info",
                    size: 'md'
                });
            };

            $scope.getSelected = function (n) {
                return $scope.getGridEl(n + 's').find('tr.st-selected').scope()[n];
            };

            $scope.edit = function ($event) {
                var n = $($event.target).parents('.sales-toolbar').length === 1 ?
                    'sale' : 'purchase';
                if (n === 'sale') {
                    $scope.salesDialog('edit', $scope.getSelected(n));
                }
                else {
                    $scope.purchasesDialog('edit', $scope.getSelected(n));
                }
            };

            $scope.unselect = function (n) {
                $('.' + n + 's-table').first().find('tr').removeClass('st-selected');
                $scope[n + 'Selected'] = false;
            };

            $scope.select = function ($event) {
                var n = $($event.target).parents('.sales-table').length === 1 ?
                    'sale' : 'purchase';
                $scope.unselect(n);
                $($event.target).parent('tr').addClass('st-selected');
                if (n === 'sale')
                    $scope.saleSelected = true;
                else
                    $scope.purchaseSelected = true;
            };

            $scope.removeSale = function ($event) {
                var saleData = $scope.getSelected('sale');
                sweetAlert.swal({
                    title: "¿Estás seguro?",
                    text: "¡No podrás recuperar los datos de esta venta!\n\n"
                        + 'Cliente: ' + saleData.customer + '\n'
                        + 'Fecha: ' + saleData.operationDate + '\n'
                        + 'Monto: ' + saleData.amount,
                    type: "error",
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Sí, ¡elimínala!",
                    closeOnConfirm: true
                },
                function (ok) {
                    if (ok) {
                        var SaleOperation = $resource('api/Journal/sale',
                            null, { remove: { method: 'DELETE' } });
                        SaleOperation.remove({
                            operationId: saleData.operationId
                        }).$promise
                        .then(function (data) {
                            $timeout(function () {
                                var dataset = $rootScope.getDataSet('sales');
                                var newDataSet = [];
                                angular.forEach(dataset, function (value, key) {
                                    if (value.$$hashKey !== saleData.$$hashKey) {
                                        newDataSet.push(value);
                                    }
                                });
                                $rootScope.getGrid('sales').settings().dataset = newDataSet;
                                newDataSet = undefined;
                                $rootScope.getGrid('sales').reload();
                                $rootScope.recalcSalesTotal();
                            }, 100);
                        });
                    }
                });
            };
        }

    // Added by Yordano
    ]).controller('SalesOperationController', [
        '$scope', '$rootScope', 'sweetAlert', 'operationsService', '$resource', '$filter', '$timeout',
        function ($scope, $rootScope, sweetAlert, operationsService, $resource, $filter, $timeout)
        {
            $scope.processing = true;
            $scope.customers = [];

            $scope.initSaleOperationData = function () {
                if ($rootScope.salesAction === 'insert') {
                    $scope.saleOperation = {
                        operationId: 0,
                        saleId: 0,
                        customer: '',
                        amount: '',
                        description: '',
                        accountId: -1,
                        periodId: -1,
                        customerId: -1,
                        customerGroup: '',
                        operationDate: ''
                    };
                }
                else if ($rootScope.salesAction === 'edit') {
                    $scope.saleOperation = $rootScope.editSaleData;
                }
            };

            $scope.initSaleOperationData();

            var Customer = $resource("api/Customer/get", null, {
                getList: { method: "POST", isArray: false }
            });
            Customer.getList({
                pagination: {
                    start: 0,
                    totalItemCount: 0,
                    number: 100
                },
                predicate: { groupId: '0' },
                sort: {}
            }).$promise.then(function (data) {
                $scope.customers = data.Rows;
                $timeout(function () {
                    $scope.processing = false;
                }, 100);
            });

            $scope.ok = function () {
                $scope.processing = true;
                $scope.saveSaleOperation();
            };

            $scope.cancel = function () {
                $scope.salesOperationDialog.close();
            };

            $scope.saveSaleOperation = function () {
                var dataset = $rootScope.getDataSet('sales');
                if ($rootScope.salesAction === 'insert') {
                    var s = $scope.saleOperation;
                    dataset.push({
                        customer: s.customer,
                        amount: s.amount,
                        operationDate: $filter('date')(s.operationDate, 'yyyy-MM-dd'),
                        customerGroup: s.customerGroup
                    });
                }
                else if ($rootScope.salesAction === 'edit') {
                    var s = $scope.saleOperation;
                    angular.forEach(dataset, function (value, key) {
                        if (value.$$hashKey === $rootScope.editSaleData.$$hashKey) {
                            value.customer = s.customer,
                            value.amount = s.amount,
                            value.operationDate = $filter('date')(s.operationDate, 'yyyy-MM-dd'),
                            value.customerGroup = s.customerGroup
                        }
                    });
                }
                $rootScope.getGrid('sales').reload();
                var SaleOperation = $resource('api/Journal/sale',
                    $scope.saleOperation, {
                    update: { method: 'PUT', params: $scope.saleOperation }
                });
                if ($rootScope.salesAction === 'insert') {
                    SaleOperation.save($scope.saleOperation)
                        .$promise
                        .then(function (data) {
                            $timeout(function () {
                                $scope.processing = false;
                                $scope.initSaleOperationData();
                                $scope.salesOperationDialog.close();
                                $rootScope.recalcSalesTotal();
                            }, 100);
                        });
                }
                else if ($rootScope.salesAction === 'edit') {
                    SaleOperation.update($scope.saleOperation)
                        .$promise
                        .then(function (data) {
                            $timeout(function () {
                                $scope.processing = false;
                                $scope.initSaleOperationData();
                                $scope.salesOperationDialog.close();
                                $timeout(function () {
                                    $rootScope.recalcSalesTotal();
                                }, 100);
                            }, 100);
                        });
                }
            };

            $scope.onSelect = function ($item) {
                $scope.saleOperation.customerId = $item.VendorId;
            };
        }
    ]).controller('PurchasesOperationController', [
        '$scope', '$rootScope', 'sweetAlert', 'operationsService', '$resource', '$filter', '$timeout',
        function ($scope, $rootScope, sweetAlert, operationsService, $resource, $filter, $timeout)
        {
            $scope.processing = true;
            $scope.vendors = [];
            $scope.purchaseOperation = {
                operationId: 0,
                purchaseId: 0,
                accountId: 0,
                amount: '',
                vendor: '',
                vendorId: 0,
                description: '',
                operationDate: '',
                periodId: 0
            };

            var Vendor = $resource("api/Vendor/get", null, {
                getList: { method: "POST", isArray: false }
            });
            Vendor.getList({
                pagination: {
                    start: 0,
                    totalItemCount: 0,
                    number: 100
                },
                predicate: { groupId: '0' },
                sort: {}
            }).$promise.then(function (vendors) {
                $scope.vendors = vendors.list;
                $timeout(function () {
                    $scope.processing = false;
                }, 100);
            });

            $scope.ok = function () {
                $scope.processing = true;
                $scope.savePurchaseOperation();
            };

            $scope.cancel = function () {
                $scope.purchasesOperationDialog.close();
            };

            // Aqui va el grueso del controlador...
            $scope.savePurchaseOperation = function () {
                var PurchaseOperation = $resource('api/Journal/purchase');
                $scope.purchaseOperation.operationDate = $filter('date')
                    ($scope.purchaseOperation.operationDate, 'yyyy-MM-dd');
                PurchaseOperation.save($scope.purchaseOperation)
                .$promise.then(function (data)
                {
                    $timeout(function () {
                        $scope.processing = false;
                        $scope.purchasesOperationDialog.close();
                        //$rootScope.recalcPurchasesTotal();
                    }, 100);
                }, function (data) {
                    console.log(data);
                });
            };

            $scope.onSelect = function ($item) {
                $scope.purchaseOperation.vendorId = $item.VendorId;
            };
        }
    ]);
