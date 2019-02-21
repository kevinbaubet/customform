(function ($) {
    'use strict';

    $.CustomFormSelect = function (customForm, options) {
        // Héritage
        this.customForm = customForm;

        // Config
        this.element  = {
            body: $('body'),
            context: this.customForm.elementContext,
            input: this.customForm.elementInput,
            type: this.customForm.support.type,
            isMultiple: this.customForm.elementInput.prop('multiple'),
            wrapper: null,
            wrapperInput: null,
            source: {
                options: null,
                optgroups: null
            },
            wrapperLabel: null,
            wrapperOptions: null
        };
        $.extend(true, this.settings = {}, this.customForm.settings, $.CustomFormSelect.defaults, options);

        // Variables
        this.type = this.customForm.support.type;
        this.multiple = this.getInput().prop('multiple');
        this.element.multipleOptions = [];
        this.keyboard = {
            timeout: null,
            keyCodeToKey: {
                48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9', 65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z', 96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9'
            },
            search: [],
            options: {}
        };

        // Init
        if (this.prepareOptions()) {
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
         * Préparation des options utilisateur
         *
         * @return boolean
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
                    customFormSelect: this,
                    elements: this.getElements()
                });
            }

            // Load
            this.wrap();
            this.initElementsState();
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
            self.element.wrapper = $('<span>', {
                'class': self.settings.classes.prefix + ' ' + self.settings.classes.prefix + '--' + self.type
            });
            self.element.wrapperInput = $('<span>', {
                'class': self.settings.classes.input,
                tabindex: self.settings.tabindexStart
            });

            // User callback
            if (self.settings.beforeWrap !== undefined) {
                self.settings.beforeWrap.call({
                    customForm: self,
                    wrapper: self.getWrapper(),
                    wrapperInput: self.getWrapperInput()
                });
            }

            // Wrapper
            self.getInput().parent().wrapInner(self.element.wrapper);
            self.element.wrapper = self.getInput().parent();

            // Wrapper input
            self.getInput().wrap(self.element.wrapperInput);
            self.element.wrapperInput = self.element.input.parent();

            // Récupération des données du <select>
            self.element.source.options = self.getInput().children('option');
            self.element.source.optgroups = self.getInput().children('optgroup');

            // Wrappers
            self.getWrapperInput().append($('<span>', {
                'class': self.settings.classes.label
            }));
            self.element.wrapperLabel = self.getInput().next();

            self.getWrapperInput().append($('<span>', {
                'class': self.settings.classes.options
            }));
            self.element.wrapperOptions = self.getWrapperLabel().next();

            // Tabindex
            self.getWrapperInput().removeAttr('tabindex');
            self.getWrapperLabel().attr('tabindex', self.settings.tabindexStart);

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
         * Définition de l'état des éléments à l'initialisation
         *
         * todo rename reset()
         */
        initElementsState: function () {
            var self = this;
            var defaultValue = self.getDefaultValue();

            // States
            if (self.getInput().is(':disabled')) {
                self.getWrapper().addClass(self.settings.classes.disabled);
                self.getInput().removeAttr('tabindex');
                self.getWrapperLabel().removeAttr('tabindex');
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
                var firstOption = self.getOptions('.is-first');
                var firstOptionValue = self.getOptionValue(firstOption);

                if (defaultValue === firstOptionValue) {
                    defaultValue = null;
                    self.setLabel(firstOption.html());
                }
            }

            // Ajout des options
            self.getOptions().each(function (i, option) {
                option = $(option);
                var optionValue = self.getOptionValue(option);
                var settings = {
                    context: 'init'
                };

                if (self.isMultiple() && defaultValue !== null) {
                    // todo fix bug on(reset)
                    $.each(defaultValue.split(','), function (i, defaultValue) {
                        if (optionValue === defaultValue) {
                            self.setOption(option, settings);
                        }
                    });

                } else if (optionValue === defaultValue) {
                    self.setOption(option, settings);
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

            // Reset <form>
            self.getContext().on('reset.customform', function (event) {
                self.getWrapper().removeClass(self.settings.classes.disabled);

                setTimeout(function () {
                    self.initElementsState();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            customFormSelect: self,
                            form: $(event.currentTarget)
                        });
                    }
                }, 0);
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
         * Fermeture des options
         */
        close: function (event) {
            var self = (event !== undefined && event.data !== undefined && event.data.self !== undefined) ? event.data.self : this;

            self.getWrapper().removeClass(self.settings.classes.open);
            self.getWrapperLabel().off('click.customform.close');
            self.getOptions().off('click.customform.option');
            self.element.body.off('click.customform.close');

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
         * Lors du click sur le label
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
            self.getOptions().on('click.customform.option', function (option) {
                self.setOption($(option.currentTarget), {context: 'click'});
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
         * @param {object} event Evenement
         */
        keyboardHandler: function (event) {
            var self = this;
            var option = null;
            var currentOptionIndex = null;
            var optionsLength = 0;
            var direction = (event.keyCode === 37 || event.keyCode === 38) ? 'up' : (event.keyCode === 39 || event.keyCode === 40) ? 'down' : undefined;
            var fastDirection = (event.keyCode === 35) ? 'last' : (event.keyCode === 36) ? 'first' : undefined;
            var isClose = (event.keyCode === 27 || event.keyCode === 13 || event.keyCode === 9);
            var isLetter = (event.keyCode >= 48 && event.keyCode <= 105);
            var isSpace = (event.keyCode === 32);

            // Stop scroll
            if (isSpace) {
                event.preventDefault();
                return;
            }
            
            // Fermeture
            if (isClose) {
                self.close();
                return;
            }

            // Sélection de l'option
            self.getOptions().each(function (i, option) {
                option = $(option);
                self.keyboard.options[i] = option;

                if (option.hasClass(self.settings.classes.selected)) {
                    currentOptionIndex = i;
                }

                optionsLength++;
            });

            // Changement d'option
            if (direction !== undefined || fastDirection !== undefined) {
                event.preventDefault();
                self.closeSiblings();

                if (self.isMultiple()) {
                    return;
                }

                if (direction === 'up') {
                    option = self.keyboard.options[currentOptionIndex - 1];

                } else if (direction === 'down') {
                    option = self.keyboard.options[currentOptionIndex + 1];

                } else if (fastDirection !== undefined) {
                    option = (fastDirection === 'last') ? self.keyboard.options[optionsLength - 1] : self.keyboard.options[0];
                }

                if (option !== null) {
                    self.setOption(option, {
                        context: 'keydown',
                        direction: direction
                    });
                }
            }

            if (isLetter) {
                var letter = event.key !== undefined ? event.key : self.keyboard.keyCodeToKey[event.keyCode];

                if (letter !== undefined) {
                    clearTimeout(self.keyboard.timeout);
                    self.keyboard.search.push(letter);

                    self.keyboard.timeout = setTimeout(function () {
                        self.setOption(self.getOptionOnkeyboard(), {context: 'keydown'});
                    }, 250);
                }
            }

            // Trigger event
            self.getInput().triggerHandler(event.type);
        },

        /**
         * Récupère l'option en fonction de la saisie
         *
         * @return string
         */
        getOptionOnkeyboard: function () {
            var out = null;
            var searchString = this.keyboard.search.join('');
            var seachResults = [];
            var searchIndexResult = [];

            // Résultats
            this.getOptions().each(function (i, option) {
                option = $(option);
                seachResults.push(option.html().toLowerCase().indexOf(searchString));
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

                if (this.keyboard.options[searchIndexResult].length) {
                    out = this.keyboard.options[searchIndexResult];
                }
            }

            // Reset search
            this.keyboard.search = [];

            return out;
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
         * Sélectionne une option
         *
         * @param {string|object} option Sélecteur ou option
         * @param {object=undefined} settings Paramètres optionnels
         */
        setOption: function (option, settings) {
            var self = this;
            var callbackEvent = {};
            option = typeof option === 'string' ? self.getOptions(option) : option;
            settings = settings || {};

            if (option !== undefined && option !== null && option.length && self.getOptionValue(option) !== undefined) {
                // Si l'option est désactivée, on passe à la précédente/suivante
                if (self.isDisabled(option) && settings.direction !== undefined) {
                    option = option[settings.direction === 'up' ? 'prev' : 'next']();

                    self.setOption(option, {
                        context: 'auto-move',
                        direction: settings.direction
                    });

                    return;
                }

                // Si l'option la dernière option trouvée est désactivée, on stop
                if (self.isDisabled(option)) {
                    return;

                } else {
                    // Si on est en mode multiple
                    if (self.isMultiple()) {
                        var optionsValues = [];
                        var optionsNames = [];

                        // Si l'option "none" est cochée, on l'enlève
                        if (self.element.multipleOptions.length === 1 && self.element.multipleOptions[0].hasClass(self.settings.classes.first)) {
                            self.getInput().empty();
                            self.element.multipleOptions[0].removeClass(self.settings.classes.selected);
                            self.element.multipleOptions = [];
                        }

                        // Si l'option est déjà sélectionnée on reconstruit la sélection, sinon on ajoute l'option
                        if (self.isSelected(option)) {
                            self.element.multipleOptions = [];
                            option.removeClass(self.settings.classes.selected);

                            self.getOptions('.' + self.settings.classes.selected).each(function (i, selectedOption) {
                                self.element.multipleOptions.push($(selectedOption));
                            });

                            if (self.element.multipleOptions.length === 0) {
                                setTimeout(function () {
                                    self.setOption('.' + self.settings.classes.first, settings);
                                }, 0);
                            }
                        } else {
                            self.element.multipleOptions.push(option);
                        }

                        // Reorder
                        self.element.multipleOptions.sort(function (a, b) {
                            var options = self.getOptions();
                            a = options.index(a);
                            b = options.index(b);

                            if (a === b) {
                                return 0;
                            }
                            return a < b ? -1 : 1;
                        });

                        // Reset
                        self.getInput().empty();
                        self.getOptions().removeClass(self.settings.classes.selected);

                        // Add
                        $.each(self.element.multipleOptions, function (i, option) {
                            option = $(option);

                            if (option !== undefined && option !== null && !self.isDisabled(option)) {
                                var optionValue = self.getOptionValue(option);
                                var optionName = option.html();
                                optionsValues.push(optionValue);
                                optionsNames.push(optionName);

                                // <select>
                                self.getInput().append($('<option>', {
                                    value: optionValue,
                                    html: optionName
                                }).prop('selected', true));

                                // Option
                                option.addClass(self.settings.classes.selected);
                            }
                        });

                        // Label
                        self.setLabel(optionsNames, optionsValues);

                        // User callback
                        if (self.settings.onChange !== undefined) {
                            callbackEvent = $.extend(callbackEvent, {
                                options: self.element.multipleOptions
                            });
                        }
                    }

                    // Mode classique
                    else {
                        var optionValue = self.getOptionValue(option);
                        var optionName  = option.html();

                        // <select>
                        self.getInput().html($('<option>', {
                            value: optionValue,
                            html: optionName
                        }).prop('selected', true));

                        // Label
                        self.setLabel(optionName, optionValue);

                        // Option
                        self.getOptions().removeClass(self.settings.classes.selected);
                        option.addClass(self.settings.classes.selected);

                        // User callback
                        if (self.settings.onChange !== undefined) {
                            callbackEvent = $.extend(callbackEvent, {
                                option: option
                            });
                        }
                    }

                    if (settings.context !== 'init') {
                        // Trigger change
                        self.getInput().triggerHandler('change');

                        // User callback
                        if (self.settings.onChange !== undefined) {
                            callbackEvent = $.extend({
                                customFormSelect: self,
                                wrapper: self.getWrapper(),
                                input: self.getInput(),
                                wrapperLabel: self.getWrapperLabel(),
                                settings: settings
                            }, callbackEvent);

                            self.settings.onChange.call(callbackEvent);
                        }
                    }
                }
            }

            return self;
        },

        /**
         * Enlève la sélection des options définies
         * 
         * @param  {string|object=undefined} options Sélecteur ou liste des options
         * @param  {boolean=undefined}       disable Désactive l'option en même temps
         */
        removeOptions: function (options, disable) {
            var self = this;
            options = (options === undefined || typeof options === 'string') ? self.getOptions(options) : options;
            disable = disable || false;

            if (!self.isMultiple()) {
                self.customForm.setLog('warn', 'removeOptions() works only with "multiple" attribute. Uses setOption() for classic <select>.');
                return;
            }

            if (options.length) {
                $.each(options, function (i, option) {
                    option = $(option);

                    if (self.isSelected(option)) {
                        self.setOption(option, {context: 'remove'});
                    }

                    if (disable) {
                        self.disableOption(option);
                    }
                });
            }

            return self;
        },

        /**
         * Désactive une option
         *
         * @param {object} option
         */
        disableOption: function (option) {
            option.addClass(this.settings.classes.disabled);

            return this;
        },

        /**
         * Détermine si l'option est sélectionnée
         *
         * @param {object} option
         *
         * @return {boolean}
         */
        isSelected: function (option) {
            return option.hasClass(this.settings.classes.selected);
        },

        /**
         * Détermine si l'option est désactivée
         *
         * @param {object} option
         *
         * @return {boolean}
         */
        isDisabled: function (option) {
            return option.hasClass(this.settings.classes.disabled);
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
            return this.getContext().find('.' + this.settings.classes.prefix + '--' + this.type).not(this.getWrapper());
        },

        /**
         * Retourne tous les éléments de customform
         *
         * @return {object}
         */
        getElements: function () {
            return this.element;
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
         * Retourne l'élément <select>
         *
         * @return {object}
         */
        getInput: function () {
            return this.getElements().input;
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
         * Retourne le wrapper générique du <select> (.customform-input)
         *
         * @return {object}
         */
        getWrapperInput: function () {
            return this.getElements().wrapperInput;
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
         * @param filter Sélecteur de filtre pour les options à retourner
         *
         * @return {object}
         */
        getOptions: function (filter) {
            var options = this.getWrapperOptions().find('.' + this.settings.classes.option);

            return (filter !== undefined) ? options.filter(filter) : options;
        },

        /**
         * Retourne les <option> sur <select> initial
         *
         * @return {object}
         */
        getSourceOptions: function () {
            return this.getElements().source.options;
        },

        /**
         * Retourne les <optgroup> sur <select> initial
         *
         * @return {object}
         */
        getSourceOptgroups: function () {
            return this.getElements().source.optgroups;
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
         * Retourne la valeur d'une option
         *
         * @param {object} option
         *
         * @return {null|string}
         */
        getOptionValue: function (option) {
            if (option !== undefined) {
                return option.attr('data-value');
            }

            return null;
        }
    };
})(jQuery);