"use strict";

angular
    .module('app.vendor')
    .service('VendorsService', ['$modal', '$resource', function ($modal, $resource) {

        var srv = {};
        var modalInstance = null;

        srv.getVendors = function (_params) {
            var params = {
                predicate: _params.search.predicateObject ? _params.search.predicateObject : {Description:""},
                pagination: _params.pagination,
                sort: _params.sort
            }

            var request = $resource("api/Vendor/get", null, { 'postQuery': { method: "POST", isArray: false } });

            return request.postQuery(params).$promise;
        }

        srv.processVendor = function (_scope) {
            modalInstance = $modal.open({
                animation: true,
                templateUrl: 'spa/app/scripts/modules/vendor/newVendor.html',
                scope: _scope,
                controller: 'vendorDialog',
                windowClass: "hmodal-info",
                size: 'md'
            });
        };

        srv.insert = function (_param) {
            return $resource("api/Vendor/").save(_param.vendor).$promise;
        };

        srv.update = function (_scope) {
            var resource = $resource('/api/Vendor/:VendorId', null, { 'update': { method: 'PUT' } });
            return resource.update({ Id: _scope.vendor.VendorId }, _scope.vendor).$promise;
        };

        srv.delete = function (_scope) {
            var resource = $resource('/api/Vendor/:Id', null, { 'delete': { method: 'DELETE' } });
            return resource.delete({ Id: _scope.gridSelectedItem.VendorId }).$promise;
        };
        return srv;
    }]);

angular
    .module('app.vendor')
    .controller('vendorDialog', ['$scope', '$modalInstance', 'VendorsService', 'sweetAlert',
        function ($scope, $modalInstance, service, sweetAlert) {
            $scope.call = service.insert;
            $scope.vendor = {
                VendorId: 0,
                Name: "",
                Description: ""
            };

            if ($scope.action == "update") {
                $scope.call = service.update;
                angular.copy($scope.gridSelectedItem, $scope.vendor);
            }

            $scope.ok = function () {
                $scope.saving = true;

                $scope.call($scope)
                    .then(function (response) {
                        if ($scope.action == "update") {
                            angular.copy($scope.vendor, $scope.gridSelectedItem);
                        } else {
                            $scope.getVendors($scope.tableState);
                        }
                        $modalInstance.close();
                        $scope.saving = false;
                    })
                    .catch(function (response) {
                        sweetAlert.resolveError(response);
                        $scope.saving = false;
                    });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
    ])
    .controller('editVendorDialog', ['$scope', '$modalInstance', 'VendorsService', 'sweetAlert',
        function ($scope, $modalInstance, service, sweetAlert) {
            $scope.vendor = {
                VendorId: 0,
                Name: "",
                Description: ""
            };

            $scope.ok = function () {
                $scope.saving = true;
                service.update($scope.gridSelectedItem.VendorId, $scope.vendor)
                    .then(function (response) {
                        $modalInstance.close();
                        $scope.saving = false;
                    })
                    .cath(function (response) {
                        sweetAlert.resolveError(response);
                        $scope.saving = false;
                    });

            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
    ]);


