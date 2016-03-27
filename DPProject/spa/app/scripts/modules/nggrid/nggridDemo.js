(function () {
    "use strict";

    var app = angular.module("mygrid", ["ngTable", "ngTableDemos"]);

    app.controller("demoController", demoController);

    demoController.$inject = ["NgTableParams", "ngTableSimpleList", '$scope'];

    function demoController(NgTableParams, simpleList, $scope) {
        $scope.tableParams = new NgTableParams({
            // initial sort order
            sorting: { name: "asc" }
        }, {
            dataset: simpleList
        });
    }
})();

(function () {
    "use strict";

    angular.module("mygrid").run(configureDefaults);
    configureDefaults.$inject = ["ngTableDefaults"];

    function configureDefaults(ngTableDefaults) {
        ngTableDefaults.params.count = 5;
        ngTableDefaults.settings.counts = [];
    }
})();


//"use strict";

//angular.module("mygrid", ['ngTable', 'ngTableDemos'])
//    .controller("demoController", ['NgTableParams', 'ngTableSimpleList', function (NgTableParams, simpleList) {
//        this.tableParams = new NgTableParams({
//            // initial sort order
//            sorting: { name: "asc" }
//        }, {
//            dataset: simpleList
//        });
//}]);

   
//angular.module("mygrid")
//    .controller("dynamicDemoController", ["NgTableParams", "ngTableSimpleList", function dynamicDemoController(NgTableParams, simpleList) {
//    this.cols = [
//        { field: "name", title: "Name", sortable: "name", show: true },
//        { field: "age", title: "Age", sortable: "age", show: true },
//        { field: "money", title: "Money", show: true }
//    ];

//    this.tableParams = new NgTableParams({
//        // initial sort order
//        sorting: { age: "desc" }
//    }, {
//        dataset: simpleList
//    });
//}]);


////angular.module("mygrid").run(configureDefaults);
////configureDefaults.$inject = ["ngTableDefaults"];

////function configureDefaults(ngTableDefaults) {
////    ngTableDefaults.params.count = 5;
////    ngTableDefaults.settings.counts = [];
////}


