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
        // Héritage
        this.customForm = customForm;
        $.extend($.CustomFormSelect.prototype, $.CustomForm.prototype);

        // Élements
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

        // Config
        $.extend(true, this.settings = {}, this.customForm.settings, $.CustomFormSelect.defaults, options);

        // Variables
        this.type = this.customForm.support.type;
        this.multiple = this.getInput().prop('multiple');
        this.multipleOptions = [];
        this.keyboard = {
            timeout: null,
            keyCodeToKey: {
                48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9', 65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z', 96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9'
            },
            search: [],
            options: {}
        };

        // Init
        if (this.prepareUserOptions()) {
            this.init();
        }

        return this;
    };

    $.CustomFormSelect.defaults = {
        classes: {
            label: '{prefix}-selectLabel',
            options: '{prefix}-selectOptions',
            option: '{prefix}-selectOption',
            optionGroup: '{prefix}-selectOptionGroup',
            optionGroupLabel: '{prefix}-selectOptionGroupLabel',
            first: 'is-first',
            last: 'is-last',
            selected: 'is-selected',
            preselected: 'is-preselected',
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
         * Création des wrappers
         */
        wrap: function () {
            var self = this;

            // Wrappers génériques
            self.elements.wrapper = $('<span>', {
                'class': self.settings.classes.prefix + ' ' + self.settings.classes.prefix + '--' + self.getInputType()
            });
            self.elements.wrapperInput = $('<span>', {
                'class': self.settings.classes.input
            });

            // User callback
            if (self.settings.beforeWrap !== undefined) {
                self.settings.beforeWrap.call({
                    customForm: self,
                    elements: self.getElements()
                });
            }

            // Wrapper
            self.getInput().parent().wrapInner(self.getWrapper());
            self.elements.wrapper = self.getInput().parent();

            // Wrapper input
            self.getInput().wrap(self.getWrapperInput());
            self.elements.wrapperInput = self.getInput().parent();

            // Récupération des données du <select>
            self.elements.source.options = self.getInput().children('option');
            self.elements.source.optgroups = self.getInput().children('optgroup');

            // Wrappers
            self.getWrapperInput().append($('<span>', {
                'class': self.settings.classes.label
            }));
            self.elements.wrapperLabel = self.getInput().next();

            self.getWrapperInput().append($('<span>', {
                'class': self.settings.classes.options
            }));
            self.elements.wrapperOptions = self.getWrapperLabel().next();

            // Tabindex
            self.getInput().attr('tabindex', '-1');
            if (!self.isDisabled()) {
                self.getWrapperLabel().attr('tabindex', self.settings.tabindexStart);
            }

            // Multiple
            if (self.isMultiple()) {
                self.getWrapper().addClass(self.settings.classes.multiple);
            }

            // Options
            if (self.getSourceOptions().length) {
                $.each(self.getSourceOptions(), function (indexOption, option) {
                    option = $(option);
                    var optionClasses = option.attr('class');

                    self.getWrapperOptions().append($('<span>', {
                        'class': self.settings.classes.option + (optionClasses !== undefined ? ' ' + optionClasses : '') + (option.attr('disabled') !== undefined ? ' ' + self.settings.classes.disabled : ''),
                        'data-value': option.val(),
                        html: option.html()
                    }));
                });
            }

            // Optgroups
            if (self.getSourceOptgroups().length) {
                $.each(self.getSourceOptgroups(), function (indexOptgroup, optgroup) {
                    optgroup = $(optgroup);
                    var selectOptionGroup = $('<span>', {
                        'class': self.settings.classes.optionGroup
                    });
                    $('<span>', {
                        'class': self.settings.classes.optionGroupLabel,
                        html: optgroup.attr('label')
                    }).appendTo(selectOptionGroup);

                    optgroup.children('option').each(function (indexOptgroupOption, option) {
                        option = $(option);
                        var optionClasses = option.attr('class');

                        $('<span>', {
                            'class': self.settings.classes.option + (optionClasses !== undefined ? ' ' + optionClasses : '') + (option.attr('disabled') !== undefined ? ' ' + self.settings.classes.disabled : ''),
                            'data-value': option.val(),
                            html: option.html()
                        }).appendTo(selectOptionGroup);
                    });

                    self.getWrapperOptions().append(selectOptionGroup);
                });
            }

            // First/last option
            self.getOptions()
                .first().addClass(self.settings.classes.first).end()
                .last().addClass(self.settings.classes.last);

            return self;
        },

        /**
         * Initialise l'état des éléments par défaut
         */
        reset: function () {
            var self = this;
            var defaultValue = self.getDefaultValue();
            self.getWrapper().removeClass(self.settings.classes.disabled + ' ' + self.settings.classes.required);

            // Désactivé
            if (self.isDisabled()) {
                self.getWrapper().addClass(self.settings.classes.disabled);
                self.getWrapperLabel().removeAttr('tabindex');
            }

            // Requis
            if (self.isRequired()) {
                self.getWrapper().addClass(self.settings.classes.required);
            }

            // Définition de la valeur par défaut
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
                    defaultValue = defaultValue.val();
                }

                self.getInput().attr('data-default-value', defaultValue);
            }

            // En multiple, on ne selectionne pas la valeur par défaut
            if (self.isMultiple()) {
                var firstOption = self.loadOption('.' + self.settings.classes.first);

                if (defaultValue === firstOption.getValue()) {
                    defaultValue = null;
                    self.setLabel(firstOption.getName());
                }
            }

            // Ajout des options
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
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            // Sélection
            self.getWrapperLabel().on('click.customform.open keydown.customform.open', function (event) {
                if (self.getInput().is(':disabled')) {
                    return;
                }

                if (event.type === 'click') {
                    self.clickHandler(event);

                } else if (event.type === 'keydown') {
                    self.keyboardHandler(event);
                }
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
         * Lors du clique sur le label
         *
         * @param {object} event
         */
        clickHandler: function (event) {
            var self = this;

            // Fermeture des autres selects
            self.closeSiblings();

            // Fermeture au click sur le label
            self.getWrapperLabel().one('click.customform.close', {self: self}, self.close);

            // Fermeture au click en dehors du select (mais pas sur un autre select)
            self.getElements().body.on('click.customform.close', function (event) {
                var target = $(event.target);

                if ((!self.isMultiple() && target.hasClass(self.settings.classes.option)) || (!target.hasClass(self.settings.classes.label) && !target.hasClass(self.settings.classes.option))) {
                    self.close();
                }
            });

            // Ouverture des options
            self.getWrapper().addClass(self.settings.classes.open);

            // Ajout d'un événement sur les options
            self.getOptions().on('click.customform.option', function (event) {
                self.loadOption(event.currentTarget).select({context: event.type});
            });

            // Trigger click
            self.getInput().triggerHandler('click');

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
         * Au clavier
         *
         * @param {object} event
         */
        keyboardHandler: function (event) {
            var self = this;
            var option = null;
            var currentOptionIndex = 0;
            var optionsLength = 0;
            var isEnter = event.key === 'Enter';
            var isSpace = event.keyCode === 32;
            var direction = (event.keyCode === 37 || event.keyCode === 38) ? 'up' : (event.keyCode === 39 || event.keyCode === 40) ? 'down' : undefined;
            var fastDirection = (event.keyCode === 35 || event.metaKey && direction === 'down') ? 'last' : (event.keyCode === 36 || event.metaKey && direction === 'up') ? 'first' : undefined;
            var isClose = (event.keyCode === 27 || isEnter || event.keyCode === 9);
            var isLetter = (event.keyCode >= 48 && event.keyCode <= 105);
            
            if (isSpace || isEnter) {
                // Stop scroll
                event.preventDefault();

                // Space selection
                if (self.isMultiple()) {
                    option = self.getOptions('.' + self.settings.classes.preselected);

                    if (self.getWrapper().hasClass(self.settings.classes.open)) {
                        if (option.length) {
                            option = self.loadOption(option);
                            option.select();
                        }

                    } else {
                        self.clickHandler(event);
                    }

                } else {
                    self.clickHandler(event);
                }

                return;
            }

            // Fermeture
            if (isClose) {
                self.close();
                return;
            }

            // Sélection de l'option
            self.getOptions().each(function (i, option) {
                option = self.loadOption(option);
                self.keyboard.options[i] = option;

                if (self.isMultiple()) {
                    if (option.hasState('preselected')) {
                        currentOptionIndex = i;
                    }

                } else if (option.isSelected()) {
                    currentOptionIndex = i;
                }

                optionsLength++;
            });

            // Changement d'option
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
                    // Selection/préselection
                    option[(self.isMultiple() ? 'preselect' : 'select')]({
                        context: 'keydown',
                        direction: direction
                    });

                    // Auto-scroll
                    self.autoscrollWrapperOptions(option, direction);
                }
            }

            if (isLetter) {
                var letter = event.key !== undefined ? event.key : self.keyboard.keyCodeToKey[event.keyCode];

                if (letter !== undefined) {
                    clearTimeout(self.keyboard.timeout);
                    self.keyboard.search.push(letter);

                    self.keyboard.timeout = setTimeout(function () {
                        option = self.getOptionOnkeyboard();

                        if (option !== null) {
                            option.select({context: 'keydown'});
                        }
                    }, 250);
                }
            }

            // Trigger event
            self.getInput().triggerHandler(event.type);
        },

        /**
         * Récupère l'option en fonction de la saisie
         *
         * @return {object|string}
         */
        getOptionOnkeyboard: function () {
            var self = this;
            var out = null;
            var searchString = this.keyboard.search.join('');
            var seachResults = [];
            var searchIndexResult = [];

            // Résultats
            this.getOptions().each(function (i, option) {
                option = self.loadOption(option);
                seachResults.push(option.getName().toLowerCase().indexOf(searchString));
            });

            // Index des résultats
            if (seachResults.length) {
                $.each(seachResults, function (seachIndex, searchStringIndex) {
                    if (searchStringIndex !== -1) {
                        searchIndexResult.push(seachIndex);
                    }
                });
            }

            // Association de l'option au premet index des résultats
            if (searchIndexResult.length) {
                searchIndexResult = searchIndexResult.shift();

                if (typeof this.keyboard.options[searchIndexResult] === 'object') {
                    out = this.keyboard.options[searchIndexResult];
                }
            }

            // Reset search
            this.keyboard.search = [];

            return out;
        },

        /**
         * Auto-scroll du wrapper des options
         *
         * @param {object} option
         * @param {string} direction
         */
        autoscrollWrapperOptions: function (option, direction) {
            var self = this;

            // En fonction des directions
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

                // Si la prochaine option est désactivée, on rappelle la fonction
                if (hasScrolled) {
                    var futureOption = self.loadOption(option.getOption()[direction === 'up' ? 'prev' : 'next']());

                    if (futureOption.getOption().length && futureOption.isDisabled()) {
                        self.autoscrollWrapperOptions(futureOption, direction);
                    }
                }
            }
        },

        /**
         * Fermeture des options
         */
        close: function (event) {
            var self = (event !== undefined && event.data !== undefined && event.data.self !== undefined) ? event.data.self : this;

            self.getWrapper().removeClass(self.settings.classes.open);
            self.getWrapperLabel().off('click.customform.close');
            self.getOptions().off('click.customform.option');
            self.getElements().body.off('click.customform.close');

            return self;
        },

        /**
         * Fermeture des autres selects
         */
        closeSiblings: function () {
            var self = this;
            var siblings = self.getSiblings();

            if (siblings.length) {
                siblings.each(function (i, select) {
                    $(select)
                        .removeClass(self.settings.classes.open)
                        .find('.' + self.settings.classes.label)
                        .off('click.customform.close').end()
                        .find('.' + self.settings.classes.option)
                        .off('click.customform.option');
                });

                self.getElements().body.off('click.customform.close');
            }

            return self;
        },

        /**
         * Modifie le label du select custom
         *
         * @param {string|object[]} name
         * @param {string|object[]=undefined} value
         */
        setLabel: function (name, value) {
            if (this.isMultiple()) {
                if (typeof value === 'object') {
                    value = value.join(',');
                }
                if (typeof name === 'object') {
                    name = name.join(this.settings.multipleOptionsSeparator);
                }
            }

            if (value !== undefined) {
                this.getWrapperLabel().attr('data-value', value);
            }

            this.getWrapperLabel().html(name);

            return this;
        },

        /**
         * Détermine si le select est multiple
         *
         * @return boolean
         */
        isMultiple: function () {
            return this.multiple;
        },

        /**
         * Retourne tous les autres selects du contexte actuel
         *
         * @return {object}
         */
        getSiblings: function () {
            return this.getContext().find('.' + this.settings.classes.prefix + '--' + this.getInputType()).not(this.getWrapper());
        },

        /**
         * Retourne le wrapper du label (.customform-selectLabel)
         *
         * @return {object}
         */
        getWrapperLabel: function () {
            return this.getElements().wrapperLabel;
        },

        /**
         * Retourne la valeur courante ou par défaut
         *
         * @param {boolean} defaultValue
         *
         * @return {string|object}
         */
        getValue: function (defaultValue) {
            defaultValue = defaultValue || false;
            var value = defaultValue ? this.getInput().attr('data-default-value') : this.getWrapperLabel().attr('data-value');

            if (value !== undefined && this.isMultiple()) {
                return value.split(',');
            }

            return value;
        },

        /**
         * Retourne la valeur courante
         *
         * @return {string|object}
         */
        getCurrentValue: function () {
            return this.getValue();
        },

        /**
         * Retourne la valeur par défaut
         *
         * @return {string|object}
         */
        getDefaultValue: function () {
            return this.getValue(true);
        },

        /**
         * Retourne le wrapper des options (.customform-selectOptions)
         *
         * @return {object}
         */
        getWrapperOptions: function () {
            return this.getElements().wrapperOptions;
        },

        /**
         * Retourne toutes les options ou en partie
         *
         * @param {object=undefined} filter Sélecteur de filtre pour les options à retourner
         *
         * @return {object}
         */
        getOptions: function (filter) {
            var options = this.getWrapperOptions().find('.' + this.settings.classes.option);

            return filter !== undefined ? options.filter(filter) : options;
        },

        /**
         * Sélectionne les options définies
         *
         * @param {string|object=undefined} options Sélecteur ou liste des options
         */
        selectOptions: function (options) {
            var self = this;
            options = (options === undefined || typeof options === 'string') ? self.getOptions(options) : options;

            if (!self.isMultiple()) {
                self.setLog('selectOptions() works only with "multiple" attribute. Use loadOption().select() for classic <select>.', 'warn');
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
         * Enlève la sélection des options définies
         *
         * @param {string|object=undefined} options Sélecteur ou liste des options
         * @param {boolean=undefined}       disable Désactive l'option en même temps
         */
        unselectOptions: function (options, disable) {
            var self = this;
            options = (options === undefined || typeof options === 'string') ? self.getOptions(options) : options;
            disable = disable || false;

            if (!self.isMultiple()) {
                self.setLog('removeOptions() works only with "multiple" attribute. Use loadOption().select() for classic <select>.', 'warn');
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
         * Retourne une option à partir de sa valeur
         *
         * @param {string|number} value
         *
         * @return {object}
         */
        getOptionFromValue: function (value) {
            return this.getOptions('[data-value="' + value + '"]');
        },

        /**
         * Retourne les options sur le select initial
         *
         * @return {object}
         */
        getSourceOptions: function () {
            return this.getElements().source.options;
        },

        /**
         * Retourne les optgroups sur le select initial
         *
         * @return {object}
         */
        getSourceOptgroups: function () {
            return this.getElements().source.optgroups;
        },

        /**
         * Gestion d'une option
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

    $.CustomFormSelectOption.prototype = {
        /**
         * Retourne l'argument option
         *
         * @return {object}
         */
        getOption: function () {
            return this.option;
        },

        /**
         * Sélectionne une option
         *
         * @param {object=undefined} settings Paramètres optionnels
         */
        select: function (settings) {
            var self = this;
            var callbackEvent = {};
            settings = settings || {};

            if (self.getOption() !== undefined && self.getOption() !== null && self.getOption().length && self.getValue() !== undefined) {
                // Si l'option est désactivée, on passe à la précédente/suivante
                if (self.isDisabled() && settings.direction !== undefined) {
                    self.option = self.getOption()[settings.direction === 'up' ? 'prev' : 'next']();

                    self.select({
                        context: 'auto-move',
                        direction: settings.direction
                    });

                    return;
                }

                // Si l'option la dernière option trouvée est désactivée, on stop
                if (self.isDisabled()) {
                    return;

                } else {
                    // Si on est en mode multiple
                    if (self.customFormSelect.isMultiple()) {
                        var optionsValues = [];
                        var optionsNames = [];

                        // Si l'option "none" est cochée, on l'enlève
                        if (self.customFormSelect.multipleOptions.length === 1 && self.customFormSelect.multipleOptions[0].isFirst()) {
                            self.customFormSelect.getInput().empty();
                            self.customFormSelect.multipleOptions[0].removeState('selected');
                            self.customFormSelect.multipleOptions = [];
                        }

                        // Si l'option est déjà sélectionnée on reconstruit la sélection, sinon on ajoute l'option
                        if (self.isSelected()) {
                            self.customFormSelect.multipleOptions = [];
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

                        // Reorder
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
                        self.customFormSelect.getInput().empty();
                        self.customFormSelect.getOptions().removeClass(self.customFormSelect.settings.classes.selected);

                        // Add
                        $.each(self.customFormSelect.multipleOptions, function (i, option) {
                            if (!option.isDisabled()) {
                                var optionValue = option.getValue();
                                var optionName = option.getName();
                                optionsValues.push(optionValue);
                                optionsNames.push(optionName);

                                // <select>
                                self.customFormSelect.getInput().append($('<option>', {
                                    value: optionValue,
                                    html: optionName
                                }).prop('selected', true));

                                // Option
                                option.addState('selected');
                            }
                        });

                        // Label
                        self.customFormSelect.setLabel(optionsNames, optionsValues);

                        // User callback
                        if (self.customFormSelect.settings.onChange !== undefined) {
                            callbackEvent = $.extend(callbackEvent, {
                                options: self.customFormSelect.multipleOptions
                            });
                        }
                    }

                    // Mode classique
                    else {
                        var optionValue = self.getValue();
                        var optionName  = self.getName();

                        // <select>
                        self.customFormSelect.getInput().html($('<option>', {
                            value: optionValue,
                            html: optionName
                        }).prop('selected', true));

                        // Label
                        self.customFormSelect.setLabel(optionName, optionValue);

                        // Option
                        self.customFormSelect.getOptions().removeClass(self.customFormSelect.settings.classes.selected);
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
                        self.customFormSelect.getInput().triggerHandler('change');

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
         * Enlève la sélection de l'option
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
         * Presélectionne une option pour le mode multiple
         *
         * @param {object=undefined} settings Paramètres optionnels
         */
        preselect: function (settings) {
            var self = this;
            settings = settings || {};

            if (self.getOption() !== undefined && self.getOption() !== null && self.getOption().length && self.getValue() !== undefined) {
                // Si l'option est désactivée, on passe à la précédente/suivante
                if (self.isDisabled() && settings.direction !== undefined) {
                    self.option = self.getOption()[settings.direction === 'up' ? 'prev' : 'next']();

                    self.preselect({
                        context: 'auto-move',
                        direction: settings.direction
                    });

                    return;
                }

                // Si l'option la dernière option trouvée est désactivée, on stop
                if (self.isDisabled() || self.isFirst()) {
                    return;

                } else {
                    self.customFormSelect.getOptions().removeClass(self.customFormSelect.settings.classes.preselected);
                    self.addState('preselected');
                }
            }

            return self;
        },

        /**
         * Ajoute une classe d'état sur l'option
         *
         * @param {string} state
         */
        addState: function (state) {
            this.getOption().addClass(this.customFormSelect.settings.classes[state]);

            return this;
        },

        /**
         * Détermine si l'option à la classe d'état
         *
         * @param {string} state
         *
         * @return {boolean}
         */
        hasState: function (state) {
            return this.getOption().hasClass(this.customFormSelect.settings.classes[state]);
        },

        /**
         * Enlève une classe d'état sur l'option
         *
         * @param {string} state
         */
        removeState: function (state) {
            this.getOption().removeClass(this.customFormSelect.settings.classes[state]);

            return this;
        },

        /**
         * Désactive une option
         */
        disable: function () {
            return this.addState('disabled');
        },

        /**
         * Détermine si l'option est sélectionnée
         *
         * @return {boolean}
         */
        isSelected: function () {
            return this.hasState('selected');
        },

        /**
         * Détermine si l'option est la première
         *
         * @return {boolean}
         */
        isFirst: function () {
            return this.hasState('first');
        },

        /**
         * Détermine si l'option est la dernière
         *
         * @return {boolean}
         */
        isLast: function () {
            return this.hasState('last');
        },

        /**
         * Détermine si l'option est désactivée
         *
         * @return {boolean}
         */
        isDisabled: function () {
            return this.hasState('disabled');
        },

        /**
         * Retourne le nom de l'option au format HTML
         *
         * @return {string}
         */
        getName: function () {
            return this.getOption().html();
        },

        /**
         * Défini le nom de l'option
         *
         * @param {string|html} name
         */
        setName: function (name) {
            this.getOption().html(name);

            return this;
        },

        /**
         * Retourne la valeur de l'option
         *
         * @return {null|string}
         */
        getValue: function () {
            if (this.getOption() !== undefined) {
                return this.getOption().attr('data-value');
            }

            return null;
        },

        /**
         * Défini la valeur de l'option
         *
         * @param {string|number} value
         */
        setValue: function (value) {
            this.getOption().attr('data-value', value);

            return this;
        }
    };
})(jQuery);