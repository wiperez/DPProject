/**
 * HOMER - Responsive Admin Theme
 * version 1.8
 *
 */

function configState($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider) {

    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // Set default state
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider

    // Dashboard - Main page
    .state('dashboard', {
        url: "/dashboard",
        templateUrl: "/spa/app/templates/dashboard.html",
        data: {
            pageTitle: 'Dashboard',
        }
    })
    // Customer Manager
    .state('customer', {
        url: "/customer",
        templateUrl: "/spa/app/scripts/modules/customer/customerManager.html",
        data: {
            pageTitle: 'Clientes',
        }
    })

    // Operations Manager
    .state('operations', {
        url: "/operations",
        templateUrl: "/spa/app/scripts/modules/operations/operationsManager.html",
        data: {
            pageTitle: 'Operaciones',
        }
    })

    // Operations Manager
    .state('nggrid', {
        url: "/nggrid",
        templateUrl: "/spa/app/scripts/modules/nggrid/nggrid.html",
        data: {
            pageTitle: 'gridtest',
        }
    });

    $locationProvider.html5Mode({ enabled: true, requireBase: false });
}

angular
    .module('homer')
    .config(configState)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });