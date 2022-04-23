(function ($) {
    'use strict';

    /**
     * CustomFormSelect
     *
     * @param {object} customForm
     * @param {object=undefined} options
     *
     * @return {$.CustomFormSelect}
     */
    $.CustomFormSelect = function (customForm, options) {
        // Heritage
        this.customForm = customForm;
        $.extend($.CustomFormSelect.prototype, $.CustomForm.prototype);

        // Elements
        this.elements = {
            body: $('body'),
            context: this.customForm.elementContext,
            input: this.customForm.elementInput,
            wrapper: null,
            wrapperInput: null,
            source: {
                options: null,
                optgroups: null
            },
            wrapperLabel: null,
            wrapperOptions: null
        };

        // Options
        $.extend(true, this.settings = {}, this.customForm.settings, $.CustomFormSelect.defaults, options);

        // Variables
        this.type = this.customForm.support.type;
        this.multiple = this.getInput().prop('multiple');
        this.multipleOptions = [];
        this.keyboard = {
            timeout: null,
            search: [],
            options: {}
        };

        // Init
        if (this.prepareUserOptions()) {
            this.init();
        }

        return this;
    };

    /**
     * Default options
     *
     * @type {{beforeWrap: undefined, beforeLoad: undefined, onClick: undefined, onChange: undefined, classes: {last: string, optionGroup: string, multiple: string, toggle: string, label: string, content: string, options: string, focused: string, optionGroupLabel: string, first: string, selected: string, open: string, option: string}, onComplete: undefined, multipleOptionsSeparator: string, onReset: undefined, afterEventsHandler: undefined}}
     */
    $.CustomFormSelect.defaults = {
        classes: {
            label: '{prefix}-select-label',
            toggle: '{prefix}-select-toggle',
            content: '{prefix}-select-content',
            options: '{prefix}-select-options',
            option: '{prefix}-select-option',
            optionGroup: '{prefix}-select-optiongroup',
            optionGroupLabel: '{prefix}-select-optiongroup-label',
            first: 'is-first',
            last: 'is-last',
            selected: 'is-selected',
            focused: 'is-focused',
            multiple: 'is-multiple',
            open: 'is-open'
        },
        multipleOptionsSeparator: ', ',
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
     * @type {{getSourceOptgroups: (function(): null|*), clickHandler: $.CustomFormSelect.clickHandler, getSourceOptions: (function(): null|*), getOptionFromValue: (function((string|number)): boolean), wrapOption: (function(int, jQuery.CustomFormSelectOption, Object): *|jQuery|HTMLElement), getDefaultInput: (function(): jQuery|HTMLElement|*), getWrapperOptions: (function(): null|*), getDefaultValue: (function(): *), getCurrentValue: (function(): *[]), closeSiblings: (function(): $.CustomFormSelect), close: (function(*): *|$.CustomFormSelect), autoscrollWrapperOptions: $.CustomFormSelect.autoscrollWrapperOptions, init: (function(): $.CustomFormSelect), loadOption: (function((Object|string)): jQuery.CustomFormSelectOption), getOptionOnkeyboard: (function(): null), selectOptions: (function((string|Object)=): $.CustomFormSelect), isMultiple: (function(): string|boolean|string|*), getSiblings: (function(): *), getToggleBtn: (function(): *), unselectOptions: (function((string|Object)=, boolean=): $.CustomFormSelect), isOpen: (function(): *), keyboardHandler: $.CustomFormSelect.keyboardHandler, getWrapperLabel: (function(): null|jQuery|HTMLElement|*), reset: (function(): $.CustomFormSelect), setLabel: (function((string|Object[])): $.CustomFormSelect), eventsHandler: $.CustomFormSelect.eventsHandler, getOptions: (function(Object=): *), wrap: (function(): $.CustomFormSelect)}}
     */
    $.CustomFormSelect.prototype = {
        /**
         * Initialisation
         */
        init: function () {
            // User callback
            if (this.settings.beforeLoad !== undefined) {
                this.settings.beforeLoad.call({
                    customFormSelect: this,
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
                    customFormSelect: this,
                    elements: this.getElements()
                });
            }

            return this;
        },

        /**
         * Build wrappers
         */
        wrap: function () {
            var self = this;

            // Main wrapper
            self.elements.wrapper = $('<div>', {
                'class': self.settings.classes.prefix + ' ' + self.settings.classes.prefix + '--' + self.getInputType()
            });
            // Input wrapper
            self.elements.wrapperInput = $('<div>', {
                'class': self.settings.classes.input
            });

            // User callback
            if (self.settings.beforeWrap !== undefined) {
                self.settings.beforeWrap.call({
                    customForm: self,
                    elements: self.getElements()
                });
            }

            // Update main wrapper
            self.getInput().parent().wrapInner(self.getWrapper());
            self.elements.wrapper = self.getInput().parent();

            // Update input wrapper
            self.getInput().wrap(self.getWrapperInput());
            self.elements.wrapperInput = self.getInput().parent();

            // Get <select> data
            self.elements.source.options = self.getInput().children('option');
            self.elements.source.optgroups = self.getInput().children('optgroup');

            // Label
            self.getWrapperInput().append($('<div>', {
                'class': self.settings.classes.label
            }));
            self.elements.wrapperLabel = self.getInput().next();

            // Toggle button
            self.elements.toggle = $('<button>', {
                'class': self.settings.classes.toggle,
                type: 'button',
                'aria-expanded': true,
            });
            if (!self.isDisabled()) {
                self.elements.toggle.attr('tabindex', self.settings.tabindexStart);
            }
            self.getWrapperLabel().append(self.elements.toggle);

            // Content
            self.getWrapperInput().append($('<div>', {
                'class': self.settings.classes.content
            }));
            self.elements.wrapperContent = self.getWrapperLabel().next();

            // Options
            self.elements.wrapperOptions = $('<ul>', {
                'class': self.settings.classes.options,
                tabindex: -1
            }).appendTo(self.elements.wrapperContent);

            // Replace input
            var inputId = self.getInput().attr('id');
            var inputName = self.getInput().attr('name');
            var inputAttributes = {};
            if (inputId !== undefined) {
                inputAttributes.id = inputId;
            }
            if (inputName !== undefined) {
                inputAttributes.name = inputName;
            }
            var defaultInputAttributes = {
                'type': 'hidden',
                'tabindex': -1,
                'aria-hidden': true
            };

            self.getInput().remove();
            self.elements.defaultInput = $('<input>', defaultInputAttributes);
            self.elements.defaultInput.prependTo(self.getWrapperInput());

            // Multiple
            if (self.isMultiple()) {
                self.getWrapper().addClass(self.settings.classes.multiple);
            }

            // Option
            if (self.getSourceOptions().length) {
                $.each(self.getSourceOptions(), function (indexOption, option) {
                    option = $(option);
                    self.getWrapperOptions().append(self.wrapOption(indexOption, option, inputAttributes));
                });
            }

            // Optgroups
            if (self.getSourceOptgroups().length) {
                $.each(self.getSourceOptgroups(), function (indexOptgroup, optgroup) {
                    optgroup = $(optgroup);
                    var selectOptionGroup = $('<ul>', {
                        'class': self.settings.classes.optionGroup
                    });
                    $('<li>', {
                        'class': self.settings.classes.optionGroupLabel,
                        html: optgroup.attr('label')
                    }).appendTo(selectOptionGroup);

                    // Option
                    optgroup.children('option').each(function (indexOptgroupOption, option) {
                        option = $(option);
                        selectOptionGroup.append(self.wrapOption(indexOptgroupOption, option, inputAttributes));
                    });

                    self.getWrapperOptions().append($('<li>', {html: selectOptionGroup}));
                });
            }

            // First/last option
            self.getOptions()
                .first().addClass(self.settings.classes.first).end()
                .last().addClass(self.settings.classes.last);

            return self;
        },

        /**
         * Option wrapper
         *
         * @param {int} index
         * @param {CustomFormSelectOption} option
         * @param {object} inputAttributes
         * @returns {jQuery|HTMLElement}
         */
        wrapOption: function (index, option, inputAttributes) {
            var optionClasses = option.attr('class');
            var optionDisabled = option.attr('disabled') !== undefined;
            var optionWrapper = $('<li>', {
                'class': this.settings.classes.option + (optionClasses !== undefined ? ' ' + optionClasses : '') + (optionDisabled ? ' ' + this.settings.classes.disabled : '')
            });

            inputAttributes.class = this.settings.classes.option + '-input';
            inputAttributes.value = option.val();
            inputAttributes.type = this.isMultiple() ? 'checkbox' : 'radio';
            inputAttributes.tabindex = -1;
            $('<input>', inputAttributes).appendTo(optionWrapper);

            $('<label>', {
                'class': this.settings.classes.option + '-label',
                html: option.html()
            }).appendTo(optionWrapper);

            return optionWrapper;
        },

        /**
         * Reset elements state
         */
        reset: function () {
            var self = this;
            var defaultValue = self.getDefaultValue();
            self.getWrapper().removeClass(self.settings.classes.disabled + ' ' + self.settings.classes.required);

            // Disabled
            if (self.isDisabled()) {
                self.getWrapper().addClass(self.settings.classes.disabled);
            }

            // Required
            if (self.isRequired()) {
                self.getWrapper().addClass(self.settings.classes.required);
            }

            // Default value(s)
            if (defaultValue === undefined) {
                defaultValue = self.getSourceOptions().filter('[selected]');

                if (defaultValue.length === 0) {
                    defaultValue = self.getSourceOptions().first();
                }

                if (defaultValue.length > 1) {
                    var defaultValues = [];

                    $.each(defaultValue, function (i, selectedOption) {
                        defaultValues.push($(selectedOption).val());
                    });

                    defaultValue = defaultValues.join(',');

                } else {
                    self.setLabel(defaultValue.html());
                    defaultValue = defaultValue.val();
                }

                self.getDefaultInput().val(defaultValue);
            }

            // In multiple mode, we skip the first option
            if (self.isMultiple()) {
                var firstOption = self.loadOption('.' + self.settings.classes.first);

                if (defaultValue === firstOption.getValue()) {
                    defaultValue = null;
                    self.setLabel(firstOption.getName());
                }
            }

            // Add options
            self.getOptions().each(function (i, option) {
                option = self.loadOption(option);
                var optionValue = option.getValue();
                var settings = {
                    context: 'init'
                };

                if (self.isMultiple() && defaultValue !== null) {
                    if (typeof defaultValue === 'string') {
                        defaultValue = defaultValue.split(',');
                    }

                    // Reset
                    option.unselect();

                    // Add
                    $.each(defaultValue, function (i, defaultOptionValue) {
                        if (optionValue === defaultOptionValue) {
                            option.select(settings);
                        }
                    });

                } else if (optionValue === defaultValue) {
                    option.select(settings);
                }
            });

            return self;
        },

        /**
         * Events handler
         */
        eventsHandler: function () {
            var self = this;

            // Select option
            var toggleTimeout = undefined;
            self.getToggleBtn().on('click.customform.open keydown.customform.open', function (event) {
                if (self.isDisabled()) {
                    return;
                }

                clearTimeout(toggleTimeout);
                toggleTimeout = setTimeout(function () {
                    if (event.type === 'click' || event.type === 'keydown' && event.key === 'Enter') {
                        self.clickHandler(event);

                    } else if (event.type === 'keydown') {
                        self.keyboardHandler(event);
                    }
                }, 100);

                // Stop scroll
                if (event.type === 'keydown' && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Space')) {
                    event.preventDefault();
                }
            });

            // Keyboard option
            self.getWrapperOptions().on('keydown.customform.options', function (event) {
                self.keyboardHandler(event);
            });

            // Reset
            self.getContext().on('reset.customform', function (event) {
                self.onReady(function () {
                    self.reset();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            customFormSelect: self,
                            form: $(event.currentTarget)
                        });
                    }
                });
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    customFormSelect: self,
                    elements: self.getElements()
                });
            }
        },

        /**
         * Toggle button event handler
         *
         * @param {object} event
         */
        clickHandler: function (event) {
            var self = this;
            var toggleTimeout = undefined;

            // Close siblings CustomFormSelect
            self.closeSiblings();

            // Close on second click
            self.getToggleBtn().focus().on('click.customform.close keydown.customform.close', function (event) {
                clearTimeout(toggleTimeout);
                toggleTimeout = setTimeout(function () {
                    if (event.type === 'click' || event.type === 'keydown' && event.key === 'Enter') {
                        self.close();
                    }
                }, 100);
            });

            // Close on click outside
            self.getElements().body.on('click.customform.close', function (event) {
                var target = $(event.target);
                var isOption = target.hasClass(self.settings.classes.option) || target.hasClass(self.settings.classes.option + '-input') || target.hasClass(self.settings.classes.option + '-label');

                if ((!self.isMultiple() && isOption) || (!target.hasClass(self.settings.classes.toggle) && !isOption)) {
                    self.close();
                }
            });

            // Open options list
            self.getWrapper().addClass(self.settings.classes.open);

            // Add options event
            self.getOptions().on('click.customform.option', function (event) {
                self.loadOption(event.currentTarget).select({context: event.type});
            }).each(function (i, option) {
                option = self.loadOption(option);

                if (!self.isDisabled() && !option.isDisabled()) {
                    option.getOption().attr('tabindex', self.settings.tabindexStart);
                }
            });

            // User callback
            if (self.settings.onClick !== undefined) {
                self.settings.onClick.call({
                    customFormSelect: self,
                    event: event,
                    elements: self.getElements(),
                    options: self.getOptions()
                });
            }
        },

        /**
         * Keyboard event handler
         *
         * @param {object} event
         */
        keyboardHandler: function (event) {
            var self = this;
            var option = null;
            var currentOptionIndex = 0;
            var optionsLength = 0;
            var isEnter = event.key === 'Enter';
            var isSpace = event.key === 'Space' || event.key === ' ' || (event.keyCode !== undefined && event.keyCode === 32);
            var isTabUp = event.shiftKey && event.key === 'Tab' && self.isOpen();
            var isTabDown = !event.shiftKey && event.key === 'Tab' && self.isOpen();
            var direction = (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || isTabUp) ? 'up' : (event.key === 'ArrowDown' || event.key === 'ArrowRight' || isTabDown) ? 'down' : undefined;
            var fastDirection = (event.key === 'PageDown' || event.metaKey && direction === 'down') ? 'last' : (event.key === 'PageUp' || event.metaKey && direction === 'up') ? 'first' : undefined;
            var isClose = (event.key === 'Escape' || isEnter) && self.isOpen();
            var isLetter = /[a-z0-9\-_]/i.test(event.key);

            if (isSpace || isEnter) {
                // Stop scroll
                event.preventDefault();

                // Space selection
                if (self.isMultiple()) {
                    option = self.getOptions('.' + self.settings.classes.focused);

                    if (self.isOpen()) {
                        if (option.length) {
                            option = self.loadOption(option);
                            option.select();
                        }
                    }
                }

                return;
            }

            // Close
            if (isClose) {
                setTimeout(function () {
                    self.close();
                }, 100);

                return;
            }

            // Select option
            self.getOptions().each(function (i, option) {
                option = self.loadOption(option);
                self.keyboard.options[i] = option;

                if (self.isMultiple()) {
                    if (option.hasState('focused')) {
                        currentOptionIndex = i;
                    }

                } else if (option.isSelected()) {
                    currentOptionIndex = i;
                }

                optionsLength++;
            });

            // Switch option
            if (direction !== undefined || fastDirection !== undefined) {
                event.preventDefault();
                self.closeSiblings();

                if (fastDirection !== undefined) {
                    direction = fastDirection;
                    option = direction === 'last' ? self.keyboard.options[optionsLength - 1] : (self.isMultiple() ? self.keyboard.options[1] : self.keyboard.options[0]);

                } else if (direction === 'up') {
                    option = self.keyboard.options[currentOptionIndex - 1];

                } else if (direction === 'down') {
                    option = self.keyboard.options[currentOptionIndex + 1];
                }

                if (option !== undefined && option !== null) {
                    // Select/preselect
                    option[(self.isMultiple() ? 'focus' : 'select')]({
                        context: 'keydown',
                        direction: direction
                    });

                    // Auto-scroll
                    if (self.isOpen()) {
                        self.autoscrollWrapperOptions(option, direction);
                    } else if (self.isMultiple()) {
                        self.clickHandler();
                    }
                }
            }

            if (isLetter) {
                clearTimeout(self.keyboard.timeout);
                self.keyboard.search.push(event.key);

                self.keyboard.timeout = setTimeout(function () {
                    option = self.getOptionOnkeyboard();

                    if (option !== null) {
                        option.select({context: 'keydown'});
                    }
                }, 250);
            }
        },

        /**
         * Get the best option from keyboard input
         *
         * @return {object|string}
         */
        getOptionOnkeyboard: function () {
            var self = this;
            var out = null;
            var searchString = this.keyboard.search.join('');
            var seachResults = [];
            var searchIndexResult = [];

            // Results
            self.getOptions().each(function (i, option) {
                option = self.loadOption(option);
                seachResults.push(option.getName().toLowerCase().indexOf(searchString));
            });

            // Index results
            if (seachResults.length) {
                $.each(seachResults, function (seachIndex, searchStringIndex) {
                    if (searchStringIndex !== -1) {
                        searchIndexResult.push(seachIndex);
                    }
                });
            }

            // Get first result
            if (searchIndexResult.length) {
                searchIndexResult = searchIndexResult.shift();

                if (typeof self.keyboard.options[searchIndexResult] === 'object') {
                    out = self.keyboard.options[searchIndexResult];
                }
            }

            // Reset search
            self.keyboard.search = [];

            return out;
        },

        /**
         * Auto-scroll options wrapper
         *
         * @param {object} option
         * @param {string} direction
         */
        autoscrollWrapperOptions: function (option, direction) {
            var self = this;

            // Directions
            if (direction === 'first' || direction === 'last') {
                self.getWrapperOptions().scrollTop(direction === 'first' ? 0 : self.getWrapperOptions()[0].scrollHeight);

            } else {
                var currentSelectionTop = parseInt(option.getOption().position().top);
                var currentScrollTop = parseInt(self.getWrapperOptions().scrollTop());
                var wrapperHeight = Math.round(self.getWrapperOptions().outerHeight());
                var optionHeight = Math.round(option.getOption().outerHeight());
                var hasScrolled = false;

                if (currentSelectionTop > (wrapperHeight - optionHeight)) {
                    self.getWrapperOptions().scrollTop(currentScrollTop + optionHeight);
                    hasScrolled = true;
                } else if (currentSelectionTop < 0) {
                    self.getWrapperOptions().scrollTop(currentScrollTop - optionHeight);
                    hasScrolled = true;
                }

                // Skip disabled options
                if (hasScrolled) {
                    var futureOption = self.loadOption(option.getOption()[direction === 'up' ? 'prev' : 'next']());

                    if (futureOption.getOption().length && futureOption.isDisabled()) {
                        self.autoscrollWrapperOptions(futureOption, direction);
                    }
                }
            }
        },

        /**
         * Close options wrapper
         */
        close: function (event) {
            var self = (event !== undefined && event.data !== undefined && event.data.self !== undefined) ? event.data.self : this;

            self.getWrapper().removeClass(self.settings.classes.open);
            self.getToggleBtn().focus().off('click.customform.close keydown.customform.close');
            self.getOptions().off('click.customform.option').each(function (i, option) {
                option = self.loadOption(option);
                option.getOption().attr('tabindex', -1);
            });
            self.getElements().body.off('click.customform.close');

            // User callback
            if (self.settings.onClose !== undefined) {
                self.settings.onClose.call({
                    customFormSelect: self
                });
            }

            return self;
        },

        /**
         * Close siblings CustomFormSelect
         */
        closeSiblings: function () {
            var self = this;
            var siblings = self.getSiblings();

            if (siblings.length) {
                siblings.each(function (i, select) {
                    $(select)
                        .removeClass(self.settings.classes.open)
                        .find('.' + self.settings.classes.toggle)
                        .off('click.customform.close keydown.customform.close').end()
                        .find('.' + self.settings.classes.option)
                        .off('click.customform.option');
                });
            }

            return self;
        },

        /**
         * Set a custom label
         *
         * @param {string|object[]} name
         */
        setLabel: function (name) {
            if (this.isMultiple() && typeof name === 'object') {
                name = name.join(this.settings.multipleOptionsSeparator);
            }

            this.getToggleBtn().html(name);

            return this;
        },

        /**
         * Return true if <select> is multiple
         *
         * @return {boolean}
         */
        isMultiple: function () {
            return this.multiple;
        },

        /**
         * Return true if options wrapper is open
         *
         * @return {boolean}
         */
        isOpen: function () {
            return this.getWrapper().hasClass(this.settings.classes.open);
        },

        /**
         * Return others CustomFormSelect into the current context
         *
         * @return {object}
         */
        getSiblings: function () {
            return this.getContext().find('.' + this.settings.classes.prefix + '--' + this.getInputType()).not(this.getWrapper());
        },

        /**
         * Return label wrapper (.customform-select-label)
         *
         * @return {object}
         */
        getWrapperLabel: function () {
            return this.getElements().wrapperLabel;
        },

        /**
         * Return toggle button
         *
         * @return {object}
         */
        getToggleBtn: function () {
            return this.getElements().toggle;
        },

        /**
         * Return default input
         *
         * @return {object}
         */
        getDefaultInput: function () {
            return this.getElements().defaultInput;
        },

        /**
         * Return current value
         *
         * @return {array}
         */
        getCurrentValue: function () {
            var self = this;
            var values = [];
            var options = self.getOptions('.' + self.settings.classes.selected);

            if (options.length) {
                options.each(function (i, option) {
                    option = self.loadOption(option);

                    values.push(option.getValue());
                });
            }

            return values;
        },

        /**
         * Return default value
         *
         * @return {string|object}
         */
        getDefaultValue: function () {
            var value = this.getDefaultInput().attr('val');

            if (value !== undefined && this.isMultiple()) {
                value = value.split(',');
            }

            return value;
        },

        /**
         * Return options wrapper (.customform-select-options)
         *
         * @return {object}
         */
        getWrapperOptions: function () {
            return this.getElements().wrapperOptions;
        },

        /**
         * Return all or filtered options
         *
         * @param {object=undefined} filter Filter selector
         *
         * @return {object}
         */
        getOptions: function (filter) {
            var options = this.getWrapperOptions().find('.' + this.settings.classes.option);

            return filter !== undefined ? options.filter(filter) : options;
        },

        /**
         * Select specified options
         *
         * @param {string|object=undefined} options Selector or options list
         */
        selectOptions: function (options) {
            var self = this;
            options = (options === undefined || typeof options === 'string') ? self.getOptions(options) : options;

            if (!self.isMultiple()) {
                self.setLog('selectOptions() works only with "multiple" attribute. Use loadOption().select() for a classic <select>.', 'warn');
                return;
            }

            if (options.length) {
                options.each(function (i, option) {
                    option = self.loadOption(option);

                    option.select();
                });
            }

            return self;
        },

        /**
         * Unselect specified options
         *
         * @param {string|object=undefined} options Selector or options list
         * @param {boolean=undefined} disable Disable option in same time
         */
        unselectOptions: function (options, disable) {
            var self = this;
            options = (options === undefined || typeof options === 'string') ? self.getOptions(options) : options;
            disable = disable || false;

            if (!self.isMultiple()) {
                self.setLog('removeOptions() works only with "multiple" attribute. Use loadOption().select() for a classic <select>.', 'warn');
                return;
            }

            if (options.length) {
                $.each(options, function (i, option) {
                    option = self.loadOption(option);

                    if (option.isSelected()) {
                        option.unselect();
                    }

                    if (disable) {
                        option.disable();
                    }
                });
            }

            if (self.getOptions('.is-selected').length === 0) {
                self.reset();
            }

            return self;
        },

        /**
         * Return an option from a specified value
         *
         * @param {string|number} value
         *
         * @return {object|boolean}
         */
        getOptionFromValue: function (value) {
            var self = this;
            var options = self.getOptions();

            if (options.length) {
                $.each(options, function (i, option) {
                    option = self.loadOption(option);

                    if (option.getValue() === value) {
                        return option;
                    }
                });
            }

            return false;
        },

        /**
         * Return <option> from the <select> source
         *
         * @return {object}
         */
        getSourceOptions: function () {
            return this.getElements().source.options;
        },

        /**
         * Return <optgroup> from the <select> source
         *
         * @return {object}
         */
        getSourceOptgroups: function () {
            return this.getElements().source.optgroups;
        },

        /**
         * Load a child option class
         *
         * @param {object|string} option
         */
        loadOption: function (option) {
            if (typeof option === 'string') {
                option = this.getOptions(option);
            }

            return new $.CustomFormSelectOption(this, option);
        }
    };

    /**
     * CustomForm Select Option
     *
     * @param {object} customFormSelect
     * @param {object|string} option
     */
    $.CustomFormSelectOption = function (customFormSelect, option) {
        if (typeof option === 'object' && !(option instanceof jQuery)) {
            option = $(option);
        }

        this.customForm = customFormSelect.customForm;
        this.customFormSelect = customFormSelect;
        this.option = option;

        return this;
    };

    /**
     * Methods
     *
     * @type {{setName: (function((string|html)): $.CustomFormSelectOption), getLabel: (function(): *), select: (function(Object=): $.CustomFormSelectOption), unselect: (function(): $.CustomFormSelectOption), getName: (function(): *), isLast: (function(): boolean), focus: (function(Object=): $.CustomFormSelectOption), getOption: (function(): *), getInput: (function(): *), hasState: (function(string): *), isFirst: (function(): boolean), getValue: ((function(): (string|null))|*), disable: (function(): $.CustomFormSelectOption), setValue: (function((string|number)): $.CustomFormSelectOption), isSelected: (function(): boolean), removeState: (function(string): $.CustomFormSelectOption), isDisabled: (function(): boolean), addState: (function(string): $.CustomFormSelectOption)}}
     */
    $.CustomFormSelectOption.prototype = {
        /**
         * Return the specified option
         *
         * @return {object}
         */
        getOption: function () {
            return this.option;
        },

        /**
         * Return <input> option
         *
         * @return {object}
         */
        getInput: function () {
            return this.getOption().children('input');
        },

        /**
         * Return label option
         *
         * @return {object}
         */
        getLabel: function () {
            return this.getOption().children('label');
        },

        /**
         * Select this option
         *
         * @param {object=undefined} settings Optional parameters
         */
        select: function (settings) {
            var self = this;
            var callbackEvent = {};
            settings = settings || {};

            if (self.getOption() !== undefined && self.getOption() !== null && self.getOption().length && self.getValue() !== undefined) {
                // Skip option if it is disabled
                if (self.isDisabled() && settings.direction !== undefined) {
                    self.option = self.getOption()[settings.direction === 'up' ? 'prev' : 'next']();

                    self.select({
                        context: 'auto-move',
                        direction: settings.direction
                    });

                    return;
                }

                // Stop if the last option is disabled, skip
                if (self.isDisabled()) {
                    return;

                } else {
                    // Multiple mode
                    if (self.customFormSelect.isMultiple()) {
                        var optionsNames = [];

                        // Clear "none" option
                        if (self.customFormSelect.multipleOptions.length === 1 && self.customFormSelect.multipleOptions[0].isFirst()) {
                            self.customFormSelect.multipleOptions[0].getInput().prop('checked', false);
                            self.customFormSelect.multipleOptions[0].removeState('selected');
                            self.customFormSelect.multipleOptions = [];
                        }

                        // If option is already selected we rebuild selection list, otherwise we just add the option
                        if (self.isSelected()) {
                            self.customFormSelect.multipleOptions = [];
                            self.getInput().prop('checked', false);
                            self.removeState('selected');

                            self.customFormSelect.getOptions('.' + self.customFormSelect.settings.classes.selected).each(function (i, selectedOption) {
                                self.customFormSelect.multipleOptions.push(self.customFormSelect.loadOption(selectedOption));
                            });

                            if (self.customFormSelect.multipleOptions.length === 0 && (settings.context === undefined || (settings.context !== undefined && settings.context !== 'unselect'))) {
                                self.customFormSelect.onReady(function () {
                                    self.customFormSelect
                                        .loadOption('.' + self.customFormSelect.settings.classes.first)
                                        .select(settings);
                                });
                            }
                        } else {
                            self.customFormSelect.multipleOptions.push(self);
                        }

                        // Sort options
                        self.customFormSelect.multipleOptions.sort(function (a, b) {
                            var options = self.customFormSelect.getOptions();
                            a = options.index(a);
                            b = options.index(b);

                            if (a === b) {
                                return 0;
                            }
                            return a < b ? -1 : 1;
                        });

                        // Reset
                        self.customFormSelect.getOptions().removeClass(self.customFormSelect.settings.classes.selected);

                        // Add
                        $.each(self.customFormSelect.multipleOptions, function (i, option) {
                            if (!option.isDisabled()) {
                                optionsNames.push(option.getName());

                                option.getInput().prop('checked', true);
                                option.addState('selected');
                            }
                        });

                        // Label
                        self.customFormSelect.setLabel(optionsNames);

                        // User callback
                        if (self.customFormSelect.settings.onChange !== undefined) {
                            callbackEvent = $.extend(callbackEvent, {
                                options: self.customFormSelect.multipleOptions
                            });
                        }
                    }

                    // Classic mode
                    else {
                        // Label
                        self.customFormSelect.setLabel(self.getName());

                        // Option
                        self.customFormSelect.getOptions().removeClass(self.customFormSelect.settings.classes.selected);
                        self.getInput().prop('checked', true);
                        self.addState('selected');

                        // User callback
                        if (self.customFormSelect.settings.onChange !== undefined) {
                            callbackEvent = $.extend(callbackEvent, {
                                option: self
                            });
                        }
                    }

                    if (settings.context !== 'init') {
                        // Trigger change
                        self.getInput().triggerHandler('click');
                        self.getInput().triggerHandler('change');

                        // User callback
                        if (self.customFormSelect.settings.onChange !== undefined) {
                            callbackEvent = $.extend({
                                customFormSelect: self.customFormSelect,
                                elements: self.customFormSelect.getElements(),
                                settings: settings
                            }, callbackEvent);

                            self.customFormSelect.settings.onChange.call(callbackEvent);
                        }
                    }
                }
            }

            return self;
        },

        /**
         * Unselect this option
         */
        unselect: function () {
            if (this.isSelected()) {
                if (this.customFormSelect.isMultiple()) {
                    this.select({context: 'unselect'});

                } else {
                    this.customFormSelect.reset();
                }
            }

            return this;
        },

        /**
         * Focus this option
         *
         * @param {object=undefined} settings Optional parameters
         */
        focus: function (settings) {
            var self = this;
            settings = settings || {};

            if (self.getOption() !== undefined && self.getOption() !== null && self.getOption().length && self.getValue() !== undefined) {
                // Skip option if it is disabled
                if (self.isDisabled() && settings.direction !== undefined) {
                    self.option = self.getOption()[settings.direction === 'up' ? 'prev' : 'next']();

                    self.focus({
                        context: 'auto-move',
                        direction: settings.direction
                    });

                    return;
                }

                // Stop if the last option is disabled, skip
                if (self.isDisabled()) {
                    return;

                } else {
                    self.customFormSelect.getOptions().removeClass(self.customFormSelect.settings.classes.focused);

                    if (self.isFirst()) {
                        self.customFormSelect.getToggleBtn().focus();
                        
                    } else {
                        self.addState('focused');
                        self.getOption().focus();
                    }
                }
            }

            return self;
        },

        /**
         * Add a class state
         *
         * @param {string} state
         */
        addState: function (state) {
            this.getOption().addClass(this.customFormSelect.settings.classes[state]);

            return this;
        },

        /**
         * Return true if the state is on this option
         *
         * @param {string} state
         *
         * @return {boolean}
         */
        hasState: function (state) {
            return this.getOption().hasClass(this.customFormSelect.settings.classes[state]);
        },

        /**
         * Remove a class state
         *
         * @param {string} state
         */
        removeState: function (state) {
            this.getOption().removeClass(this.customFormSelect.settings.classes[state]);

            return this;
        },

        /**
         * Disable this option
         */
        disable: function () {
            return this.addState('disabled');
        },

        /**
         * Return true if this option is selected
         *
         * @return {boolean}
         */
        isSelected: function () {
            return this.hasState('selected');
        },

        /**
         * Return true if this option is the first one
         *
         * @return {boolean}
         */
        isFirst: function () {
            return this.hasState('first');
        },

        /**
         * Return true if this option is the last one
         *
         * @return {boolean}
         */
        isLast: function () {
            return this.hasState('last');
        },

        /**
         * Return true if this option is disabled
         *
         * @return {boolean}
         */
        isDisabled: function () {
            return this.hasState('disabled');
        },

        /**
         * Return option name in HTML
         *
         * @return {string}
         */
        getName: function () {
            return this.getLabel().html();
        },

        /**
         * Set option name
         *
         * @param {string|html} name
         */
        setName: function (name) {
            this.getLabel().html(name);

            return this;
        },

        /**
         * Return option value
         *
         * @return {null|string}
         */
        getValue: function () {
            if (this.getInput() !== undefined) {
                return this.getInput().val();
            }

            return null;
        },

        /**
         * Set option value
         *
         * @param {string|number} value
         */
        setValue: function (value) {
            this.getInput().val(value);

            return this;
        }
    };
})(jQuery);