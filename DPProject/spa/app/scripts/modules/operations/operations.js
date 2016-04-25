"use strict";

angular
    .module('app.operations', [])
    .controller('OperationsController', [
        '$http', '$scope', '$rootScope', 'sweetAlert', 'operationsService', 'NgTableParams', '$modal', '$resource', '$timeout', '$filter', '$interval',
        function ($http, $scope, $rootScope, sweetAlert, service, NgTableParams, $modal, $resource, $timeout, $filter, $interval)
        {
            $rootScope.sumBy = function (anArray, field) {
                return _.sumBy(anArray, field);
            };

            $scope.periods = service.getPeriods();
            $rootScope.periodDate = _.find($scope.periods, { key: moment().startOf('month').format('MM/DD/YYYY') });

            $rootScope.getGridEl = function (n) {
                var className = '.' + n + '-table';
                return angular.element($(className)[0]);
            };

            $rootScope.getGrid = function (n) {
                var index = n + 'Params';
                return $rootScope.getGridEl(n).scope()[index];
            }

            $rootScope.getDataSet = function (n) {
                return $rootScope.getGrid(n).settings().dataset;
            };

            $rootScope.recalcTotal = function (n) {
                var dataset = $rootScope.getDataSet(n);
                var totalProp = _.camelCase('total ' + n + ' Amount');
                $rootScope[totalProp] = _.sumBy(dataset, 'amount');
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
                    $rootScope.totalPurchasesAmount =
                        _.sumBy(data.purchasesList, 'amount');
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
                    $rootScope.totalSalesAmount =
                        _.sumBy(data.saleList, 'amount');
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

            $scope.openSalesDlg = function (salesAction, saleData) {
                $rootScope.salesAction = salesAction;
                $rootScope.calOpened = false;
                $rootScope.editSaleData = saleData;
                $scope.unselect('sale');
                $rootScope.salesDialog = $modal.open({
                    animation: true,
                    templateUrl: 'spa/app/scripts/modules/operations/salesDialog.html',
                    controller: 'SalesOperationController',
                    windowClass: "hmodal-info",
                    size: 'md'
                });
            };

            $scope.openPurchasesDlg = function (purchasesAction, purchaseData) {
                $rootScope.purchasesAction = purchasesAction;
                $rootScope.calOpened = false;
                $rootScope.editPurchaseData = purchaseData;
                $scope.unselect('purchase');
                $rootScope.purchasesDialog = $modal.open({
                    animation: true,
                    templateUrl: 'spa/app/scripts/modules/operations/purchasesDialog.html',
                    controller: 'PurchasesOperationController',
                    windowClass: "hmodal-info",
                    size: 'md'
                });
            };

            $scope.getSelected = function (n) {
                var prop = n;
                var elName = n + 's';
                return $scope.getGridEl(elName)
                    .find('tr.st-selected')
                    .scope()[prop];
            };

            $scope.edit = function ($event) {
                var n = $($event.target).parents('.sales-toolbar').length === 1 ?
                    'sale' : 'purchase';
                var dlgAction = _.camelCase('open ' + n + 's ' + 'Dlg');
                var entity = $scope.getSelected(n);
                $scope[dlgAction]('edit', entity);
            };

            $scope.unselect = function (n) {
                var className = '.' + n + 's-table';
                var objName = n + 'Selected';
                $(className).first().find('tr').removeClass('st-selected');
                $scope[objName] = false;
            };

            $scope.select = function ($event) {
                var n = $($event.target).parents('.sales-table').length === 1 ?
                    'sale' : 'purchase';
                $scope.unselect(n);
                $($event.target).parent('tr').addClass('st-selected');
                var objName = n + 'Selected';
                $scope[objName] = true;
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
                                _.pull(dataset, saleData);
                                $rootScope.getGrid('sales').settings().dataset = dataset;
                                $rootScope.getGrid('sales').reload();
                                $rootScope.recalcTotal('sales');
                            }, 100);
                        });
                    }
                });
            };

            $scope.removePurchase = function ($event) {
                var purchaseData = $scope.getSelected('purchase');
                sweetAlert.swal({
                    title: "¿Estás seguro?",
                    text: "¡No podrás recuperar los datos de esta compra!\n\n"
                        + 'Vendedor: ' + purchaseData.vendor + '\n'
                        + 'Fecha: ' + purchaseData.operationDate + '\n'
                        + 'Monto: ' + purchaseData.amount,
                    type: "error",
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Sí, ¡elimínala!",
                    closeOnConfirm: true
                },
                function (ok) {
                    if (ok) {
                        var PurchaseOperation = $resource('api/Journal/purchase',
                            null, { remove: { method: 'DELETE' } });
                        PurchaseOperation.remove({
                            operationId: purchaseData.operationId
                        }).$promise.then(function (data) {
                            $timeout(function () {
                                var dataset = $rootScope.getDataSet('purchases');
                                _.pull(dataset, purchaseData);
                                $rootScope.getGrid('purchases').settings().dataset = dataset;
                                $rootScope.getGrid('purchases').reload();
                                $rootScope.recalcTotal('purchases');
                            }, 100);
                        });
                    }
                });
            };
        }

    ])

    .controller('SalesOperationController', [
        '$scope', '$rootScope', 'sweetAlert', 'operationsService', '$resource', '$filter', '$timeout',
        function ($scope, $rootScope, sweetAlert, operationsService, $resource, $filter, $timeout)
        {
            $scope.processing = true;
            $scope.customers = [];

            $scope.initOperation = function () {
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
                    // Clonar objeto para evitar efecto visual de edicion en vivo
                    $scope.saleOperation = _.cloneDeep($rootScope.editSaleData);
                }
            };

            $scope.initOperation();

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
                $scope.salesDialog.close();
            };

            $scope.saveSaleOperation = function () {
                var dataset = $rootScope.getDataSet('sales');
                var s = $scope.saleOperation;
                s.operationDate = $filter('date')(s.operationDate, 'yyyy-MM-dd');
                var SaleOperation = $resource('api/Journal/sale',
                    null, { update: { method: 'PUT', params: s }
                });
                if ($rootScope.salesAction === 'insert') {
                    SaleOperation.save(s)
                    .$promise.then(function (data) {
                        dataset.push(s);
                        $timeout(function () {
                            $scope.processing = false;
                            $scope.initOperation();
                            $scope.salesDialog.close();
                            $rootScope.recalcTotal('sales');
                        }, 100);
                        $rootScope.getGrid('sales').reload();
                    }, function (data) {
                        if (console) console.log(data);
                    });
                }
                else if ($rootScope.salesAction === 'edit') {
                    SaleOperation.update(s)
                    .$promise.then(function (data) {
                        $timeout(function () {
                            var oldSale = _.find(dataset, _.matchesProperty('$$hashKey', $rootScope.editSaleData.$$hashKey));
                            _.assign(oldSale, s);
                            $scope.processing = false;
                            $scope.initOperation();
                            $scope.salesDialog.close();
                            $timeout(function () {
                                $rootScope.recalcTotal('sales');
                            }, 100);
                        }, 100);
                        $rootScope.getGrid('sales').reload();
                    }, function (data) {
                        if (console) console.log(data);
                    });
                }
            };

            $scope.onSelect = function ($item) {
                $scope.saleOperation.customerId = $item.Id;
                $scope.saleOperation.customerGroup = $item.GroupName;
            };
        }
    ])

    .controller('PurchasesOperationController', [
        '$scope', '$rootScope', 'sweetAlert', 'operationsService', '$resource', '$filter', '$timeout',
        function ($scope, $rootScope, sweetAlert, operationsService, $resource, $filter, $timeout)
        {
            $scope.processing = true;
            $scope.vendors = [];

            $scope.initOperation = function () {
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
            };
            $scope.initOperation();

            if ($rootScope.purchasesAction === 'edit') {
                // Clonar objeto para evitar efecto visual de edicion en vivo
                $scope.purchaseOperation = _.cloneDeep($rootScope.editPurchaseData);
            }

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
                if ($rootScope.purchasesAction === 'insert')
                    $scope.savePurchaseOperation();
                else
                    $scope.updatePurchaseOperation();
            };

            $scope.cancel = function () {
                $scope.purchasesDialog.close();
            };

            // Aqui va el grueso del controlador...
            $scope.savePurchaseOperation = function () {
                var PurchaseOperation = $resource('api/Journal/purchase');
                var p = $scope.purchaseOperation;
                p.operationDate = $filter('date')(p.operationDate, 'yyyy-MM-dd');
                PurchaseOperation.save(p)
                .$promise.then(function (data)
                {
                    $timeout(function () {
                        $scope.processing = false;
                        var dataset = $rootScope.getDataSet('purchases');
                        dataset.push(p);
                        $rootScope.getGrid('purchases').reload();
                        $rootScope.recalcTotal('purchases');
                        $scope.purchasesDialog.close();
                    }, 100);
                }, function (data) {
                    if (console) console.log(data);
                });
            };

            $scope.updatePurchaseOperation = function () {
                var dataset = $rootScope.getDataSet('purchases');
                var p = $scope.purchaseOperation;
                p.operationDate = $filter('date')(p.operationDate, 'yyyy-MM-dd');
                var PurchaseOperation = $resource('api/Journal/purchase',
                    null, {
                    update: { method: 'PUT', params: p }
                });
                PurchaseOperation.update(p)
                .$promise.then(function (data) {
                    $timeout(function () {
                        var oldPurchase = _.find(dataset, _.matchesProperty('$$hashKey', $rootScope.editPurchaseData.$$hashKey));
                        _.assign(oldPurchase, p);
                        $scope.processing = false;
                        $scope.initOperation();
                        $scope.purchasesDialog.close();
                        $timeout(function () {
                            $rootScope.recalcTotal('purchases');
                        }, 100);
                    }, 100);
                }, function (data) {
                    if (console) console.log(data);
                });
            };

            $scope.onSelect = function ($item) {
                $scope.purchaseOperation.vendorId = $item.VendorId;
            };
        }
    ]);
