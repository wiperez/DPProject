/**
 * HOMER - Responsive Admin Theme
 * version 1.8
 *
 */

(function () {
    angular.module('homer', [
        'ui.router',                // Angular flexible routing
        'ui.bootstrap',             // AngularJS native directives for Bootstrap
        'smart-table',              // Smart table at: http://lorenzofox3.github.io/smart-table-website/
        'ngResource',
        'cgNotify',                 // Angular notify

        "mygrid",

        'app.dashboard',
        'app.customer',
        'app.operations'
    ])
})();

