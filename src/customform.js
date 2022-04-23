(function ($) {
    'use strict';

    /**
     * CustomForm
     *
     * @param {object} context
     * @param {object=undefined} options
     * @param {object=undefined} supports
     *
     * @return {jQuery.CustomForm}
     */
    $.CustomForm = function (context, options, supports) {
        // Options
        $.extend(true, this.settings = {}, $.CustomForm.defaults, options);

        // Supports
        $.extend(this.supports = {}, $.CustomForm.supports, supports);

        // Variables
        this.context = context;
        this.options = {};
        this.support = undefined;

        // Init
        this.prepareUserOptions();

        return this;
    };

    /**
     * Default supports
     *
     * @type {{select: string, file: string, checkbox: string, radio: string}}
     */
    $.CustomForm.supports = {
        checkbox: 'input[type="checkbox"]',
        radio: 'input[type="radio"]',
        select: 'select',
        file: 'input[type="file"]'
    };

    /**
     * Default options
     *
     * @type {{supportComplete: undefined, supportBeforeLoad: undefined, classes: {input: string, prefix: string, disabled: string, required: string}, tabindexStart: number}}
     */
    $.CustomForm.defaults = {
        classes: {
            prefix: 'customform',
            input : '{prefix}-input',
            disabled: 'is-disabled',
            required: 'is-required'
        },
        tabindexStart: 0,
        supportBeforeLoad: undefined,
        supportComplete: undefined
    };

    /**
     * Methods
     *
     * @type {{setLog: $.CustomForm.setLog, prepareUserOptions: (function(): boolean), getInstanceName: (function(Object): null), isRequired: (function(): *), getInputType: (function(): *), getSupportClassName: (function(string): string), isEmpty: (function(): boolean), getInput: (function(): *), replacePrefixClass: (function(): $.CustomForm), getWrapperInput: (function(): *), setSupports: (function(Array): $.CustomForm), getElements: (function(): *), setOptions: (function(string, Object): $.CustomForm), getInstance: ((function(Object, Object): (Object|boolean))|*), isDisabled: (function(): *), getWrapper: (function(): *), setSupport: (function(string, Object=): *|{}), getContext: (function(): *), onReady: (function(Function): $.CustomForm)}}
     */
    $.CustomForm.prototype = {
        /**
         * Prepare user options
         *
         * @return {boolean}
         */
        prepareUserOptions: function () {
            // Classes
            this.replacePrefixClass();

            return true;
        },

        /**
         * Set options for a specified type
         *
         * @param {string} type    Support type
         * @param {object} options Support options
         */
        setOptions: function (type, options) {
            this.options[type] = options;

            return this;
        },

        /**
         * Set all or a list of supports
         *
         * @param {array} types Types list to set
         */
        setSupports: function (types) {
            var self = this;
            var supports = {};

            if (types !== undefined && types.length > 0) {
                $.each(types, function (i, type) {
                    supports[type] = self.supports[type];
                });
            } else {
                supports = self.supports;
            }

            $.each(supports, function (type) {
                self.setSupport(type);
            });

            return self;
        },

        /**
         * Initialise a support
         *
         * @param {string} type Support type
         * @param {object=undefined} options Support options
         *
         * @return {object} support data
         */
        setSupport: function (type, options) {
            var self = this;

            // Support defaults
            self.support = {};
            self.support.type = type;
            self.support.selector = self.supports[self.support.type];
            self.support.className = self.getSupportClassName(self.support.type);
            self.support.instances = {};

            // User Callback
            if (self.settings.supportBeforeLoad !== undefined) {
                self.settings.supportBeforeLoad.call(self);
            }

            // If support exists
            if ($[self.support.className] !== undefined) {
                // Defined options?
                if (options === undefined && self.options[self.support.type] !== undefined) {
                    options = self.options[self.support.type];
                }

                // Initialisation
                self.context.each(function () {
                    self.elementContext = $(this);

                    $(self.support.selector, self.elementContext).each(function (i, input) {
                        self.elementInput = $(input);
                        var instanceName = self.getInstanceName(self.elementInput);

                        // Don't repeat initialisation
                        if (self.elementInput.closest('.' + self.settings.classes.prefix).length) {
                            self.setLog('Support "' + self.support.type + '" is already initialised.', 'warn');
                            return;
                        }

                        self.support.instances[(instanceName ? instanceName : i)] = new $[self.support.className](self, options);
                    });
                });

            } else {
                self.setLog('Support "' + self.support.type + '" is not found.', 'error');
            }

            // User Callback
            if (self.settings.supportComplete !== undefined) {
                self.settings.supportComplete.call(self);
            }

            return self.support;
        },

        /**
         * Return the class name of a specified support
         *
         * @param {string} support Support name
         *
         * @return {string}
         */
        getSupportClassName: function (support) {
            return 'CustomForm' + (support === 'checkbox' || support === 'radio' ? 'Check' : support.charAt(0).toUpperCase() + support.substr(1));
        },

        /**
         * Return CustomForm... instance from input element
         * 
         * @param {object} instances Instances list or result of setSupport()
         * @param {object} input Input element
         *
         * @return {object|boolean}
         */
        getInstance: function (instances, input) {
            instances = instances.instances || instances;
            var name = this.getInstanceName(input);

            if (!name) {
                this.setLog('"name" attribute is not found in input element.', 'error');

            } else if (instances !== undefined && instances[name] !== undefined) {
                return instances[name];
            }

            this.setLog('"' + name + '" instance is not found.', 'error');
            return false;
        },

        /**
         * Return formatted instance name from input element
         * 
         * @param  {object} input Input element
         *
         * @return {boolean}
         */
        getInstanceName: function (input) {
            var instanceName = null;
            var name = input.attr('name');
            var id = input.attr('id');

            if (name !== undefined) {
                instanceName = name
                    .replace(/-/g, '')
                    .replace(/\[/g, '')
                    .replace(/]/g, '');
            }

            if (id !== undefined) {
                if (instanceName !== null) {
                    instanceName += '--';
                }

                instanceName += id.replace(/-/g, '');
            }

            return instanceName;
        },

        /**
         * Once CustomForm is ready
         *
         * @param {function} callback Function
         */
        onReady: function (callback) {
            setTimeout(function () {
                callback();
            }, 0);

            return this;
        },

        /**
         * Return true if the input value is empty
         *
         * @return {boolean}
         */
        isEmpty: function () {
            return this.getInput().val() === '';
        },

        /**
         * Return true if the input is disabled
         *
         * @return {boolean}
         */
        isDisabled: function () {
            return this.getInput().prop('disabled');
        },

        /**
         * Return true if the input is required
         *
         * @return {boolean}
         */
        isRequired: function () {
            return this.getInput().prop('required');
        },

        /**
         * Return all elements registred in CustomForm
         *
         * @return {object}
         */
        getElements: function () {
            return this.elements;
        },

        /**
         * Return CustomForm context (usually <form>)
         *
         * @return {object}
         */
        getContext: function () {
            return this.getElements().context;
        },

        /**
         * Return <input> element
         *
         * @return {object}
         */
        getInput: function () {
            return this.getElements().input;
        },

        /**
         * Return input type
         */
        getInputType: function () {
            return this.type;
        },

        /**
         * Return the main wrapper (.customform)
         *
         * @return {object}
         */
        getWrapper: function () {
            return this.getElements().wrapper;
        },

        /**
         * Return the input wrapper (.customform-input)
         *
         * @return {object}
         */
        getWrapperInput: function () {
            return this.getElements().wrapperInput;
        },

        /**
         * Utils
         */
        setLog: function (log, type) {
            type = type || 'log';

            console[type]('CustomForm: ' + log);
        },
        replacePrefixClass: function () {
            var self = this;

            $.each(self.settings.classes, function (key, value) {
                if (typeof value === 'string') {
                    self.settings.classes[key] = value.replace(/{prefix}/, self.settings.classes.prefix);
                }
            });

            return self;
        }
    };

    $.fn.customForm = function (options, supports) {
        return new $.CustomForm($(this), options, supports);
    };
})(jQuery);