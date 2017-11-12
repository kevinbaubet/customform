/**
 * CustomForm - Label
 *
 * Ajoute un état sur les labels quand on focus les inputs
 */
(function ($) {
    'use strict';

    $.CustomFormLabel = function (context, options, support) {
        // Éléments
        this.elements = {
            context: context
        };

        // Support
        $.extend((this.support = []), $.CustomFormLabel.support, support);
        this.elements.inputs = $(this.support.join(','), this.elements.context);

        // Config
        $.extend((this.settings = {}), $.CustomFormLabel.defaults, options);

        // Init
        this.load();
    };

    $.CustomFormLabel.support = [
        'input[type="text"]',
        'input[type="password"]',
        'input[type="number"]',
        'input[type="date"]',
        'input[type="month"]',
        'input[type="week"]',
        'input[type="time"]',
        'input[type="datetime"]',
        'input[type="datetime-local"]',
        'input[type="email"]',
        'input[type="search"]',
        'input[type="tel"]',
        'input[type="url"]',
        'textarea'
    ];
    $.CustomFormLabel.defaults = {
        wrapper: '.form-item',
        classes: {
            label: 'customform--label',
            focused: 'is-focused',
            filled : 'is-filled'
        },
        onLoad: undefined,
        afterEventsHandler: undefined,
        onComplete: undefined,
        onFocus: undefined,
        onBlur: undefined
    };

    $.CustomFormLabel.prototype = {
        load: function () {
            // User callback
            if (this.settings.onLoad !== undefined) {
                this.settings.onLoad.call({
                    customFormLabel: this,
                    context: this.getContext(),
                    inputs: this.getInputs()
                });
            }

            // Load
            this.initElementsState();
            this.eventsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    customFormLabel: this,
                    context: this.getContext(),
                    inputs: this.getInputs()
                });
            }
        },

        /**
         * Initialise l'état des éléments
         */
        initElementsState: function () {
            var self = this;

            self.getInputs().each(function () {
                var input = $(this);
                var wrapper = self.getWrapper(input);

                wrapper.addClass(self.settings.classes.label);

                if (input.val().length > 0) {
                    wrapper.addClass(self.settings.classes.filled);
                }
            });
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            self.getInputs().on({
                'click keyup': function (event) {
                    var input = $(this);
                    var wrapper = self.getWrapper(input);

                    wrapper.addClass(self.settings.classes.filled + ' ' + self.settings.classes.focused);

                    // User callback
                    if (self.settings.onFocus !== undefined) {
                        self.settings.onFocus.call({
                            customFormLabel: self,
                            event: event,
                            wrapper: wrapper,
                            input: input
                        });
                    }
                },
                blur: function (event) {
                    var input = $(this);
                    var wrapper = self.getWrapper(input);

                    if (input.val().length > 0) {
                        wrapper.removeClass(self.settings.classes.focused);
                    } else {
                        wrapper.removeClass(self.settings.classes.filled + ' ' + self.settings.classes.focused);
                    }

                    // User callback
                    if (self.settings.onBlur !== undefined) {
                        self.settings.onBlur.call({
                            customFormLabel: self,
                            event: event,
                            wrapper: wrapper,
                            input: input
                        });
                    }
                }
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    customFormLabel: self,
                    elements: self.elements
                });
            }
        },

        /**
         * Alias pour récupérer les éléments
         */
        getContext: function () {
            return this.elements.context;
        },
        getWrapper: function (input) {
            return input.closest(this.settings.wrapper);
        },
        getInputs: function () {
            return this.elements.inputs;
        }
    };

    $.fn.customFormLabel = function (options, support) {
        return new $.CustomFormLabel($(this), options, support);
    };
})(jQuery);