(function ($) {
    'use strict';

    /**
     * CustomFormFile
     *
     * @param {object} customForm
     * @param {object=undefined} options
     *
     * @return {jQuery.CustomFormFile}
     */
    $.CustomFormFile = function (customForm, options) {
        // HEritage
        this.customForm = customForm;
        $.extend($.CustomFormFile.prototype, $.CustomForm.prototype);

        // Elements
        this.elements = {
            context: this.customForm.elementContext,
            input: this.customForm.elementInput,
            wrapper: null,
            wrapperInput: null,
            wrapperLabel: null,
            wrapperFile: null
        };

        // Options
        $.extend(true, this.settings = {}, this.customForm.settings, $.CustomFormFile.defaults, options);

        // Variables
        this.type = this.customForm.support.type;

        // Init
        if (this.prepareUserOptions()) {
            this.init();
        }

        return this;
    };

    /**
     * Default options
     *
     * @type {{beforeWrap: undefined, beforeLoad: undefined, onClick: undefined, multipleText: string, onChange: undefined, emptyText: string, labelText: string, classes: {file: string, label: string, open: string, selected: string}, onComplete: undefined, onReset: undefined, afterEventsHandler: undefined}}
     */
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

    /**
     * Methods
     *
     * @type {{init: (function(): $.CustomFormFile), getValue: ((function(): (string|null))|*), select: (function(): $.CustomFormFile), getWrapperLabel: (function(): null|jQuery|HTMLElement|*), reset: (function(): $.CustomFormFile), setLabel: (function(string): $.CustomFormFile), eventsHandler: $.CustomFormFile.eventsHandler, wrap: (function(): $.CustomFormFile), getSelectedFiles: ((function(): (FileList|Array))|*), getWrapperFile: (function(): null|jQuery|HTMLElement|*)}}
     */
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
         * Build wrappers
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

            // Main wrapper
            this.getInput().parent().wrapInner(this.getWrapper());
            this.elements.wrapper = this.getInput().parent();

            // Input wrapper
            this.getInput().wrap(this.getWrapperInput());
            this.elements.wrapperInput = this.getInput().parent();

            // Label and file wrappers
            this.elements.wrapperLabel.appendTo(this.getWrapperInput());
            this.elements.wrapperFile.appendTo(this.getWrapperInput());

            // Tabindex
            if (!this.isDisabled()) {
                this.elements.wrapperLabel.attr('tabindex', this.settings.tabindexStart);
            }

            return this;
        },

        /**
         * Reset elements state
         */
        reset: function () {
            // Reset
            this.getWrapper().removeClass(this.settings.classes.disabled + ' ' + this.settings.classes.required);
            this.getWrapperFile().text(this.settings.emptyText);

            // Disabled
            if (this.isDisabled()) {
                this.getWrapper().addClass(this.settings.classes.disabled);
                this.getWrapperLabel().removeAttr('tabindex');
            }

            // Required
            if (this.isRequired()) {
                this.getWrapper().addClass(this.settings.classes.required);
            }

            // Default value
            if (!this.isEmpty()) {
                this.select();
            }

            return this;
        },

        /**
         * Events handler
         */
        eventsHandler: function () {
            var self = this;

            // Select button
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

            // On change value
            self.getInput().on('change.customform', function () {
                // State
                self.getWrapper().removeClass(self.settings.classes.open);

                // Add value
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
         * Set selected files
         */
        select: function () {
            var filename;
            var files = this.getSelectedFiles();

            // Filename
            if (files.length > 1) {
                filename = this.settings.multipleText.replace(/{count}/, files.length);
            } else {
                filename = this.getValue();
            }

            // Add label
            this.setLabel(filename);
            this.getWrapper().addClass(this.settings.classes.selected);

            return this;
        },

        /**
         * Return selected files
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
         * Return input value
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
         * Set label of the selected file
         *
         * @param {string} name
         */
        setLabel: function (name) {
            this.getWrapperFile().html(name);

            return this;
        },

        /**
         * Return label wrapper
         *
         * @return {object}
         */
        getWrapperLabel: function () {
            return this.getElements().wrapperLabel;
        },

        /**
         * Return file wrapper
         *
         * @return {object}
         */
        getWrapperFile: function () {
            return this.getElements().wrapperFile;
        }
    };
})(jQuery);