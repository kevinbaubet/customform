(function ($) {
    'use strict';

    $.CustomFormFile = function (CustomForm, options) {
        // Héritage
        this.CustomForm = CustomForm;

        // Config
        this.element  = {
            context: this.CustomForm.elementContext,
            input: this.CustomForm.elementInput,
            type: this.CustomForm.support.type,
            wrapper: null,
            wrapperInput: null,
            wrapperLabel: null,
            wrapperFile: null
        };
        $.extend(true, (this.settings = {}), this.CustomForm.settings, $.CustomFormFile.defaults, options);

        // Init
        if (this.prepareOptions()) {
            this.load();
        }
    };

    $.CustomFormFile.defaults = {
        labelText: 'Parcourir...',
        emptyText: 'Aucun fichier sélectionné.',
        multipleText: '{count} fichiers sélectionnés',
        classes: {
            label: '{prefix}-label',
            file: '{prefix}-file',
            states: {
                open: 'is-open'
            }
        },
        onLoad: undefined,
        beforeWrap: undefined,
        afterEventsHandler: undefined,
        onComplete: undefined,
        onClick: undefined,
        onChange: undefined,
        onReset: undefined
    };

    $.CustomFormFile.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return bool
         */
        prepareOptions: function () {
            // Classes
            this.CustomForm.replacePrefixClass.call(this);

            return true;
        },

        /**
         * Initialisation
         */
        load: function () {
            // User callback
            if (this.settings.onLoad !== undefined) {
                this.settings.onLoad.call({
                    CustomFormFile: this,
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
                    CustomFormFile: this,
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
                class: this.settings.classes.input
            });
            this.element.wrapperLabel = $('<span>', {
                class: this.settings.classes.label,
                tabindex: this.settings.tabindexStart,
                html: this.settings.labelText
            });
            this.element.wrapperFile = $('<span>', {
                class: this.settings.classes.file,
                html: this.settings.emptyText
            });

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    CustomFormFile: this,
                    wrapper: this.element.wrapper,
                    wrapperInput: this.element.wrapperInput,
                    wrapperLabel: this.element.wrapperLabel,
                    wrapperFile: this.element.wrapperFile
                });
            }

            // Wrapper
            this.getInput().parent().wrapInner(this.element.wrapper);
            this.element.wrapper = this.getInput().parent();

            // WrapperInput
            this.getInput().wrap(this.element.wrapperInput);
            this.element.wrapperInput = this.element.input.parent();

            // WrapperLabel et file
            this.element.wrapperLabel.appendTo(this.element.wrapper);
            this.element.wrapperFile.appendTo(this.element.wrapper);
        },

        /**
         * Initialise l'état des éléments
         */
        initElementsState: function () {
            // Désactivé ?
            if (this.getInput().is(':disabled')) {
                this.getWrapper().addClass(this.settings.classes.states.disabled);
                this.getWrapperLabel().removeAttr('tabindex');
            }

            // Valeur par défaut
            if (this.getInput().val() !== '') {
                this.setWrapperFileValue(this.getInput().get(0));
            }
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            // Sélection du fichier
            self.getWrapperLabel().on('click keyup', function (event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 32)) {
                    event.preventDefault();

                    if (self.getInput().is(':disabled')) {
                        return;
                    }

                    // État
                    self.getWrapper().addClass(self.settings.classes.states.open);

                    // Trigger click
                    self.getInput()
                        .trigger('click')
                        .triggerHandler('click');

                    // User callback
                    if (self.settings.onClick !== undefined) {
                        self.settings.onClick.call({
                            CustomFormFile: self,
                            wrapper: self.getWrapper(),
                            input: self.getInput()
                        });
                    }
                }
            });

            // Une fois une valeur sélectionnée
            self.getInput().on('change', function () {
                var input = $(this);

                // État
                self.getWrapper().removeClass(self.settings.classes.states.open);

                // Ajout de la valeur
                self.setWrapperFileValue(this);

                // User callback
                if (self.settings.onChange !== undefined) {
                    self.settings.onChange.call({
                        CustomFormFile: self,
                        wrapper: self.getWrapper(),
                        input: self.getInput()
                    });
                }
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    CustomFormFile: this,
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

                self.getWrapper().removeClass(self.settings.classes.states.disabled);
                self.getWrapperFile().text(self.settings.emptyText);

                setTimeout(function () {
                    self.initElementsState();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            CustomFormFile: self,
                            form: form
                        });
                    }
                }, 0);
            });
        },

        /**
         * Ajout la valeur de l'input au wrapperFile
         *
         * @param object input Input type file
         */
        setWrapperFileValue: function (input) {
            var filename = null;

            // Nom du fichier
            if (input.files !== undefined && input.files.length > 1) {
                filename = this.settings.multipleText.replace(/{count}/, input.files.length);
            } else {
                filename = input.value.split('\\').pop();
            }

            // Ajout de la valeur
            this.getWrapperFile().text(filename);
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
        getWrapperLabel: function () {
            return this.element.wrapperLabel;
        },
        getWrapperFile: function () {
            return this.element.wrapperFile;
        }
    };
})(jQuery);