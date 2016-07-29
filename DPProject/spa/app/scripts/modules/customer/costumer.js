"use strict";

angular
    .module('app.customer', [])
    .controller('customerCtrl', ['$http', '$scope', '$rootScope', 'sweetAlert', 'customerService', 
        function ($http, $scope, $rootScope, sweetAlert, service) {

        $rootScope.toolBar = {
            visible: true,
            subTitle: "Clientes",
            subTitleDesc: "Administrador de clientes de la compañia.",
            buttonToolbar: [
                { text: "Nuevo", cls: "btn-success", icon: "pe-7s-add-user", fn: function () { $scope.processCostumer("insert"); } },
                { text: "Editar", cls: "btn-info", icon: "pe-7s-users", fn: function () { $scope.processCostumer("update") }, disabled: function () { return $scope.gridSelectedItem == null } },
                { text: "Eliminar", cls: "btn-danger2", icon: "pe-7s-delete-user", fn: function () { $scope.delete(); }, disabled: function () { return $scope.gridSelectedItem == null } }
            ]
        };

       //Get list of customer groups
       service.getCustomerGroups()
            .then(function (result) {
                $scope.customerGroups = result;
            })
        .catch(function (response) {
            sweetAlert.resolveError(response);
        });
       
       $scope.getCustomers = function (tableState) {

           tableState.pagination.number = 10;  // Number of entries showed per page.
           $scope.tableState = tableState;

           service.getCustomers(tableState)
               .then(function (result)
            {
                $scope.gridSelectedItem = null;
                $scope.gridDataSet = result.Rows;
                $scope.pages = result.NumberOfPages;
                tableState.pagination.totalItemCount = result.RowCount;
                tableState.pagination.numberOfPages = result.NumberOfPages;
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

        $scope.processCostumer = function (_action) {
            $scope.action = _action;
            service.processCustomer($scope);
        };

        $scope.delete = function () {
            $scope.saving = true;
            // Chequear si el cliente ha tenido ventas
            service.checkCustomerDeletion($scope.gridSelectedItem.Id)
                .then(function (data)
            {
                if (data.hasSales) {
                    sweetAlert.swal({
                        title: "¡Cuidado!",
                        text: "¿Esta seguro que desea borrar este Cliente?\n"
                            + "El mismo posee ventas asociadas que dejarán de ser contabilizadas.",
                        type: "error",
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Sí, ¡elimínalo!",
                        closeOnConfirm: true
                    },
                    function (ok) {
                        if (ok) {
                            alert('desactivalo y marca como Deleted todas sus ventas');
                        }
                    });
                }
                else {
                    sweetAlert.swal({
                        title: "¡Cuidado!",
                        text: "El cliente dejará de estar disponible y tendrá " +
                            "que volver a crearlo si lo necesitara más adelante.",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Sí, ¡elimínalo!",
                        closeOnConfirm: true
                    },
                    function (ok) {
                        if (ok) {
                            alert('borralo definitivamente de la BD');
                        }
                    });
                }
            }).catch(function (response) {
                sweetAlert.resolveError(response);
                $scope.saving = false;
            });
        }

    }]);
