"use strict";

angular
    .module('app.customer')
    .service('customerService', ['$modal', '$resource', function ($modal, $resource) {

        var srv = {};

        var modalInstance = null;

        srv.getCustomers = function (_params) {
            var params = {
                predicate: _params.search.predicateObject,
                pagination: _params.pagination,
                sort: _params.sort
            }
            var request = $resource("api/Customer/get", null, { 'postQuery': { method: "POST", isArray: false } });

            return request.postQuery(params).$promise;
        }

        srv.getCustomerGroups = function () {
            return $resource("api/Customer/group").query().$promise;
        }

        srv.processCustomer = function (_scope) {
            modalInstance = $modal.open({
                animation: true,
                templateUrl: 'spa/app/scripts/modules/customer/newCustomer.html',
                scope: _scope,
                controller: 'customerDialog',
                windowClass: "hmodal-info",
                size: 'md'
            });
        };

        srv.insert = function (_param) {
            return $resource("api/Customer/").save(_param.customer).$promise;
        };

        srv.update = function (_scope) {
            var resource = $resource('/api/Customer/:Id', null, { 'update': { method: 'PUT' } });
            return resource.update({ Id: _scope.customer.Id }, _scope.customer).$promise;
        };

        srv.checkCustomerDeletion = function (customerId) {
            var Customer = $resource('api/Customer/deletion/:customerId', null,
                { check: { method: 'POST' } 
            });
            return Customer.check(customerId).$promise;
        };

        return srv;
    }]);

angular
    .module('app.customer')
    .controller('customerDialog', ['$scope', '$modalInstance', 'customerService', 'sweetAlert',
        function ($scope, $modalInstance, service, sweetAlert) {

            $scope.customerGroups = $scope.$parent.customerGroups;
            
            $scope.call = service.insert;

            $scope.customer = {
                Id: 0,
                Code: "",
                Name: "",
                GroupId: 1
            };

            if ($scope.action == "update") {
                $scope.call = service.update;
                angular.copy($scope.gridSelectedItem, $scope.customer);
            }

            $scope.ok = function () {
                $scope.saving = true;

                $scope.call($scope)
                    .then(function (response) {
                        if ($scope.action == "update") {
                            angular.copy($scope.customer, $scope.gridSelectedItem);
                            $scope.getCustomers($scope.tableState);
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
    ]);


