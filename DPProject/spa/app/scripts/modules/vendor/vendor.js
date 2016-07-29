"use strict";

angular
    .module('app.vendor', [])
    .controller('VendorsController', ['$http', '$scope', '$rootScope', 'sweetAlert', 'VendorsService', 

    function ($http, $scope, $rootScope, sweetAlert, service) {

        $rootScope.toolBar = {
            visible: true,
            subTitle: "Proveedores",
            subTitleDesc: "Administrador de proveedores de la compañia.",
            buttonToolbar: [
                { text: "Nuevo", cls: "btn-success", icon: "pe-7s-add-user", fn: function () { $scope.processVendor("insert"); } },
                { text: "Editar", cls: "btn-info", icon: "pe-7s-users", fn: function () { $scope.processVendor("update") }, disabled: function () { return $scope.gridSelectedItem == null } },
                { text: "Eliminar", cls: "btn-danger2", icon: "pe-7s-delete-user", fn: function () { $scope.delete(); }, disabled: function () { return $scope.gridSelectedItem == null } }
            ]
        };

            
        $scope.getVendors = function (tableState) {

            tableState.pagination.number = 10;  // Number of entries showed per page.
            
            service.getVendors(tableState)
                .then(function (result) {
                    $scope.gridSelectedItem = null;
                    $scope.gridDataSet = result.list;
                    $scope.pages = result.NumberOfPages;

                    tableState.pagination.totalItemCount = result.RowCount;
                    tableState.pagination.numberOfPages = result.NumberOfPages;
                    $scope.tableState = tableState;
                })
                .catch(function (response) {
                    sweetAlert.resolveError(response);
                });
        };

        // fired when table rows are selected
        $scope.$watch('gridDataSet', function (rows) {
            // get selected row
            if (!angular.isUndefined(rows)) {
                $scope.gridSelectedItem = null;
                rows.filter(function (r) {
                    if (r.isSelected) {
                        $scope.gridSelectedItem = r;
                        return;
                    }
                })
            }
        }, true);

        $scope.processVendor = function (_action) {
            $scope.action = _action;
            service.processVendor($scope);
        };

        $scope.delete = function () {
            sweetAlert.swal({
                title: "Atención",
                text: "¿Esta seguro que desea borrar este Proveedor?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Sí, Elimínalo!",
                cancelButtonText: "No, es un error"
            },
            function (isConfirm) {
                if (isConfirm) {
                    service.delete($scope).
                        then(function (response) {
                            sweetAlert.swal(response.Message);
                            $scope.getVendors($scope.tableState);
                        }).catch(function (response) {
                            sweetAlert.resolveError(response);
                        });
                }
            });
        }

    }]);
