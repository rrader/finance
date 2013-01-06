'use strict';

/* Directives */


angular.module('fin.directives', []).

directive('showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    }).

directive('datePicker', function($timeout) {

    return function(scope, iElement, iAttrs) {
        iElement.datepicker({changeMonth: true,
            changeYear: true, 
            onSelect: function() { setTimeout(function() {iElement.trigger('input');}, 0);}});
        iElement.datepicker( "option", "dateFormat", "dd MM yy" );
    };

}).

directive('date', function (dateFilter) {
    return {
        require:'ngModel',
        link:function (scope, elm, attrs, ctrl) {

            var dateFormat = attrs['date'] || 'dd-MM-yyyy';
            var minDate = Date.parse(attrs['min']) || 0;
            var maxDate = Date.parse(attrs['max']) || 9007199254740992;

            ctrl.$parsers.unshift(function (viewValue) {
                var parsedDateMilissec = Date.parse(viewValue);
                if (parsedDateMilissec > 0) {
                    if (parsedDateMilissec >= minDate && parsedDateMilissec <= maxDate) {
                        ctrl.$setValidity('date', true);
                        return parsedDateMilissec;
                    }
                }

                // in all other cases it is invalid, return undefined (no model update)
                ctrl.$setValidity('date', false);
                return undefined;
            });

            ctrl.$formatters.unshift(function (modelValue) {
                return dateFilter(modelValue, dateFormat);
            });
        }
    };
});
