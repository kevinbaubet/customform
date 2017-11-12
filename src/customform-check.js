(function ($) {
    'use strict';

    $.CustomFormCheck = function (customForm, options) {
        // Héritage
        this.customForm = customForm;

        // Config
        this.element  = {
            context: this.customForm.elementContext,
            input: this.customForm.elementInput,
            type: this.customForm.support.type,
            selector: this.customForm.support.selector,
            wrapper: null,
            wrapperInput: null
        };
        $.extend(true, (this.settings = {}), this.customForm.settings, $.CustomFormCheck.defaults, options);

        // Init
        this.load();
    };

    $.CustomFormCheck.defaults = {
        classes: {
            checked: 'is-checked'
        },
        onLoad: undefined,
        beforeWrap: undefined,
        afterEventsHandler: undefined,
        onComplete: undefined,
        onClick: undefined,
        onReset: undefined
    };

    $.CustomFormCheck.prototype = {
        /**
         * Initialisation
         */
        load: function () {
            // User callback
            if (this.settings.onLoad !== undefined) {
                this.settings.onLoad.call({
                    customFormCheck: this,
                    element: this.element
                });
            }

            // Load
            this.wrap();
            this.initElementsState();
            this.eventsHandler();
            this.resetHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    customFormCheck: this,
                    element: this.element
                });
            }
        },

        /**
         * Création des wrappers
         */
        wrap: function () {
            this.element.wrapper = $('<span>', {
                'class': this.settings.classes.prefix + ' ' + this.settings.classes.prefix + '--' + this.getInputType()
            });
            this.element.wrapperInput = $('<span>', {
                'class': this.settings.classes.input,
                tabindex: this.settings.tabindexStart
            });

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    customFormCheck: this,
                    wrapper: this.element.wrapper,
                    wrapperInput: this.element.wrapperInput
                });
            }

            // Wrapper
            this.getInput().parent().wrapInner(this.element.wrapper);
            this.element.wrapper = this.getInput().parent();

            // Wrapper this.element.wrapperInput
            this.getInput().wrap(this.element.wrapperInput);
            this.element.wrapperInput = this.element.input.parent();
        },

        /**
         * Initialise l'état des éléments (coché, désactivé, etc)
         */
        initElementsState: function () {
            if (this.getInput().prop('checked')) {
                this.getWrapper().addClass(this.settings.classes.checked);
            }
            if (this.getInput().prop('disabled')) {
                this.disableOption();
            }

            return this;
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            self.getWrapper().on('click keyup', function (event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 32)) {
                    event.preventDefault();

                    self.setOption();
                }
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    customFormCheck: this,
                    element: this.element
                });
            }
        },

        /**
         * Initialise un event "reset" sur le sélecteur contexte
         */
        resetHandler: function () {
            var self = this;

            self.getContext().on('reset', function () {
                var form = $(this);

                self.getWrapper().removeClass(self.settings.classes.checked + ' ' + self.settings.classes.disabled);

                setTimeout(function () {
                    self.initElementsState();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            customFormCheck: self,
                            form: form
                        });
                    }
                }, 0);
            });
        },

        /**
         * Sélectionne une option
         */
        setOption: function () {
            var self = this;
            var isRadio = (self.getInputType() === 'radio');

            if (self.getInput().prop('disabled')) {
                return;
            }

            if (isRadio) {
                self.getInputsRadio()
                    .prop('checked', false)
                    .each(function () {
                        self.getWrapper($(this)).removeClass(self.settings.classes.checked);
                    });
            }
            self.getWrapper()[(isRadio) ? 'addClass' : 'toggleClass'](self.settings.classes.checked);
            self.getInput().prop('checked', (isRadio) ? true : self.getWrapper().hasClass(self.settings.classes.checked));

            // Trigger click
            self.getInput().triggerHandler('click');

            // User callback
            if (self.settings.onClick !== undefined) {
                self.settings.onClick.call({
                    customFormCheck: self,
                    wrapper: self.getWrapper(),
                    input: self.getInput(),
                    type: self.getInputType(),
                    checked: self.getInput().prop('checked')
                });
            }

            return self;
        },

        /**
         * Enlève la sélection de l'option
         */
        removeOption: function (disable) {
            disable = disable || false;

            if (this.getInput().prop('checked')) {
                this.setOption();

                if (disable) {
                    this.disableOption();
                }
            }

            return this;
        },

        /**
         * Désactive une option
         */
        disableOption: function () {
            this.getInput()
                .prop('disabled', true)
                .removeAttr('tabindex');
            this.getWrapper().addClass(this.settings.classes.disabled);

            return this;
        },

        /**
         * Alias pour récupérer les éléments
         */
        getContext: function () {
            return this.element.context;
        },
        getInput: function () {
            return this.element.input;
        },
        getInputType: function () {
            return this.element.type;
        },
        getWrapper: function (children) {
            return (children !== undefined) ? children.closest('.' + this.settings.classes.prefix) : this.element.wrapper;
        },
        getInputsRadio: function () {
            return this.getContext().find(this.element.selector).filter('[name="' + this.getInput().attr('name') + '"]');
        }
    };
})(jQuery);