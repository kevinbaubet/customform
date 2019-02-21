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
        $.extend(this.support = [], $.CustomFormLabel.support, support);
        this.elements.inputs = $(this.support.join(','), this.elements.context);

        // Config
        $.extend(this.settings = {}, $.CustomFormLabel.defaults, options);

        // Init
        this.init();

        return this;
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
        beforeLoad: undefined,
        afterEventsHandler: undefined,
        onComplete: undefined,
        onFocus: undefined,
        onBlur: undefined
    };

    $.CustomFormLabel.prototype = {
        init: function () {
            // User callback
            if (this.settings.beforeLoad !== undefined) {
                this.settings.beforeLoad.call({
                    customFormLabel: this,
                    context: this.getContext(),
                    inputs: this.getInputs()
                });
            }

            // Load
            this.reset();
            this.eventsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    customFormLabel: this,
                    context: this.getContext(),
                    inputs: this.getInputs()
                });
            }

            return this;
        },

        /**
         * Initialise l'état des éléments par défaut
         */
        reset: function () {
            var self = this;

            self.getInputs().each(function (i, input) {
                input = $(input);
                var wrapper = self.getWrapper(input);

                wrapper.addClass(self.settings.classes.label);

                if (input.val().length > 0) {
                    wrapper.addClass(self.settings.classes.filled);
                }
            });

            return self;
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            self.getInputs().on('click.customform keyup.customform blur.customform', function (event) {
                var input = $(event.currentTarget);
                var wrapper = self.getWrapper(input);

                if (event.type === 'blur') {
                    if (input.val().length > 0) {
                        wrapper.removeClass(self.settings.classes.focused);
                    } else {
                        wrapper.removeClass(self.settings.classes.filled + ' ' + self.settings.classes.focused);
                    }

                } else {
                    wrapper.addClass(self.settings.classes.filled + ' ' + self.settings.classes.focused);
                }

                // User callback
                if (self.settings[event.type === 'blur' ? 'onBlur' : 'onFocus'] !== undefined) {
                    self.settings[event.type === 'blur' ? 'onBlur' : 'onFocus'].call({
                        customFormLabel: self,
                        event: event,
                        wrapper: wrapper,
                        input: input
                    });
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
         * Retourne le contexte de customform (<form>)
         *
         * @return {object}
         */
        getContext: function () {
            return this.elements.context;
        },

        /**
         * Retourne le wrapper générique global (.customform)
         *
         * @return {object}
         */
        getWrapper: function (input) {
            return input.closest(this.settings.wrapper);
        },

        /**
         * Retourne tous les inputs du contexte
         *
         * @return {object}
         */
        getInputs: function () {
            return this.elements.inputs;
        }
    };

    $.fn.customFormLabel = function (options, support) {
        return new $.CustomFormLabel($(this), options, support);
    };
})(jQuery);