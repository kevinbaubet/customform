/**
 * CustomForm - Checkbox/Radio
 * 
 * Permet de personnaliser les éléments d'un formulaire
 *
 * @param object        customForm -> Données de CustomForm
 * @param jQuery object context    -> Élément de contexte <form>
 * @param jQuery object element    -> Élément à customiser
 */
(function($) {
    'use strict';
    
    $.CustomFormCheck = function(customForm, context, element) {
        this.context  = context;
        this.element  = {
            input: element,
            type: customForm.inputType,
            wrapper: null,
            wrapperInput: null
        };
        this.settings = customForm.settings;
        $.extend(this.settings.classes.states, {
            checked : 'is-checked',
            disabled: 'is-disabled'
        });
        this.support = customForm.support;

        // Init
        this.setWrappers();
        this.loadHandler();
    };

    $.CustomFormCheck.prototype = {
        /**
         * Création des wrappers
         */
        setWrappers: function() {
            var self = this;
            var wrapper = $('<span>');
            var wrapperInput = $('<span>', {
                class: self.settings.classes.input,
                tabindex: self.settings.tabindexStart
            });

            // User callback
            if (self.settings.beforeWrap !== undefined) {
                self.settings.beforeWrap.call({
                    CustomForm: self,
                    wrapper: wrapper,
                    wrapperInput: wrapperInput
                });
            }
            var beforeWrapperClass = wrapper.attr('class');

            // Wrapper
            wrapper.attr('class', self.settings.classes.prefix + ' ' + self.settings.classes.prefix + '-' + self.getInputType() + ((beforeWrapperClass) ? ' ' + beforeWrapperClass : ''));
            self.getInput().parent().wrapInner(wrapper);
            self.element.wrapper = self.getInput().parent();
            
            // Wrapper input
            self.getInput().wrap(wrapperInput);
            self.element.wrapperInput = self.element.input.parent();
        },

        /**
         * Execute l'initialisation des wrapper et appel les différents handler
         */
        loadHandler: function() {
            this.initElementsState();

            // Start events
            this.eventsHandler();
            this.resetHandler();

            // User callback
            if (this.settings.onLoad !== undefined) {
                this.settings.onLoad.call({
                    CustomForm: this
                });
            }
        },

        /**
         * Initialise l'état des wrappers (coché, désactivé, etc)
         */
        initElementsState: function() {
            if (this.getInput().is(':checked')) {
                this.getWrapper().addClass(this.settings.classes.states.checked);
            }
            if (this.getInput().is(':disabled')) {
                this.getWrapper().addClass(this.settings.classes.states.disabled);
                this.getInput().removeAttr('tabindex');
            }
        },

        /**
         * [eventsHandler description]
         * @return {[type]} [description]
         */
        eventsHandler: function() {
            var self = this;

            self.element.wrapper.on('click keyup', function(event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 32)) {
                    event.preventDefault();
                    var isRadio = (self.getInputType() === 'radio') ? true : false;

                    if (self.getInput().is(':disabled')) {
                        return;
                    }

                    if (isRadio) {
                        self.getInputsRadio()
                            .prop('checked', false)
                            .each(function() {
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
                            CustomForm: self,
                            wrapper: self.getWrapper(),
                            input: self.getInput(),
                            type: self.getInputType(),
                            checked: self.getInput().is(':checked')
                        });
                    }
                }
            });
        },

        /**
         * Initialise un event "reset" sur le sélecteur contexte
         */
        resetHandler: function() {
            var self = this;

            self.context.on('reset', function() {
                var form = $(this);

                $.each(self.support, function(type, selector) {
                    self.getWrapper(form.find(selector)).removeClass(self.settings.classes.states.checked + ' ' + self.settings.classes.states.disabled);
                });

                setTimeout(function() {
                    self.initElementsState();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            CustomForm: self,
                            form: form
                        });
                    }
                }, 0);
            });
        },

        /**
         * [getInput description]
         * @return {[type]} [description]
         */
        getInput: function() {
            return this.element.input;
        },

        /**
         * [getInputType description]
         * @return {[type]} [description]
         */
        getInputType: function() {
            return this.element.type;
        },

        /**
         * [getWrapper description]
         * @return {[type]} [description]
         */
        getWrapper: function(children) {
            if (children !== undefined) {
                return children.closest('.' + this.settings.classes.prefix);
            } else {
                return this.element.wrapper;
            }
        },

        /**
         * [getInputsRadio description]
         * @return {[type]} [description]
         */
        getInputsRadio: function() {
            return this.context.find(this.support[this.getInputType()]).filter('[name="' + this.getInput().attr('name') + '"]');
        }
    };
})(jQuery);