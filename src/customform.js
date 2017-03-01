/**
 * CustomForm
 *
 * @version 4 (01/03/2016)
 */
(function($) {
    'use strict';

    $.CustomForm = function(context, options, supports) {
        // Config
        $.extend((this.settings = {}), $.CustomForm.defaults, options);

        // Support
        $.extend((this.supports = {}), $.CustomForm.supports, supports);

        // Variables
        this.context = context;
        this.support = {};
        this.options = {};

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
            states: {
                disabled: 'is-disabled'
            }
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
        prepareOptions: function() {
            // Classes
            this.replacePrefixClass();

            return true;
        },

        /**
         * Enregistre les options pour un support
         *
         * @param string support Nom du support
         * @param object options Options du support
         */
        setOptions: function(support, options) {
            this.options[support] = options;

            return this;
        },

        /**
         * Met en place tous les supports
         */
        setSupports: function() {
            var self = this;

            $.each(self.supports, function(support, selector) {
                self.setSupport(support);
            });

            return self;
        },

        /**
         * Met en place un support
         *
         * @param string support Nom du support
         * @param object options Options du support
         */
        setSupport: function(support, options) {
            var self = this;

            // Données du support
            self.support.type = support;
            self.support.selector = $.CustomForm.supports[self.support.type];
            self.support.className = self.getSupportClassName(self.support.type);

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
                self.context.each(function() {
                    self.elementContext = $(this);

                    $(self.support.selector, self.elementContext).each(function() {
                        self.elementInput = $(this);

                        new $[self.support.className](self, options);
                    });
                });

            } else {
                self.setLog('error', 'Support "' + self.support.className + '" not found.');
            }

            // User Callback
            if (self.settings.onSupportComplete !== undefined) {
                self.settings.onSupportComplete.call(self);
            }

            return self;
        },

        /**
         * Récupère le nom de la classe du support correspondant
         *
         * @param  string support Nom du support
         * @return string
         */
        getSupportClassName: function(support) {
            var suffix = null;

            if (support === 'checkbox' || support === 'radio') {
                suffix = 'Check';
            } else {
                suffix = support.charAt(0).toUpperCase() + support.substr(1);
            }

            return 'CustomForm' + suffix;
        },

        /**
         * Utils
         */
        setLog: function(type, log) {
            console[type](log);
        },
        replacePrefixClass: function() {
            var self = this;

            $.each(self.settings.classes, function(key, value) {
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
    $.fn.customForm = function(options, support) {
        return new $.CustomForm($(this), options, support);
    };
})(jQuery);