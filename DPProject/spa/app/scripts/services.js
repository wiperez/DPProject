angular.module('app.services', [])

.factory('ShortcutFunctions', function(){

    return {

        scope: function (selector) {
            return angular.element(selector).scope();
        },

        el: function (selector) {
            return angular.element(selector);
        }

    };

});
