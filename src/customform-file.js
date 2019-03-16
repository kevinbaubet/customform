(function ($) {
    'use strict';

    /**
     * CustomFormFile
     *
     * @param {object} customForm
     * @param {object=undefined} options
     *
     * @return {$.CustomFormFile}
     */
    $.CustomFormFile = function (customForm, options) {
        // Héritage
        this.customForm = customForm;
        $.extend($.CustomFormFile.prototype, $.CustomForm.prototype);

        // Élements
        this.elements = {
            context: this.customForm.elementContext,
            input: this.customForm.elementInput,
            wrapper: null,
            wrapperInput: null,
            wrapperLabel: null,
            wrapperFile: null
        };

        // Config
        $.extend(true, this.settings = {}, this.customForm.settings, $.CustomFormFile.defaults, options);

        // Variables
        this.type = this.customForm.support.type;

        // Init
        if (this.prepareUserOptions()) {
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
            this.getWrapper().removeClass(this.settings.classes.disabled + ' ' + this.settings.classes.required);
            this.getWrapperFile().text(this.settings.emptyText);

            // Désactivé
            if (this.isDisabled()) {
                this.getWrapper().addClass(this.settings.classes.disabled);
                this.getWrapperLabel().removeAttr('tabindex');
            }

            // Requis
            if (this.isRequired()) {
                this.getWrapper().addClass(this.settings.classes.required);
            }

            // Valeur par défaut
            if (!this.isEmpty()) {
                this.select();
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
            self.getInput().on('change.customform', function () {
                // État
                self.getWrapper().removeClass(self.settings.classes.open);

                // Ajout de la valeur
                self.select();

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
                self.onReady(function () {
                    self.reset();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            customFormFile: self,
                            form: $(event.currentTarget)
                        });
                    }
                });
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
         * Affiche les fichiers sélectionnés
         */
        select: function () {
            var filename = null;
            var files = this.getSelectedFiles();

            // Nom du fichier
            if (files.length > 1) {
                filename = this.settings.multipleText.replace(/{count}/, files.length);
            } else {
                filename = this.getValue();
            }

            // Ajout du label
            this.setLabel(filename);
            this.getWrapper().addClass(this.settings.classes.selected);

            return this;
        },

        /**
         * Retourne la liste des fichiers sélectionnés
         *
         * @return {FileList|Array}
         */
        getSelectedFiles: function () {
            var input = this.getInput().get(0);

            if (input.files !== undefined) {
                return input.files;
            }

            return [];
        },

        /**
         * Retourne la valeur de l'input
         *
         * @return {null|string}
         */
        getValue: function () {
            var input = this.getInput().get(0);

            if (input.value !== undefined) {
                return input.value.split('\\').pop();
            }

            return null;
        },

        /**
         * Modifie le label du fichier sélectionné
         *
         * @param {string} name
         */
        setLabel: function (name) {
            this.getWrapperFile().html(name);

            return this;
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