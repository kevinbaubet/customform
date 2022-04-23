(function ($) {
    'use strict';

    /**
     * CustomFormCheck
     *
     * @param {object} customForm
     * @param {object=undefined} options
     *
     * @return {jQuery.CustomFormCheck}
     */
    $.CustomFormCheck = function (customForm, options) {
        // Heritage
        this.customForm = customForm;
        $.extend($.CustomFormCheck.prototype, $.CustomForm.prototype);

        // Elements
        this.elements = {
            context: this.customForm.elementContext,
            input: this.customForm.elementInput,
            wrapper: null,
            wrapperInput: null
        };

        // Options
        $.extend(true, this.settings = {}, this.customForm.settings, $.CustomFormCheck.defaults, options);

        // Variables
        this.type = this.customForm.support.type;
        this.selector = this.customForm.support.selector;

        // Init
        if (this.prepareUserOptions()) {
            this.init();
        }

        return this;
    };

    /**
     * Default options
     *
     * @type {{beforeWrap: undefined, beforeLoad: undefined, onClick: undefined, classes: {checked: string}, onComplete: undefined, onReset: undefined, afterEventsHandler: undefined}}
     */
    $.CustomFormCheck.defaults = {
        classes: {
            checked: 'is-checked'
        },
        beforeLoad: undefined,
        beforeWrap: undefined,
        afterEventsHandler: undefined,
        onComplete: undefined,
        onClick: undefined,
        onReset: undefined
    };

    /**
     * Methods
     *
     * @type {{init: (function(): $.CustomFormCheck), getInputsRadio: (function(): *), select: (function(): $.CustomFormCheck), unselect: (function(boolean=): $.CustomFormCheck), disable: (function(): $.CustomFormCheck), reset: (function(): $.CustomFormCheck), eventsHandler: (function(): $.CustomFormCheck), wrap: (function(): $.CustomFormCheck), isChecked: (function(): *)}}
     */
    $.CustomFormCheck.prototype = {
        /**
         * Initialisation
         */
        init: function () {
            // User callback
            if (this.settings.beforeLoad !== undefined) {
                this.settings.beforeLoad.call({
                    customFormCheck: this,
                    elements: this.getElements()
                });
            }

            // Load
            this.wrap();
            this.reset();
            this.eventsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    customFormCheck: this,
                    elements: this.getElements()
                });
            }

            return this;
        },

        /**
         * Build wrappers
         */
        wrap: function () {
            this.elements.wrapper = $('<span>', {
                'class': this.settings.classes.prefix + ' ' + this.settings.classes.prefix + '--' + this.getInputType()
            });
            this.elements.wrapperInput = $('<span>', {
                'class': this.settings.classes.input
            });

            // Tabindex
            this.getInput().attr('tabindex', '-1');
            if (!this.isDisabled()) {
                this.getWrapperInput().attr('tabindex', this.settings.tabindexStart);
            }

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    customFormCheck: this,
                    elements: this.getElements()
                });
            }

            // Main wrapper
            this.getInput().parent().wrapInner(this.getWrapper());
            this.elements.wrapper = this.getInput().parent();

            // Input wrapper
            this.getInput().wrap(this.getWrapperInput());
            this.elements.wrapperInput = this.getInput().parent();

            return this;
        },

        /**
         * Reset elements state
         */
        reset: function () {
            this.getWrapper().removeClass(this.settings.classes.checked + ' ' + this.settings.classes.disabled + ' ' + this.settings.classes.required);

            // Disabled
            if (this.isDisabled()) {
                this.disable();
            }

            // Required
            if (this.isRequired()) {
                this.getWrapper().addClass(this.settings.classes.required);
            }

            // Default value
            if (this.isChecked()) {
                this.getWrapper().addClass(this.settings.classes.checked);
            }

            return this;
        },

        /**
         * Events handler
         */
        eventsHandler: function () {
            var self = this;

            // Check
            self.getWrapper().on('click.customform keydown.customform', function (event) {
                if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === 'Space' || event.key === ' ' || (event.keyCode !== undefined && event.keyCode === 32)))) {
                    if (event.type === 'click' && $(event.target).is('a')) {
                        return;
                    }

                    event.preventDefault();
                    self.select();
                }
            });

            // Reset
            self.getContext().on('reset.customform', function (event) {
                self.onReady(function () {
                    self.reset();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            customFormCheck: self,
                            form: $(event.currentTarget)
                        });
                    }
                });
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    customFormCheck: this,
                    elements: this.getElements()
                });
            }

            return self;
        },

        /**
         * Select an option
         */
        select: function () {
            var self = this;
            var isRadio = (self.getInputType() === 'radio');

            if (self.isDisabled()) {
                return;
            }

            if (isRadio) {
                self.getInputsRadio()
                    .prop('checked', false)
                    .each(function (i, input) {
                        input = $(input);
                        input.closest('.' + self.settings.classes.prefix).removeClass(self.settings.classes.checked);
                    });
            }
            self.getWrapper()[isRadio ? 'addClass' : 'toggleClass'](self.settings.classes.checked);
            self.getInput().prop('checked', isRadio ? true : self.getWrapper().hasClass(self.settings.classes.checked));

            // Trigger click
            self.getInput().triggerHandler('click');
            self.getInput().triggerHandler('change');

            // User callback
            if (self.settings.onClick !== undefined) {
                self.settings.onClick.call({
                    customFormCheck: self,
                    elements: self.getElements(),
                    type: self.getInputType(),
                    checked: self.isChecked()
                });
            }

            return self;
        },

        /**
         * Unselect an option
         *
         * @param {boolean=false} disable Disabled the option in same time
         */
        unselect: function (disable) {
            disable = disable || false;

            if (this.isChecked()) {
                if (this.getInputType() === 'radio') {
                    this.customForm.setLog('unselect() works only with checkbox. Use select() on radio input.', 'warn');

                } else {
                    this.select();
                }

                if (disable) {
                    this.disable();
                }
            }

            return this;
        },

        /**
         * Disable an option
         */
        disable: function () {
            this.getInput()
                .prop('disabled', true)
                .removeAttr('tabindex');

            this.getWrapper().addClass(this.settings.classes.disabled);

            return this;
        },

        /**
         * Return true if the option is checked
         *
         * @return {boolean}
         */
        isChecked: function () {
            return this.getInput().prop('checked');
        },

        /**
         * Return all radio inputs
         *
         * @return {object}
         */
        getInputsRadio: function () {
            return this.getContext().find(this.selector).filter('[name="' + this.getInput().attr('name') + '"]');
        }
    };
})(jQuery);