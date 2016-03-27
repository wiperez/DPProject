angular.module('homer')
.directive('pageSelect', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        require: '^stTable',
        link: function (scope, element, attr, tableCtrl) {
            var promise = null;

            scope.$watch('currentPage', function (c) {
                scope.inputPage = c;
            });

            element.bind('input', function (evt) {
                if (promise !== null) {
                    $timeout.cancel(promise);
                }

                promise = $timeout(function () {
                    scope.selectPage(scope.inputPage);
                    promise = null;
                }, 400);
            });
        }
    }
}])
.directive('csDetail', function () {
    return {
        require: '^stTable',
        scope: {
            row: '=csDetail'
        },
        link: function (scope, element, attr, ctrl) {

            element.bind('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                scope.$apply(function () {
                    scope.row.isExpanded = !scope.row.isExpanded;
                });
            });

            scope.$watch('row.isExpanded', function (newValue, oldValue) {
                if (newValue === true) {
                    element.parent().addClass('st-expanded');
                } else {
                    element.parent().removeClass('st-expanded');
                }
            });
        }
    };
})
.directive('stCustomSearch', function () {
    return {
        require: '^stTable',
        scope: {
            value: '=stCustomSearch'
        },
        link: function (scope, element, attr, table) {
            scope.$watch('value', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    table.search(scope.value, attr.stPredicate);
                }
            }, true);
        }
    };
});