/**
 * CustomForm - Label
 *
 * Ajoute un état sur les labels quand on focus les inputs
 */
(function($) {
    'use strict';

    $.CustomFormLabel = function(context, options, support) {
        this.context = context;
        this.elements = {};

        // Support
        $.extend((this.support = []), $.CustomFormLabel.support, support);
        this.elements.inputs = $(this.support.join(','), this.context);

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
            label: 'customform-label',
            selected: 'is-selected',
            focused : 'is-focused'
        },
        onLoad: undefined,
        afterEventsHandler: undefined,
        onComplete: undefined,
        onClick: undefined,
        onBlur: undefined
    };

    $.CustomFormLabel.prototype = {
        load: function() {
            // User callback
            if (this.settings.onLoad !== undefined) {
                this.settings.onLoad.call({
                    CustomFormLabel: this,
                    context: this.context,
                    inputs: this.elements.inputs
                });
            }

            // Load
            this.initElementsState();
            this.eventsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    CustomFormLabel: this,
                    context: this.context,
                    inputs: this.elements.inputs
                });
            }
        },

        /**
         * Initialise l'état des éléments
         */
        initElementsState: function() {
            var self = this;

            self.elements.inputs.each(function() {
                var input = $(this);
                var wrapper = self.getWrapper(input);

                wrapper.addClass(self.settings.classes.label);

                if (input.val().length > 0) {
                    wrapper.addClass(self.settings.classes.focused);
                }
            });
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function() {
            var self = this;

            self.elements.inputs.on({
                'click keyup': function(event) {
                    var input = $(this);
                    var wrapper = self.getWrapper(input);

                    wrapper.addClass(self.settings.classes.focused + ' ' + self.settings.classes.selected);

                    // User callback
                    if (self.settings.onClick !== undefined) {
                        self.settings.onClick.call({
                            CustomFormLabel: self,
                            event: event,
                            wrapper: wrapper,
                            input: input
                        });
                    }
                },
                blur: function(event) {
                    var input = $(this);
                    var wrapper = self.getWrapper(input);

                    if (input.val().length > 0) {
                        wrapper.removeClass(self.settings.classes.selected);
                    } else {
                        wrapper.removeClass(self.settings.classes.focused + ' ' + self.settings.classes.selected);
                    }

                    // User callback
                    if (self.settings.onBlur !== undefined) {
                        self.settings.onBlur.call({
                            CustomFormLabel: self,
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
                    CustomFormLabel: self,
                    elements: self.elements
                });
            }
        },

        /**
         * Récupère le wrapper parent depuis un élément enfant
         *
         * @param  jQuery object input
         * @return l'objet jQuery wrapper global
         */
        getWrapper: function(input) {
            return input.closest(this.settings.wrapper);
        }
    };

    $.fn.customFormLabel = function(options, support) {
        return new $.CustomFormLabel($(this), options, support);
    };
})(jQuery);