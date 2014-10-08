'use strict';

angular.module('rk.forms', [])

.directive('serverValidated', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
            if (!ctrl) return;
            attr.serverValidated = true; // force truthy in case we are on non input element
            ctrl.$parsers.unshift(function(viewValue) {
                ctrl.$error.$serverError = null;
                ctrl.$setValidity('server', true);
                return viewValue;
            });
        }
    };
})

.directive('spinner', function() {
    return {
        restrict: 'A',
        link: function(scope, elm, attr) {
            elm.addClass('rk-has-spinner');
            elm.append(' <span class="rk-spinner"><span class="rk-spin glyphicon glyphicon-refresh"></span></span>');
            scope.$watch(attr.spinner, function(spinner) {
                if (spinner) {
                    elm.attr('disabled', 'disabled');
                    elm.addClass('active');
                } else {
                    elm.attr('disabled', null);
                    elm.removeClass('active');
                }
            })
        }
    };
})

// src: http://code.realcrowd.com/on-the-bleeding-edge-advanced-angularjs-form-validation/
.directive(
    'rcSubmit', function($parse) {
        return {
            restrict: 'A',
            require: ['rcSubmit', '?form'],
            controller: ['$scope',
                function($scope) {
                    this.attempted = false;

                    var formController = null;

                    this.setAttempted = function(value) {
                        this.attempted = value;
                    };

                    this.setFormController = function(controller) {
                        formController = controller;
                    };

                    this.needsAttention = function(fieldModelController) {
                        if (!formController) return false;

                        if (fieldModelController) {
                            return fieldModelController.$invalid && (fieldModelController.$dirty || this.attempted);
                        } else {
                            return formController && formController.$invalid && (formController.$dirty || this.attempted);
                        }
                    };
                }
            ],
            compile: function(cElement, cAttributes, transclude) {
                return {
                    pre: function(scope, formElement, attributes, controllers) {

                        var submitController = controllers[0];
                        var formController = (controllers.length > 1) ? controllers[1] : null;

                        submitController.setFormController(formController);

                        scope.rc = scope.rc || {};
                        scope.rc[attributes.name] = submitController;
                    },
                    post: function(scope, formElement, attributes, controllers) {

                        var submitController = controllers[0];
                        var formController = (controllers.length > 1) ? controllers[1] : null;
                        var fn = $parse(attributes.rcSubmit);

                        formElement.bind('submit', function(event) {
                            submitController.setAttempted(true);

                            if (!scope.$$phase) scope.$apply();

                            if (!formController.$valid) {
                                return false;
                            }

                            formController.$submitting = true;
                            fn(scope, {
                                $event: event
                            }).then(function() {
                                submitController.setAttempted(false);
                                formController.$submitting = false;
                            }, function(errors) {
                                formController.$submitting = false;
                                _.each(_.keys(errors), function(errorKey) {
                                    formController[errorKey].$error.$serverError = errors[errorKey].message;
                                    formController[errorKey].$setValidity('server', false);
                                })
                            });
                        });
                    }
                };
            }
        };
    }
);