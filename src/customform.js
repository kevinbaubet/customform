(function ($) {
    'use strict';

    $.CustomForm = function (context, options, supports) {
        // Config
        $.extend(true, this.settings = {}, $.CustomForm.defaults, options);

        // Support
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
        supportBeforeLoad: undefined,
        supportComplete: undefined
    };

    $.CustomForm.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return boolean
         */
        prepareUserOptions: function () {
            // Classes
            this.replacePrefixClass();

            return true;
        },

        /**
         * Enregistre les options pour un support
         *
         * @param {string} type    Type de support
         * @param {object} options Options du support
         */
        setOptions: function (type, options) {
            this.options[type] = options;

            return this;
        },

        /**
         * Met en place tous les supports
         *
         * @param {array} types Liste des types de support à exécuter
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
         * Met en place un support
         *
         * @param {string} type    Type de support
         * @param {object=undefined} options Options du support
         *
         * @return {object} support infos
         */
        setSupport: function (type, options) {
            var self = this;

            // Données du support
            self.support = {};
            self.support.type = type;
            self.support.selector = self.supports[self.support.type];
            self.support.className = self.getSupportClassName(self.support.type);
            self.support.instances = {};

            // User Callback
            if (self.settings.supportBeforeLoad !== undefined) {
                self.settings.supportBeforeLoad.call(self);
            }

            // Si le support est chargé, on l'init
            if ($[self.support.className] !== undefined) {
                // Options définies ?
                if (options === undefined && self.options[self.support.type] !== undefined) {
                    options = self.options[self.support.type];
                }

                // Instanciation
                self.context.each(function () {
                    self.elementContext = $(this);

                    $(self.support.selector, self.elementContext).each(function (i, input) {
                        self.elementInput = $(input);
                        var instanceName = self.getInstanceName(self.elementInput);

                        // Si l'input est déjà initialisé, on stop
                        if (self.elementInput.closest('.' + self.settings.classes.prefix).length) {
                            self.setLog('Support "' + self.support.type + '" is already initialized!', 'warn');
                            return;
                        }

                        self.support.instances[(instanceName ? instanceName : i)] = new $[self.support.className](self, options);
                    });
                });

            } else {
                self.setLog('Support "' + self.support.type + '" not found.', 'error');
            }

            // User Callback
            if (self.settings.supportComplete !== undefined) {
                self.settings.supportComplete.call(self);
            }

            return self.support;
        },

        /**
         * Récupère le nom de la classe du support correspondant
         *
         * @param  {string} support Nom du support
         *
         * @return {string}
         */
        getSupportClassName: function (support) {
            return 'CustomForm' + (support === 'checkbox' || support === 'radio' ? 'Check' : support.charAt(0).toUpperCase() + support.substr(1));
        },

        /**
         * Récupère l'instance via l'élément input
         * 
         * @param  {object} instances Retour de setSupport() ou liste des instances
         * @param  {object} input     Élément input
         *
         * @return {object|boolean}
         */
        getInstance: function (instances, input) {
            instances = instances.instances || instances;
            var name = this.getInstanceName(input);

            if (!name) {
                this.setLog('"name" attribute not found in input parameter.', 'error');

            } else if (instances !== undefined && instances[name] !== undefined) {
                return instances[name];
            }

            return false;
        },

        /**
         * Récupère le nom formaté d'une instance via l'élément input
         * 
         * @param  {object} input Élément input
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
                instanceName += '--' + id.replace(/-/g, '');
            }

            return instanceName;
        },

        /**
         * Une fois customForm prêt
         *
         * @param {function} callback Fonction à exécuter
         */
        onReady: function (callback) {
            setTimeout(function () {
                callback();
            }, 0);

            return this;
        },

        /**
         * Détermine si la valeur de l'input est vide
         *
         * @return {boolean}
         */
        isEmpty: function () {
            return this.getInput().val() === '';
        },

        /**
         * Détermine si l'input est désactivé
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
         * Retourne le contexte de customform (form)
         *
         * @return {object}
         */
        getContext: function () {
            return this.getElements().context;
        },

        /**
         * Retourne l'élément select
         *
         * @return {object}
         */
        getInput: function () {
            return this.getElements().input;
        },

        /**
         * Retourne le type de l'élément
         */
        getInputType: function () {
            return this.type;
        },

        /**
         * Retourne le wrapper générique global (.customform)
         *
         * @return {object}
         */
        getWrapper: function () {
            return this.getElements().wrapper;
        },

        /**
         * Retourne le wrapper générique du select (.customform-input)
         *
         * @return {object}
         */
        getWrapperInput: function () {
            return this.getElements().wrapperInput;
        },

        /**
         * Créer un log
         *
         * @param {string} log
         * @param {string=undefined} type
         */
        setLog: function (log, type) {
            type = type || 'log';

            console[type]('CustomForm: ' + log);
        },

        /**
         * Remplace la chaine {prefix} par la classe de préfix dans toutes les classes
         */
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
     *
     * @param  {object} options  Options utilisateur
     * @param  {object} supports Supports de la personnalisation : {type: 'selecteur'}
     */
    $.fn.customForm = function (options, supports) {
        return new $.CustomForm($(this), options, supports);
    };
})(jQuery);