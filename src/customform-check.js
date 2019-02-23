(function ($) {
    'use strict';

    $.CustomFormCheck = function (customForm, options) {
        // Héritage
        this.customForm = customForm;

        // Élements
        this.elements = {
            context: this.customForm.elementContext,
            input: this.customForm.elementInput,
            wrapper: null,
            wrapperInput: null
        };

        // Config
        $.extend(true, this.settings = {}, this.customForm.settings, $.CustomFormCheck.defaults, options);

        // Variables
        this.type = this.customForm.support.type;
        this.selector = this.customForm.support.selector;

        // Init
        return this.init();
    };

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
         * Création des wrappers
         */
        wrap: function () {
            this.elements.wrapper = $('<span>', {
                'class': this.settings.classes.prefix + ' ' + this.settings.classes.prefix + '--' + this.getInputType()
            });
            this.elements.wrapperInput = $('<span>', {
                'class': this.settings.classes.input,
                tabindex: this.settings.tabindexStart
            });

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    customFormCheck: this,
                    elements: this.getElements()
                });
            }

            // Wrapper
            this.getInput().parent().wrapInner(this.getWrapper());
            this.elements.wrapper = this.getInput().parent();

            // Wrapper this.element.wrapperInput
            this.getInput().wrap(this.getWrapperInput());
            this.elements.wrapperInput = this.getInput().parent();

            return this;
        },

        /**
         * Initialise l'état des éléments (coché, désactivé, etc) par défaut
         */
        reset: function () {
            this.getWrapper().removeClass(this.settings.classes.checked + ' ' + this.settings.classes.disabled);

            if (this.isChecked()) {
                this.getWrapper().addClass(this.settings.classes.checked);
            }
            if (this.isDisabled()) {
                this.disable();
            }

            return this;
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            // Check
            self.getWrapper().on('click.customform keydown.customform', function (event) {
                if (event.type === 'click' || (event.type === 'keydown' && event.keyCode === 32)) {
                    event.preventDefault();

                    self.select();
                }
            });

            // Reset
            self.getContext().on('reset.customform', function (event) {
                setTimeout(function () {
                    self.reset();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            customFormCheck: self,
                            form: $(event.currentTarget)
                        });
                    }
                }, 0);
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
         * Sélectionne une option
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
                        self.getWrapper($(input)).removeClass(self.settings.classes.checked);
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
         * Enlève la sélection d'une checkbox
         *
         * @param {boolean=false} disable Désactive la checkbox en même temps
         */
        remove: function (disable) {
            disable = disable || false;

            if (this.isChecked()) {
                if (this.getInputType() === 'radio') {
                    this.customForm.setLog('remove() works only with checkbox. Uses select() on another radio.', 'warn');

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
         * Désactive l'input
         */
        disable: function () {
            this.getInput()
                .prop('disabled', true)
                .removeAttr('tabindex');

            this.getWrapper().addClass(this.settings.classes.disabled);

            return this;
        },

        /**
         * Détermine si l'input est cochée
         *
         * @return {boolean}
         */
        isChecked: function () {
            return this.getInput().prop('checked');
        },

        /**
         * Détermine si l'input est désactivée
         *
         * @return {boolean}
         */
        isDisabled: function () {
            return this.getInput().prop('disabled');
        },

        /**
         * Retourne tous les éléments de customform
         *
         * @return {object}
         */
        getElements: function () {
            return this.elements;
        },

        /**
         * Retourne le contexte de customform (<form>)
         *
         * @return {object}
         */
        getContext: function () {
            return this.getElements().context;
        },

        /**
         * Retourne l'élément <input>
         *
         * @return {object}
         */
        getInput: function () {
            return this.getElements().input;
        },

        /**
         * Retourne le type de l'élément <input>
         *
         * @return {string}
         */
        getInputType: function () {
            return this.type;
        },

        /**
         * Retourne le wrapper générique global (.customform)
         *
         * @param {object=undefined} children Permet de récupérer le wrapper à partir d'un enfant
         *
         * @return {object}
         */
        getWrapper: function (children) {
            return children !== undefined ? children.closest('.' + this.settings.classes.prefix) : this.getElements().wrapper;
        },

        /**
         * Retourne le wrapper générique de l'élément <input> (.customform-input)
         *
         * @return {object}
         */
        getWrapperInput: function () {
            return this.getElements().wrapperInput;
        },

        /**
         * Retourne tous les <inputs> de type radio
         *
         * @return {object}
         */
        getInputsRadio: function () {
            return this.getContext().find(this.selector).filter('[name="' + this.getInput().attr('name') + '"]');
        }
    };
})(jQuery);