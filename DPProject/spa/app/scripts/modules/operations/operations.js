"use strict";

angular
    .module('app.operations', [])
    .controller('operationsCtrl', ['$http', '$scope', '$rootScope', 'sweetAlert', 'operationsService', 'NgTableParams', '$modal', '$resource',
        function ($http, $scope, $rootScope, sweetAlert, service, NgTableParams, $modal, $resource) {
            
            $scope.periods = service.getPeriods();

            $rootScope.periodDate = "05/01/2016";

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
                    $scope.totalAmount = sum(data.saleList, 'amount');
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
            $scope.openSalesOperationDialog = function (salesAction) {
                $rootScope.salesAction = salesAction;
                $rootScope.salesOperationDialog = $modal.open({
                    animation: true,
                    templateUrl: 'spa/app/scripts/modules/operations/salesDialog.html',
                    controller: 'SalesOperationController',
                    windowClass: "hmodal-info",
                    size: 'md'
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
                $scope.saleOperation = {
                    Customer: '',
                    Amount: '',
                    Description: '',
                    AccountId: -1,
                    PeriodId: -1,
                    CustomerId: -1,
                    CustomerGroup: '',
                    OperationDate: $scope.today
                };
            };

            $scope.initSaleOperationData();

            var Customer = $resource("api/Customer/get-customers", null, { 'postQuery': { method: "POST", isArray: false } });
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
                var Customer = $resource('api/Customer', { name: $scope.saleOperation.Customer });
                Customer.get().$promise.then(function (data) {
                    $scope.saleOperation.CustomerId = data.Id;
                    $scope.saleOperation.CustomerGroup = data.GroupName;
                    $scope.getAccountId();
                });
            };

            $scope.getAccountId = function () {
                var Account = $resource('api/Accounts', { name: 'Ventas' });
                Account.get().$promise.then(function (data) {
                    $scope.saleOperation.AccountId = data.AccountId;
                    $scope.getPeriodId();
                });
            };

            $scope.getPeriodId = function () {
                var Period = $resource('api/Period/belongs', {
                    date: $scope.saleOperation.OperationDate
                });
                Period.get().$promise.then(function (data) {
                    $scope.saleOperation.PeriodId = data.periodId;
                    $scope.saveSaleOperation();
                });
            };

            $scope.saveSaleOperation = function () {
                var ngTable = angular.element($('.sales-table')[0])
                    .scope().tableParams;
                var dataset = ngTable.settings().dataset;
                dataset.push({
                    customer: $scope.saleOperation.Customer,
                    amount: $scope.saleOperation.Amount,
                    date: $filter('date')($scope.saleOperation.OperationDate,
                        'yyyy-MM-dd'),
                    customerGroup: $scope.saleOperation.CustomerGroup
                });
                ngTable.reload();
                if (console) console.log($scope.saleOperation);
                var SaleOperation = $resource('api/Journal/sale');
                SaleOperation.save($scope.saleOperation).$promise
                    .then(function (data)
                {
                    $timeout(function () {
                        $scope.processing = false;
                        $scope.initSaleOperationData();
                        $scope.focusFirstInput();
                    }, 2000);
                    if (console) console.log(data);
                });
            };

            $scope.focusFirstInput = function () {
                $('#sales-dialog .form-control:first')[0].focus();
            }
        }
    ]);


