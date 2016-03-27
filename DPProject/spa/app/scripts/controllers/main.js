/**
 *
 * appCtrl
 *
 */

angular
    .module('homer')
    .controller('appCtrl', ['$http','$scope', function ($http, $scope) {
        $scope.config = {
            bodyClass: "fixed-small-header fixed-sidebar fixed-navbar"
        };
    }]);

