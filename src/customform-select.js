(function ($) {
    'use strict';

    $.CustomFormSelect = function (CustomForm, options) {
        // Héritage
        this.CustomForm = CustomForm;

        // Config
        this.element  = {
            body: $('body'),
            context: this.CustomForm.elementContext,
            input: this.CustomForm.elementInput,     // <select>
            type: this.CustomForm.support.type,      // 'select'
            isMultiple: this.CustomForm.elementInput.prop('multiple'),
            wrapper: null,              // Wrapper global
            wrapperInput: null,         // Wrapper du <select>
            source: {
                options: null,          // <option> du <select>
                optgroups: null         // <optgroup> du <select>
            },
            wrapperLabel: null,         // Wrapper du label du select custom (correspond à la valeur sélectionnée)
            wrapperOptions: null        // Wrapper des options du select custom
        };
        if (this.element.isMultiple) {
            this.element.multipleOptions = [];
        }
        $.extend(true, (this.settings = {}), this.CustomForm.settings, $.CustomFormSelect.defaults, options);

        // Variables
        this.keyup = {
            timeout: null,
            keyCodeToKey: {
                48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9', 65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z', 96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9'
            },
            search: [],
            options: {}
        };
        this.optionsData = {};

        // Init
        if (this.prepareOptions()) {
            this.load();
        }
    };

    $.CustomFormSelect.defaults = {
        classes: {
            label: '{prefix}-selectLabel',
            options: '{prefix}-selectOptions',
            option: '{prefix}-selectOption',
            optionGroup: '{prefix}-selectOptionGroup',
            optionGroupLabel: '{prefix}-selectOptionGroupLabel',
            first: 'is-first',
            selected: 'is-selected',
            multiple: 'is-multiple',
            open: 'is-open'
        },
        multipleOptionsSeparator: ', ',
        onLoad: undefined,
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
         * @return bool
         */
        prepareOptions: function () {
            // Classes
            this.CustomForm.replacePrefixClass.call(this);

            return true;
        },

        /**
         * Initialisation
         */
        load: function () {
            // User callback
            if (this.settings.onLoad !== undefined) {
                this.settings.onLoad.call({
                    CustomFormSelect: this,
                    element: this.element
                });
            }

            // Load
            this.wrap();
            this.initElementsState();
            this.eventsHandler();
            this.resetHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    CustomFormSelect: this,
                    element: this.element
                });
            }
        },

        /**
         * Création des wrappers
         */
        wrap: function () {
            var self = this;
            self.element.wrapper = $('<span>', {
                class: self.settings.classes.prefix + ' ' + self.settings.classes.prefix + '--select'
            });
            self.element.wrapperInput = $('<span>', {
                class: self.settings.classes.input,
                tabindex: self.settings.tabindexStart
            });

            // User callback
            if (self.settings.beforeWrap !== undefined) {
                self.settings.beforeWrap.call({
                    CustomForm: self,
                    wrapper: self.element.wrapper,
                    wrapperInput: self.element.wrapperInput
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
                class: self.settings.classes.label
            }));
            self.element.wrapperLabel = self.getInput().next();

            self.getWrapperInput().append($('<span>', {
                class: self.settings.classes.options
            }));
            self.element.wrapperOptions = self.getWrapperLabel().next();

            // Tabindex
            self.getWrapperInput().removeAttr('tabindex');
            self.getWrapperLabel().attr('tabindex', self.settings.tabindexStart);

            // Multiple
            if (self.element.isMultiple) {
                self.getWrapper().addClass(self.settings.classes.multiple);
            }

            // Options
            if (self.getSourceOptions().length) {
                $.each(self.getSourceOptions(), function (indexOption, option) {
                    option = $(option);
                    var optionClasses = option.attr('class');

                    self.getWrapperOptions().append($('<span>', {
                        class: self.settings.classes.option + ((optionClasses !== undefined) ? ' ' + optionClasses : '') + ((option.attr('disabled') !== undefined) ? ' ' + self.settings.classes.disabled : ''),
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
                        class: self.settings.classes.optionGroup
                    });
                    $('<span>', {
                        class: self.settings.classes.optionGroupLabel,
                        html: optgroup.attr('label')
                    }).appendTo(selectOptionGroup);

                    optgroup.children('option').each(function (indexOptgroupOption, option) {
                        option = $(option);
                        var optionClasses = option.attr('class');

                        $('<span>', {
                            class: self.settings.classes.option + ((optionClasses !== undefined) ? ' ' + optionClasses : '') + ((option.attr('disabled') !== undefined) ? ' ' + self.settings.classes.disabled : ''),
                            'data-value': option.val(),
                            html: option.html()
                        }).appendTo(selectOptionGroup);
                    });

                    self.getWrapperOptions().append(selectOptionGroup);
                });
            }

            // First option
            self.getOptions().first().addClass(self.settings.classes.first);
        },

        /**
         * Défini l'état des éléments à l'initialisation
         */
        initElementsState: function () {
            var self = this;
            var defaultValue = self.getInput().attr('data-default-value');

            if (self.getInput().is(':disabled')) {
                self.getWrapper().addClass(self.settings.classes.disabled);
                self.getInput().removeAttr('tabindex');
                self.getWrapperLabel().removeAttr('tabindex');
            }

            if (defaultValue === undefined) {
                defaultValue = self.getSourceOptions().filter('[selected]');

                if (defaultValue.length === 0) {
                    defaultValue = self.getSourceOptions().first();
                }

                if (defaultValue.length > 1) {
                    var defaultValues = [];
                    $.each(defaultValue, function () {
                        defaultValues.push($(this).val());
                    });

                    defaultValue = defaultValues.join(',');
                } else {
                    defaultValue = defaultValue.val();
                }
                self.getInput().attr('data-default-value', defaultValue);
            }

            self.getOptions().each(function () {
                var option = $(this);
                var optionValue = option.attr('data-value');

                if (self.element.isMultiple) {
                    $.each(defaultValue.split(','), function (i, defaultValue) {
                        if (optionValue === defaultValue) {
                            self.setOptions.call(self, option);
                        }
                    });
                } else if (optionValue === defaultValue) {
                    self.setOption.call(self, option);
                }
            });

            return self;
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            self.getWrapperLabel().on('click.customform.open keyup.customform.open', function (event) {
                if (self.getInput().is(':disabled')) {
                    return false;
                }

                if (event.type === 'click') {
                    self.clickHandler(event);
                }

                if (event.type === 'keyup') {
                    self.keyupHandler(event);
                }
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    CustomFormSelect: this,
                    element: this.element
                });
            }
        },

        /**
         * Initialise un event "reset" sur le sélecteur contexte
         */
        resetHandler: function () {
            var self = this;

            self.getContext().on('reset.customform', function () {
                var form = $(this);

                self.getWrapper().removeClass(self.settings.classes.disabled);

                setTimeout(function () {
                    self.initElementsState();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            CustomFormSelect: self,
                            form: form
                        });
                    }
                }, 0);
            });
        },

        /**
         * Gestionnaire de fermeture
         */
        closeHandler: function () {
            var self = this;

            // Fermeture des autres selects
            self.closeSiblings();

            // Label
            self.getWrapperLabel().one('click.customform.close', function () {
                self.close();
            });

            // Options
            self.element.body.on('click.customform.close', function (event) {
                var target = $(event.target);

                if ((!self.element.isMultiple && target.hasClass(self.settings.classes.option)) || (!target.hasClass(self.settings.classes.label) && !target.hasClass(self.settings.classes.option))) {
                    self.close();
                }
            });
        },

        /**
         * Fermeture des options
         */
        close: function () {
            this.getWrapper().removeClass(this.settings.classes.open);
            this.getWrapperLabel().off('click.customform.close');
            this.getOptions().off('click.customform.option');
            this.element.body.off('click.customform.close');

            return this;
        },

        /**
         * Fermeture des autres selects
         */
        closeSiblings: function () {
            var self = this;
            var siblings = self.element.context.find('.' + self.settings.classes.prefix + '--select').not(self.element.wrapper);

            if (siblings.length) {
                siblings.each(function () {
                    $(this)
                        .removeClass(self.settings.classes.open)
                        .find('.' + self.settings.classes.label)
                            .off('click.customform.close').end()
                        .find('.' + self.settings.classes.option)
                            .off('click.customform.option');
                });

                self.element.body.off('click.customform.close');
            }

            return self;
        },

        /**
         * Lors du click
         *
         * @param object event Evenement click
         */
        clickHandler: function (event) {
            var self = this;

            // Close handler
            self.closeHandler();

            // Ouverture des options
            self.getWrapper().addClass(self.settings.classes.open);

            // Ajout d'un événement sur les options
            self.getOptions().on('click.customform.option', function () {
                self[(self.element.isMultiple) ? 'setOptions' : 'setOption'].call(self, $(this));
            });

            // Trigger click
            self.getInput().triggerHandler('click');

            // User callback
            if (self.settings.onClick !== undefined) {
                self.settings.onClick.call({
                    CustomFormSelect: self,
                    event: event,
                    wrapper: self.getWrapper(),
                    input: self.getInput(),
                    wrapperLabel: self.getWrapperLabel(),
                    options: self.getOptions()
                });
            }
        },

        /**
         * Lors du keyup
         *
         * @param object event Evenement keyup
         */
        keyupHandler: function (event) {
            var self = this;
            var direction = (event.keyCode === 37 || event.keyCode === 38) ? 'up' : (event.keyCode === 39 || event.keyCode === 40) ? 'down' : undefined;
            var fastDirection = (event.keyCode === 35) ? 'last' : (event.keyCode === 36) ? 'first' : undefined;
            var isClose = (event.keyCode === 27 || event.keyCode === 13);
            var isLetter = (event.keyCode >= 48 && event.keyCode <= 105);

            if (isClose) {
                self.close();
                return false;
            }

            if (direction !== undefined || fastDirection !== undefined) {
                self.closeHandler();
            }

            var option = null;
            var currentOptionIndex = null;
            var optionsLength = 0;
            self.getOptions().each(function (i, selector) {
                var option = $(selector);
                self.keyup.options[i] = option;

                if (option.hasClass(self.settings.classes.selected)) {
                    currentOptionIndex = i;
                }

                optionsLength++;
            });

            if (direction === 'up') {
                option = self.keyup.options[currentOptionIndex-1];
            } else if (direction === 'down') {
                option = self.keyup.options[currentOptionIndex+1];
            } else if (fastDirection !== undefined) {
                option = (fastDirection === 'last') ? self.keyup.options[optionsLength-1] : self.keyup.options[0];
            } else if (isLetter) {
                var letter = (event.key !== undefined) ? event.key : self.keyup.keyCodeToKey[event.keyCode];

                if (letter !== undefined) {
                    clearTimeout(self.keyup.timeout);
                    self.keyup.search.push(letter);

                    self.keyup.timeout = setTimeout(function () {
                        self.setOption.call(self, self.getOptionOnkeyup.call(self));
                    }, 250);
                }
            }

            if (!self.element.isMultiple) {
                self.setOption.call(self, option, {
                    direction: direction
                });
            }

            // Trigger keyup
            self.getInput().triggerHandler('keyup');
        },

        /**
         * Récupère l'option en fonction de la saisie
         *
         * @return string
         */
        getOptionOnkeyup: function () {
            var searchString = this.keyup.search.join('', this.keyup.search);
            var out = null;

            var seachResults = [];
            $.each(this.getOptions(), function (i, option) {
                option = $(option);
                seachResults.push(option.html().toLowerCase().indexOf(searchString));
            });

            var searchIndexResult = [];
            $.each(seachResults, function (seachIndex, searchStringIndex) {
                if (searchStringIndex !== -1) {
                    searchIndexResult.push(seachIndex);
                }
            });

            if (searchIndexResult.length) {
                searchIndexResult = searchIndexResult.shift();
                out = this.keyup.options[searchIndexResult];
            }

            this.keyup.search = [];
            return out;
        },

        /**
         * Sélectionne l'option définie
         */
        setOption: function (option, settings) {
            settings = settings || {};

            if (option !== null && option !== undefined && option.attr('data-value') !== undefined) {
                if (option.hasClass(this.settings.classes.disabled) && settings.direction !== undefined) {
                    option = option[(settings.direction === 'up') ? 'prev' : 'next']();
                    this.setOption.call(this, option, {
                        direction: settings.direction
                    });
                    return;
                }

                if (option.length && !option.hasClass(this.settings.classes.disabled)) {
                    var optionValue = option.attr('data-value');
                    var optionName  = option.html();

                    // <select>
                    this.getInput().html($('<option>', {
                        value: optionValue,
                        html: optionName
                    }));

                    // Label
                    this.getWrapperLabel().attr('data-value', optionValue).html(optionName);

                    // Option
                    this.getOptions().removeClass(this.settings.classes.selected);
                    option.addClass(this.settings.classes.selected);

                    // Trigger change
                    this.getInput().triggerHandler('change');

                    // User callback
                    if (this.settings.onChange !== undefined) {
                        this.settings.onChange.call({
                            CustomFormSelect: this,
                            wrapper: this.getWrapper(),
                            input: this.getInput(),
                            wrapperLabel: this.getWrapperLabel(),
                            option: option
                        });
                    }
                }
            }

            return this;
        },

        /**
         * Sélectionne les options définies
         */
        setOptions: function (option) {
            var self = this;
            var optionsValues = [];
            var optionsNames = [];

            if (option !== null && option !== undefined && option.attr('data-value') !== undefined) {
                if (option.hasClass(self.settings.classes.disabled)) {
                    return;
                } else {
                    // Si l'option "none" est cochée, on l'enlève
                    if (self.element.multipleOptions.length === 1 && self.element.multipleOptions[0].hasClass('is-first')) {
                        self.getInput().empty();
                        self.element.multipleOptions[0].removeClass(self.settings.classes.selected);
                        self.element.multipleOptions = [];
                    }

                    // Si l'option est déjà sélectionnée on reconstruit la sélection, sinon on ajoute l'option
                    if (option.hasClass(self.settings.classes.selected)) {
                        self.element.multipleOptions = [];
                        option.removeClass(self.settings.classes.selected);
                        self.getOptions('.' + self.settings.classes.selected).each(function () {
                            self.element.multipleOptions.push($(this));
                        });

                        if (self.element.multipleOptions.length === 0) {
                            setTimeout(function () {
                                self.setOption.call(self, self.getOptions('.' + self.settings.classes.first));
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
                        return (a < b) ? -1 : 1;
                    });

                    // Reset
                    self.getInput().empty();
                    self.getOptions().removeClass(self.settings.classes.selected);

                    // Add
                    $.each(self.element.multipleOptions, function (i, option) {
                        option = $(option);

                        if (option !== null && option !== undefined && !option.hasClass(self.settings.classes.disabled)) {
                            var optionValue = option.attr('data-value');
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
                    self.getWrapperLabel().attr('data-value', optionsValues.join(',')).html(optionsNames.join(self.settings.multipleOptionsSeparator));

                    // Trigger change
                    self.getInput().triggerHandler('change');

                    // User callback
                    if (self.settings.onChange !== undefined) {
                        self.settings.onChange.call({
                            CustomFormSelect: this,
                            wrapper: self.getWrapper(),
                            input: self.getInput(),
                            wrapperLabel: self.getWrapperLabel(),
                            options: self.element.multipleOptions
                        });
                    }
                }
            }

            return self;
        },

        /**
         * Enlève la sélection des options définies
         * 
         * @param  string|jQuery object options Sélecteur ou liste des options
         * @param  boolean              disable Désactiver l'option en même temps
         */
        removeOptions: function (options, disable) {
            var self = this;
            options = (typeof options === 'string') ? self.getOptions(options) : options;
            disable = disable || false;

            if (options.length) {
                $.each(options, function () {
                    var option = $(this);

                    if (option.hasClass(self.settings.classes.selected)) {
                        self.setOptions(option);
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
         * @param  jQuery object option
         * @return bool
         */
        disableOption: function (option) {
            option.addClass(this.settings.classes.disabled);

            return this;
        },

        /**
         * Alias pour récupérer les éléments
         */
        getContext: function () {
            return this.element.context;
        },
        getInput: function () {
            return this.element.input;
        },
        getWrapper: function (children) {
            return (children !== undefined) ? children.closest('.' + this.settings.classes.prefix) : this.element.wrapper;
        },
        getWrapperInput: function () {
            return this.element.wrapperInput;
        },
        getWrapperLabel: function () {
            return this.element.wrapperLabel;
        },
        getWrapperOptions: function () {
            return this.element.wrapperOptions;
        },
        getOptions: function (filter) {
            var options = this.getWrapperOptions().find('.' + this.settings.classes.option);

            return (filter !== undefined) ? options.filter(filter) : options;
        },
        getSourceOptions: function () {
            return this.element.source.options;
        },
        getSourceOptgroups: function () {
            return this.element.source.optgroups;
        },
        getValue: function (defaultValue) {
            defaultValue = defaultValue || false;

            var value = (defaultValue) ? this.getInput().attr('data-default-value') : this.getWrapperLabel().attr('data-value');

            if (this.element.isMultiple) {
                return value.split(',');
            }

            return value;
        },
        getDefaultValue: function () {
            return this.getValue(true);
        },
        getOptionValue: function (option) {
            option = option || undefined;

            if (option !== undefined) {
                return option.attr('data-value') || null;
            }

            return false;
        }
    };
})(jQuery);