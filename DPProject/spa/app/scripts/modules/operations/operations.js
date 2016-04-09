"use strict";

angular
    .module('app.operations', [])
    .controller('operationsCtrl', ['$http', '$scope', '$rootScope', 'sweetAlert', 'operationsService', 'NgTableParams', '$modal', '$resource',
        function ($http, $scope, $rootScope, sweetAlert, service, NgTableParams, $modal, $resource) {
            
            $scope.periods = service.getPeriods();
            $rootScope.periodDate = "05/01/2016";
            $scope.getWeeksOfMonth = function () {
                $scope.weeksOfMonth = service.getWeeksOfMonth($rootScope.periodDate);
            };
            $scope.getWeeksOfMonth();

            $scope.getWeekDate = function (_month, week) {
                $scope.semana = service.getWeeksOfMonth(_month)[week];
            };

            $rootScope.toolBar = {
                visible: true,
                subTitle: "Operaciones",
                subTitleDesc: "Administrador de operaciones diarias.",
                optionToolbar: [
                    { type: "select", label: "Periodo", data: $scope.periods, cls: "", change: $scope.getWeeksOfMonth }
                ],
                buttonToolbar: [
                    { text: "Cerrar Periodo", cls: "btn-danger", icon: "fa fa-lock", fn: function () { alert("are you sure?") }, disabled: function () { return $scope.gridSelectedItem == null } }
                ]
            };

            //////// Sales Data grid //////////
            /*var simpleList = [
                { "customer": "Karen", "date": "2016-01-23", "amount": 798, "customerGroup": "Piso" },
                { "customer": "Bismark", "date": "2016-01-23", "amount": 672, "customerGroup": "Piso" },
                { "customer": "Markus", "date": "2016-01-23", "amount": 695, "customerGroup": "Cash" },
                { "customer": "Anthony", "date": "2016-01-23", "amount": 559, "customerGroup": "Piso" },
                { "customer": "Alex", "date": "2016-01-23", "amount": 523, "customerGroup": "Mercado" },
                { "customer": "Tony", "date": "2016-01-23", "amount": 540, "customerGroup": "Cash" },
                { "customer": "Cat", "date": "2016-01-23", "amount": 746, "customerGroup": "Mercado" },
                { "customer": "Christian", "date": "2016-01-23", "amount": 572, "customerGroup": "Cash" },
                { "customer": "Stephane", "date": "2016-01-23", "amount": 674, "customerGroup": "Mercado" }
            ];
            $scope.tableParams = new NgTableParams({
                // initial grouping
                group: "customerGroup"
            }, {
                dataset: simpleList
            });
            $scope.totalAmount = sum(simpleList, "amount");*/
            var Sale = $resource('api/Journal/sales', {
                page: 1,
                count: 10,
                period: 5,
                week: 1
            });
            Sale.get().$promise.then(function (data) {
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

            /*$scope.sum = sum;
            $scope.isLastPage = isLastPage;

            function isLastPage() {
                return $scope.tableParams.page() === totalPages();
            }

            function sum(data, field) {
                var x = _.sumBy(data, field);
                return x;
            }

            function totalPages() {
                return Math.ceil($scope.tableParams.total() / $scope.tableParams.count());
            }*/

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
            $scope.getPeriodSelect = function () {
                return $('#wrapper .tool-bar-top select')[0];
            };

            $scope.today = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');

            $scope.getSelectedPeriod = function () {
                var selected = $($scope.getPeriodSelect()).find('option:selected')[0];
                var selectedPeriod = $($scope.getPeriodSelect()).find('option')
                    .index(selected);
                $scope.selectedPeriod = selectedPeriod;
            };
            $scope.getSelectedPeriod();

            $scope.getMinDate = function () {
                $scope.minDate = new Date(new Date().getFullYear(),
                    $scope.selectedPeriod, 1);
            };
            $scope.getMinDate();

            $scope.getLastDayOfMonth = function () {
                $scope.maxDate = new Date(new Date().getFullYear(),
                    $scope.selectedPeriod + 1, 0);
            };
            $scope.getLastDayOfMonth();

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
                    date: $scope.saleOperation.OperationDate,
                    customerGroup: $scope.saleOperation.CustomerGroup
                });
                ngTable.reload();
                if (console) console.log($scope.saleOperation);
                var SaleOperation = $resource('api/Journal/sale');
                SaleOperation.save($scope.saleOperation).$promise.then(function (data) {
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


