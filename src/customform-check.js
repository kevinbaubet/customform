(function ($) {
    'use strict';

    $.CustomFormCheck = function (CustomForm, options) {
        // Héritage
        this.CustomForm = CustomForm;

        // Config
        this.element  = {
            context: this.CustomForm.elementContext,
            input: this.CustomForm.elementInput,
            type: this.CustomForm.support.type,
            selector: this.CustomForm.support.selector,
            wrapper: null,
            wrapperInput: null
        };
        $.extend(true, (this.settings = {}), this.CustomForm.settings, $.CustomFormCheck.defaults, options);

        // Init
        this.load();
    };

    $.CustomFormCheck.defaults = {
        classes: {
            states: {
                checked: 'is-checked'
            }
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
                    CustomFormCheck: this,
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
                    CustomFormCheck: this,
                    element: this.element
                });
            }
        },

        /**
         * Création des wrappers
         */
        wrap: function () {
            this.element.wrapper = $('<span>', {
                class: this.settings.classes.prefix + ' ' + this.settings.classes.prefix + '--' + this.getInputType()
            });
            this.element.wrapperInput = $('<span>', {
                class: this.settings.classes.input,
                tabindex: this.settings.tabindexStart
            });

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    CustomFormCheck: this,
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
                this.getWrapper().addClass(this.settings.classes.states.checked);
            }
            if (this.getInput().prop('disabled')) {
                this.getWrapper().addClass(this.settings.classes.states.disabled);
                this.getInput().removeAttr('tabindex');
            }
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            self.getWrapper().on('click keyup', function (event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 32)) {
                    event.preventDefault();
                    var isRadio = (self.getInputType() === 'radio');

                    if (self.getInput().prop('disabled')) {
                        return;
                    }

                    if (isRadio) {
                        self.getInputsRadio()
                            .prop('checked', false)
                            .each(function () {
                                self.getWrapper($(this)).removeClass(self.settings.classes.states.checked);
                            });
                    }
                    self.getWrapper()[(isRadio) ? 'addClass' : 'toggleClass'](self.settings.classes.states.checked);
                    self.getInput().prop('checked', (isRadio) ? true : self.getWrapper().hasClass(self.settings.classes.states.checked));

                    // Trigger click
                    self.getInput().triggerHandler('click');

                    // User callback
                    if (self.settings.onClick !== undefined) {
                        self.settings.onClick.call({
                            CustomFormCheck: self,
                            wrapper: self.getWrapper(),
                            input: self.getInput(),
                            type: self.getInputType(),
                            checked: self.getInput().prop('checked')
                        });
                    }
                }
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    CustomFormCheck: this,
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

                self.getWrapper().removeClass(self.settings.classes.states.checked + ' ' + self.settings.classes.states.disabled);

                setTimeout(function () {
                    self.initElementsState();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            CustomFormCheck: self,
                            form: form
                        });
                    }
                }, 0);
            });
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
            if (children !== undefined) {
                return children.closest('.' + this.settings.classes.prefix);
            } else {
                return this.element.wrapper;
            }
        },
        getInputsRadio: function () {
            return this.getContext().find(this.element.selector).filter('[name="' + this.getInput().attr('name') + '"]');
        }
    };
})(jQuery);