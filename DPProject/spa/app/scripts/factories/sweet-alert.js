/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 * Sweet Alert Directive
 * Official plugin - http://tristanedwards.me/sweetalert
 * Angular implementation inspiring by https://github.com/oitozero/ngSweetAlert
 */


function sweetAlert($timeout, $window) {
    var swal = $window.swal;
    return {
        swal: function (arg1, arg2, arg3) {
            $timeout(function () {
                if (typeof(arg2) === 'function') {
                    swal(arg1, function (isConfirm) {
                        $timeout(function () {
                            arg2(isConfirm);
                        });
                    }, arg3);
                } else {
                    swal(arg1, arg2, arg3);
                }
            }, 200);
        },
        success: function (title, message) {
            $timeout(function () {
                swal(title, message, 'success');
            }, 200);
        },
        error: function (title, message) {
            $timeout(function () {
                swal(title, message, 'error');
            }, 200);
        },
        resolveError: function (err) {
            if (err.status === 401) {
                swal.close();
                return;
            }

            var ErrorMsg = "";
            if (err.data.Message != undefined) {
                var ErrorMsg = err.data.Message + "\n\r";
                if (err.data.ExceptionType != undefined) {
                    ErrorMsg += "Exception Type: " + err.data.ExceptionType + "\n\r";
                }
                if (err.data.ExceptionMessage != undefined) {
                    ErrorMsg += "Exception Message: " + err.data.ExceptionMessage + "\n\r"
                }
            }
            else {
                var ErrorMsg = err.data ;
            }
            swal("Error", ErrorMsg, 'error');
        }, 
        warning: function (title, message) {
            $timeout(function () {
                swal(title, message, 'warning');
            }, 200);
        },
        info: function (title, message) {
            $timeout(function () {
                swal(title, message, 'info');
            }, 200);
        },
        question:function (_title, _text, fnResult) {
            swal({
                title: _title,
                text: _text,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Continue",
                cancelButtonText: "Cancel",
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm && fnResult != undefined) { fnResult(isConfirm); }
            });
        }

    };
};

/**
 * Pass function into module
 */
angular
    .module('homer')
    .factory('sweetAlert', sweetAlert)
