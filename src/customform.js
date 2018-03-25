(function ($) {
    'use strict';

    $.CustomForm = function (context, options, supports) {
        // Config
        $.extend(true, (this.settings = {}), $.CustomForm.defaults, options);

        // Support
        $.extend((this.supports = {}), $.CustomForm.supports, supports);

        // Variables
        this.context = context;
        this.options = {};
        this.support = undefined;

        // Retour
        if (this.prepareOptions()) {
            return this;
        }

        return false;
    };

    /**
     * Supports
     */
    $.CustomForm.supports = {
        checkbox: 'input[type="checkbox"]',
        radio: 'input[type="radio"]',
        select: 'select',
        file: 'input[type="file"]'
    };

    /**
     * Config par défaut
     */
    $.CustomForm.defaults = {
        classes: {
            prefix: 'customform',
            input : '{prefix}-input',
            disabled: 'is-disabled'
        },
        tabindexStart: 0,
        onSupportLoad: undefined,
        onSupportComplete: undefined
    };

    $.CustomForm.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return bool
         */
        prepareOptions: function () {
            // Classes
            this.replacePrefixClass();

            return true;
        },

        /**
         * Enregistre les options pour un support
         *
         * @param string type    Type de support
         * @param object options Options du support
         */
        setOptions: function (type, options) {
            this.options[type] = options;

            return this;
        },

        /**
         * Met en place tous les supports
         */
        setSupports: function () {
            var self = this;

            $.each(self.supports, function (type, selector) {
                self.setSupport(type);
            });

            return self;
        },

        /**
         * Met en place un support
         *
         * @param string type    Type de support
         * @param object options Options du support
         */
        setSupport: function (type, options) {
            var self = this;

            // Données du support
            self.support = {};
            self.support.type = type;
            self.support.selector = $.CustomForm.supports[self.support.type];
            self.support.className = self.getSupportClassName(self.support.type);
            self.support.instances = {};

            // User Callback
            if (self.settings.onSupportLoad !== undefined) {
                self.settings.onSupportLoad.call(self);
            }

            // Si le support est chargé, on l'init
            if ($[self.support.className] !== undefined) {
                // Options définies ?
                if (options === undefined && self.options[self.support.type] !== undefined) {
                    options = self.options[self.support.type];
                }

                // Appel de la classe
                self.context.each(function () {
                    self.elementContext = $(this);

                    $(self.support.selector, self.elementContext).each(function (i, input) {
                        self.elementInput = $(input);
                        var instanceName = self.getInstanceName(self.elementInput);

                        // Si l'input est déjà initialisé, on stop
                        if (self.elementInput.closest('.' + self.settings.classes.prefix).length) {
                            return;
                        }

                        self.support.instances[((instanceName) ? instanceName : i)] = new $[self.support.className](self, options);
                    });
                });

            } else {
                self.setLog('error', 'Support "' + self.support.className + '" not found.');
            }

            // User Callback
            if (self.settings.onSupportComplete !== undefined) {
                self.settings.onSupportComplete.call(self);
            }

            return self.support;
        },

        /**
         * Récupère le nom de la classe du support correspondant
         *
         * @param  string support Nom du support
         * @return string
         */
        getSupportClassName: function (support) {
            var suffix = null;

            if (support === 'checkbox' || support === 'radio') {
                suffix = 'Check';
            } else {
                suffix = support.charAt(0).toUpperCase() + support.substr(1);
            }

            return 'CustomForm' + suffix;
        },

        /**
         * Récupère l'instance via l'élément input
         * 
         * @param  object        instances Retour de setSupport() ou liste des instances
         * @param  jQuery object input     Élément input
         * @return object si trouvée, sinon false
         */
        getInstance: function (instances, input) {
            instances = instances.instances || instances;
            var name = this.getInstanceName(input);

            if (name !== false && instances !== undefined && instances[name] !== undefined) {
                return instances[name];
            } else {
                this.setLog('error', '"name" attribute not found in input parameter.')
            }

            return false;
        },

        /**
         * Récupère le nom formaté d'une instance via l'élément input
         * 
         * @param  jQuery object input Élément input
         * @return string si attr name trouvé sinon false
         */
        getInstanceName: function (input) {
            var name = input.attr('name');

            if (name !== undefined) {
                return name
                    .replace('[]', '')
                    .replace('[', '_')
                    .replace(']', '');
            }

            return false;
        },

        /**
         * Utils
         */
        setLog: function (type, log) {
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

    /**
     * Fonction utilisateur
     * @param  object options Options utilisateur
     * @param  object support Support de la personnalisation : {type: 'selecteur'}
     */
    $.fn.customForm = function (options, support) {
        return new $.CustomForm($(this), options, support);
    };
})(jQuery);