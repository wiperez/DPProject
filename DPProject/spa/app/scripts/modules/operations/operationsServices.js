"use strict";

angular
    .module('app.operations')
    .service('operationsService', ['$modal', '$resource',
        function ($modal, $resource) {
            var srv = {};

            srv.getNumberOfWeeks = function (_month) {
                var start = moment(_month, "MM/DD/YYYY").startOf('month').format('DD');
                var end = moment(_month, "MM/DD/YYYY").endOf('month').format('DD');
                var weeks = (end - start + 1) / 7;
                return Math.ceil(weeks);
            };

            srv.getWeeksOfMonth = function (_month) {
                var weeks = new Array();
                var startDate = moment(_month, "MM/DD/YYYY");
                var endDate = moment(_month, "MM/DD/YYYY").endOf('month');

                for (var i = 1; i <= moment().weeksInYear() ; i++) {
                    
                    if (startDate.month() == moment().weekday(7).weeks(i).month()
                        || startDate.month() == moment().weekday(7).weeks(i).add(6, 'days').month())
                    {
                        weeks.push(
                            (moment().weekday(7).weeks(i) < startDate ? startDate.format('MM/DD/YYYY') : moment().weekday(7).weeks(i).format('MM/DD/YYYY'))
                            + ' - ' +
                            (moment().weekday(7).weeks(i).add(6, 'days') > endDate ? endDate.format('MM/DD/YYYY') : moment().weekday(7).weeks(i).add(6, 'days').format('MM/DD/YYYY'))
                        );
                    }
                }

                return weeks;
            };
           
            srv.getPeriods = function (_year) {
                var periods = [];
                for (var i = 1; i <= 12; i++) {
                    var startDate = moment(i + '/01/' + _year, "MM/DD/YYYY");
                    var endDate = startDate.clone().endOf("month").format("MM/DD/YYYY");
                    periods.push({ key: startDate.format("MM/DD/YYYY"), value: startDate.format("MMMM") + ' (' + startDate.format("MM/DD/YYYY") + '-' + endDate + ')' });
                }

                return periods;
            };

            return srv;
        }


    ]);