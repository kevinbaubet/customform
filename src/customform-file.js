(function ($) {
    'use strict';

    $.CustomFormFile = function (customForm, options) {
        // Héritage
        this.customForm = customForm;

        // Config
        this.elements  = {
            context: this.customForm.elementContext,
            input: this.customForm.elementInput,
            wrapper: null,
            wrapperInput: null,
            wrapperLabel: null,
            wrapperFile: null
        };
        $.extend(true, this.settings = {}, this.customForm.settings, $.CustomFormFile.defaults, options);

        // Variables
        this.type = this.customForm.support.type;

        // Init
        if (this.prepareOptions()) {
            this.init();
        }

        return this;
    };

    $.CustomFormFile.defaults = {
        labelText: 'Browse...',
        emptyText: 'No file selected.',
        multipleText: '{count} files selected.',
        classes: {
            label: '{prefix}-label',
            file: '{prefix}-file',
            open: 'is-open',
            selected: 'is-selected'
        },
        beforeLoad: undefined,
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
         * @return {boolean}
         */
        prepareOptions: function () {
            // Classes
            this.customForm.replacePrefixClass.call(this);

            return true;
        },

        /**
         * Initialisation
         */
        init: function () {
            // User callback
            if (this.settings.beforeLoad !== undefined) {
                this.settings.beforeLoad.call({
                    customFormFile: this,
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
                    customFormFile: this,
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
                'class': this.settings.classes.input
            });
            this.elements.wrapperLabel = $('<span>', {
                'class': this.settings.classes.label,
                tabindex: this.settings.tabindexStart,
                html: this.settings.labelText
            });
            this.elements.wrapperFile = $('<span>', {
                'class': this.settings.classes.file,
                html: this.settings.emptyText
            });

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    customFormFile: this,
                    elements: this.getElements()
                });
            }

            // Wrapper
            this.getInput().parent().wrapInner(this.getWrapper());
            this.elements.wrapper = this.getInput().parent();

            // WrapperInput
            this.getInput().wrap(this.getWrapperInput());
            this.elements.wrapperInput = this.getInput().parent();

            // WrapperLabel et file
            this.elements.wrapperLabel.appendTo(this.getWrapperInput());
            this.elements.wrapperFile.appendTo(this.getWrapperInput());

            return this;
        },

        /**
         * Initialise l'état des éléments par défaut
         */
        reset: function () {
            // Reset
            this.getWrapper().removeClass(this.settings.classes.disabled);
            this.getWrapperFile().text(this.settings.emptyText);

            // Désactivé ?
            if (this.isDisabled()) {
                this.getWrapper().addClass(this.settings.classes.disabled);
                this.getWrapperLabel().removeAttr('tabindex');
            }

            // Valeur par défaut
            if (this.getInput().val() !== '') {
                this.setWrapperFileValue(this.getInput().get(0));
            }

            return this;
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            // Sélection du fichier
            self.getWrapperLabel().on('click.customform keydown.customform', function (event) {
                if (event.type === 'click' || (event.type === 'keydown' && (event.keyCode === 32 || event.keyCode === 13))) {
                    event.preventDefault();

                    if (self.isDisabled()) {
                        return;
                    }

                    // État
                    self.getWrapper().addClass(self.settings.classes.open);

                    // Trigger click
                    self.getInput()
                        .trigger('click')
                        .triggerHandler('click');

                    // User callback
                    if (self.settings.onClick !== undefined) {
                        self.settings.onClick.call({
                            customFormFile: self,
                            elements: self.getElements()
                        });
                    }
                }
            });

            // Une fois une valeur sélectionnée
            self.getInput().on('change.customform', function (event) {
                // État
                self.getWrapper().removeClass(self.settings.classes.open);

                // Ajout de la valeur
                self.setWrapperFileValue(event.currentTarget);

                // User callback
                if (self.settings.onChange !== undefined) {
                    self.settings.onChange.call({
                        customFormFile: self,
                        elements: self.getElements()
                    });
                }
            });

            // Reset
            self.getContext().on('reset.customform', function (event) {
                setTimeout(function () {
                    self.reset();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            customFormFile: self,
                            form: $(event.currentTarget)
                        });
                    }
                }, 0);
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    customFormFile: self,
                    elements: self.getElements()
                });
            }
        },

        /**
         * Ajout de la valeur de l'input au wrapperFile
         *
         * @param {object} input Input type file
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
            this.getWrapper().addClass(this.settings.classes.selected);

            return this;
        },

        /**
         * Détermine si l'option est désactivée
         *
         * @return {boolean}
         */
        isDisabled: function () {
            return this.getInput().is(':disabled');
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
         * Retourne le wrapper du label
         *
         * @return {object}
         */
        getWrapperLabel: function () {
            return this.getElements().wrapperLabel;
        },

        /**
         * Retourne le wrapper du fichier
         *
         * @return {object}
         */
        getWrapperFile: function () {
            return this.getElements().wrapperFile;
        }
    };
})(jQuery);