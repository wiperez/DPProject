﻿"use strict";

angular
    .module('app.operations', [])
    .controller('operationsCtrl', ['$http', '$scope', '$rootScope', 'sweetAlert', 'operationsService', 'NgTableParams',
        function ($http, $scope, $rootScope, sweetAlert, service, NgTableParams) {
            
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
                ]
                ,
                buttonToolbar: [
                    { text: "Cerrar Periodo", cls: "btn-danger", icon: "fa fa-lock", fn: function () { alert("are you sure?") }, disabled: function () { return $scope.gridSelectedItem == null } }
                ]
            };

            //////// Sales Data grid //////////
            var simpleList = [{ "name": "Karen", "age": 45, "money": 798, "country": "Czech Republic" }, { "name": "Cat", "age": 49, "money": 749, "country": "Czech Republic" }, { "name": "Bismark", "age": 48, "money": 672, "country": "Denmark" }, { "name": "Markus", "age": 41, "money": 695, "country": "Costa Rica" }, { "name": "Anthony", "age": 45, "money": 559, "country": "Japan" }, { "name": "Alex", "age": 55, "money": 645, "country": "Czech Republic" }, { "name": "Stephane", "age": 57, "money": 662, "country": "Japan" }, { "name": "Alex", "age": 59, "money": 523, "country": "American Samoa" }, { "name": "Tony", "age": 56, "money": 540, "country": "Canada" }, { "name": "Cat", "age": 57, "money": 746, "country": "China" }, { "name": "Christian", "age": 59, "money": 572, "country": "Canada" }, { "name": "Tony", "age": 60, "money": 649, "country": "Japan" }, { "name": "Cat", "age": 47, "money": 675, "country": "Denmark" }, { "name": "Stephane", "age": 50, "money": 674, "country": "China" }, { "name": "Markus", "age": 40, "money": 549, "country": "Portugal" }, { "name": "Anthony", "age": 53, "money": 660, "country": "Bahamas" }, { "name": "Stephane", "age": 54, "money": 549, "country": "China" }, { "name": "Karen", "age": 50, "money": 611, "country": "American Samoa" }, { "name": "Therese", "age": 53, "money": 754, "country": "China" }, { "name": "Bismark", "age": 49, "money": 791, "country": "Canada" }, { "name": "Daraek", "age": 56, "money": 640, "country": "Costa Rica" }, { "name": "Tony", "age": 43, "money": 674, "country": "Canada" }, { "name": "Karen", "age": 47, "money": 700, "country": "Portugal" }, { "name": "Therese", "age": 47, "money": 718, "country": "Czech Republic" }, { "name": "Karen", "age": 50, "money": 655, "country": "Japan" }, { "name": "Daraek", "age": 59, "money": 581, "country": "American Samoa" }, { "name": "Daraek", "age": 60, "money": 595, "country": "Portugal" }, { "name": "Markus", "age": 44, "money": 607, "country": "China" }, { "name": "Simon", "age": 58, "money": 728, "country": "Japan" }, { "name": "Simon", "age": 49, "money": 655, "country": "Bahamas" }];
            $scope.tableParams = new NgTableParams({
                // initial grouping
                group: "country"
            }, {
                dataset: simpleList
            });
            $scope.totalAge = sum(simpleList, "age");
            $scope.totalMoney = sum(simpleList, "money");

            $scope.sum = sum;
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
            }

        }
    ]);



