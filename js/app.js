var infoHubs = angular.module('infoHubs', ['devices.view.controller', 'restService']);

infoHubs.directive('spinner', function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            startSpinner: '=spin'
        },
        template: '<div></div>',
        link: function (scope, element, attrs) {
            var opts = {
              lines: 13,
              length: 20,
              width: 10,
              radius: 30,
              corners: 1,
              rotate: 0,
              direction: 1,
              color: '#000',
              speed: 1,
              trail: 60,
              shadow: false,
              hwaccel: false,
              className: 'spinner',
              zIndex: 2e9
            };
            var spinner = new Spinner(opts);
            scope.$watch('startSpinner', function (startSpinner) {
                if (startSpinner) {
                    spinner.spin(element[0]);
                } 
                else {
                    spinner.stop();
                }
            });
        }
    }
});





infoHubs.directive('divFileUpload', ['$window', function($window) {
    return {
        restrict: 'A',
        scope: {},
        link: function($scope, $element, $attrs) {
            function clickTarget() {
                $('#' + $attrs.inputTarget).click();
            }

            $element.click(clickTarget);
        }
    }
}]);

