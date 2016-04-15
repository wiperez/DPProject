"use strict";

angular
    .module('app.operations', [])
    .controller('OperationsController', ['$http', '$scope', '$rootScope', 'sweetAlert', 'operationsService', 'NgTableParams', '$modal', '$resource', '$timeout',
        function ($http, $scope, $rootScope, sweetAlert, service, NgTableParams, $modal, $resource, $timeout) {
            
            $scope.periods = service.getPeriods();
            $rootScope.periodDate = "05/01/2016";

            $rootScope.getSalesGridEl = function () {
                return angular.element($('.sales-table')[0]);
            };

            $rootScope.getSalesGrid = function () {
                return $rootScope.getSalesGridEl().scope().tableParams;
            }

            $rootScope.getSalesDataSet = function () {
                var ngTable = $rootScope.getSalesGrid();
                return ngTable.settings().dataset;
            };

            $rootScope.recalcSalesTotal = function () {
                var gridScope = $rootScope.getSalesGridEl().scope();
                var dataset = $rootScope.getSalesDataSet();
                $rootScope.totalAmount = gridScope.sum(dataset, 'amount');
            };

            // Added by Yordano
            $scope.reloadSalesGrid = function () {
                var Sales = $resource('api/Journal/sales');
                Sales.save({
                    page: 1,
                    count: 10,
                    week: $rootScope.week.toString().replace(/\ /g, '')
                }).$promise.then(function (data) {

                    $scope.tableParams = new NgTableParams({
                        // initial grouping
                        group: 'customerGroup'
                    }, {
                        dataset: data.saleList
                    });
                    function isLastPage() {
                        return $scope.tableParams.page() === totalPages();
                    }
                    function sum(data, field) {
                        var x = _.sumBy(data, field);
                        return x;
                    }
                    function totalPages() {
                        return Math.ceil($scope.tableParams.total() / $scope.tableParams.count());
                    }
                    $rootScope.totalAmount = sum(data.saleList, 'amount');
                    $scope.sum = sum;
                    $scope.isLastPage = isLastPage;

                });
            };

            $scope.getWeeksOfMonth = function () {
                $scope.weeksOfMonth = service.getWeeksOfMonth($rootScope.periodDate);
            };

            $scope.getWeeksOfMonth();

            $scope.getWeekDate = function (_month, week) {
                $rootScope.week = service.getWeeksOfMonth(_month)[week];
                $scope.reloadSalesGrid();
            };

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
            $scope.openSalesOperationDialog = function (salesAction, saleData) {
                $rootScope.salesAction = salesAction;
                $rootScope.editSaleData = saleData;
                $rootScope.salesOperationDialog = $modal.open({
                    animation: true,
                    templateUrl: 'spa/app/scripts/modules/operations/salesDialog.html',
                    controller: 'SalesOperationController',
                    windowClass: "hmodal-info",
                    size: 'md'
                });
            };

            $scope.editSale = function ($event) {
                var saleData = angular.element($event.target).scope().sale;
                $scope.openSalesOperationDialog('edit', saleData);
            };

            $scope.removeSale = function ($event) {
                var saleData = angular.element($event.target).scope().sale;
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
                                var dataset = $rootScope.getSalesDataSet();
                                var newDataSet = [];
                                angular.forEach(dataset, function (value, key) {
                                    if (value.$$hashKey !== saleData.$$hashKey) {
                                        newDataSet.push(value);
                                    }
                                });
                                $rootScope.getSalesGrid().settings().dataset = newDataSet;
                                newDataSet = undefined;
                                $rootScope.getSalesGrid().reload();
                                $rootScope.recalcSalesTotal();
                            }, 2000);
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
            $scope.today = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');

            $scope.getMinDate = function () {
                $scope.minDate = $filter('date')($rootScope.week.split(' - ')[0],
                    'MM-dd-yyyy');
            };
            $scope.getMinDate();

            $scope.getLastDayOfWeek = function () {
                $scope.maxDate = $filter('date')($rootScope.week.split(' - ')[1],
                    'MM-dd-yyyy');
            };
            $scope.getLastDayOfWeek();

            // Tomado de el fuente de Homer donde explica el datepicker
            $scope.datesDisabled = function (date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1
            };

            $scope.processing = true;
            $scope.customers = [];

            // Tomado de el fuente de Homer donde explica el datepicker
            $scope.openCal = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.calOpened = true;
            };

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

            var Customer = $resource("api/Customer/get", null, { 'postQuery': { method: "POST", isArray: false } });
            Customer.postQuery({
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
                    $scope.focusFirstInput();
                }, 2000);
            });

            $scope.ok = function () {
                $scope.processing = true;
                $scope.getCustomerByName();
            };

            $scope.cancel = function () {
                $scope.salesOperationDialog.close();
            };

            $scope.getCustomerByName = function () {
                var Customer = $resource('api/Customer', { name: $scope.saleOperation.customer });
                Customer.get().$promise.then(function (data) {
                    $scope.saleOperation.customerId = data.Id;
                    $scope.saleOperation.customerGroup = data.GroupName;
                    $scope.getAccountId();
                });
            };

            $scope.getAccountId = function () {
                var Account = $resource('api/Accounts', { name: 'Ventas' });
                Account.get().$promise.then(function (data) {
                    $scope.saleOperation.accountId = data.AccountId;
                    $scope.getPeriodId();
                });
            };

            $scope.getPeriodId = function () {
                var Period = $resource('api/Period/belongs', {
                    date: $scope.saleOperation.operationDate
                });
                Period.get().$promise.then(function (data) {
                    $scope.saleOperation.periodId = data.periodId;
                    $scope.saveSaleOperation();
                });
            };

            $scope.saveSaleOperation = function () {
                var dataset = $rootScope.getSalesDataSet();
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
                $rootScope.getSalesGrid().reload();
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
                            }, 2000);
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
                                }, 2000);
                            }, 2000);
                        });
                }
            };

            $scope.focusFirstInput = function () {
                var t = $('#sales-dialog .form-control:first')[0];
                if (angular.isUndefined(t)) return; else t.focus();
            }
        }
    ]);


