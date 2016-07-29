"use strict";

angular
    .module('app.dashboard', [])
    .controller('dashboardCtrl', ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {

        $rootScope.subTitle = "Panel de Control";
        $rootScope.subTitleDesc = ""
        $rootScope.toolBar = [];

    }]);