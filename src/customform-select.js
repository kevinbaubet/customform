/**
 * CustomForm - Select
 * 
 * Permet de personnaliser les éléments d'un formulaire
 *
 * @param object        customForm -> Données de CustomForm
 * @param jQuery object context    -> Élément de contexte <form>
 * @param jQuery object element    -> Élément à customiser
 */
(function($) {
    'use strict';
    
    $.CustomFormSelect = function(customForm, context, element) {
        this.context  = context;
        this.element  = {
            input: element,             // <select>
            type: customForm.inputType, // 'select'
            isMultiple: element.prop('multiple'),
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
        this.support = customForm.support;

        // Config
        this.settings = customForm.settings;
        $.extend(this.settings.classes, {
            select: {
                label           : this.settings.classes.prefix + '-selectLabel',
                options         : this.settings.classes.prefix + '-selectOptions',
                option          : this.settings.classes.prefix + '-selectOption',
                optionGroup     : this.settings.classes.prefix + '-selectOptionGroup',
                optionGroupLabel: this.settings.classes.prefix + '-selectOptionGroupLabel'
            }
        });
        $.extend(this.settings.classes.states, {
            first   : 'is-first',
            selected: 'is-selected',
            focused : 'is-focused',
            multiple: 'is-multiple',
            open    : 'is-open'
        });        

        // Vars
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
        this.setWrappers();
        this.loadHandler();
    };

    $.CustomFormSelect.prototype = {
        /**
         * Création des wrappers
         */
        setWrappers: function() {
            var self = this;
            var wrapper = $('<span>');
            var wrapperInput = $('<span>', {
                class: self.settings.classes.input,
                tabindex: self.settings.tabindexStart
            });

            // User callback
            if (self.settings.beforeWrap !== undefined) {
                self.settings.beforeWrap.call({
                    CustomForm: self,
                    wrapper: wrapper,
                    wrapperInput: wrapperInput
                });
            }
            var beforeWrapperClass = wrapper.attr('class');

            // Wrapper
            wrapper.attr('class', self.settings.classes.prefix + ' ' + self.settings.classes.prefix + '-select' + ((beforeWrapperClass) ? ' ' + beforeWrapperClass : ''));
            self.getInput().parent().wrapInner(wrapper);
            self.element.wrapper = self.getInput().parent();
            
            // Wrapper input
            self.getInput().wrap(wrapperInput);
            self.element.wrapperInput = self.element.input.parent();

            // Récupération des données du <select>
            self.element.source.options = self.getInput().children('option');
            self.element.source.optgroups = self.getInput().children('optgroup');

            // Wrappers
            self.getWrapperInput().append($('<span>', {
                class: self.settings.classes.select.label
            }));
            self.element.wrapperLabel = self.getInput().next();

            self.getWrapperInput().append($('<span>', {
                class: self.settings.classes.select.options
            }));
            self.element.wrapperOptions = self.getWrapperLabel().next();
            
            // Tabindex
            self.getWrapperInput().removeAttr('tabindex');
            self.getWrapperLabel().attr('tabindex', self.settings.tabindexStart);

            // Multiple
            if (self.element.isMultiple) {
                self.getWrapper().addClass(self.settings.classes.states.multiple);
            }

            // Options
            if (self.getSourceOptions().length) {
                $.each(self.getSourceOptions(), function(indexOption, option) {
                    var option = $(option);
                    var optionClasses = option.attr('class');

                    self.getWrapperOptions().append($('<span>', {
                        class: self.settings.classes.select.option + ((optionClasses !== undefined) ? ' ' + optionClasses : '') + ((option.attr('disabled') !== undefined) ? ' ' + self.settings.classes.states.disabled : ''),
                        'data-value': option.val(),
                        html: option.html()
                    }));
                });
            }

            // Optgroups
            if (self.getSourceOptgroups().length) {
                $.each(self.getSourceOptgroups(), function(indexOptgroup, optgroup) {
                    var optgroup = $(optgroup);
                    var selectOptionGroup = $('<span>', {
                        class: self.settings.classes.select.optionGroup
                    });
                    $('<span>', {
                        class: self.settings.classes.select.optionGroupLabel,
                        html: optgroup.attr('label')
                    }).appendTo(selectOptionGroup);

                    optgroup.children('option').each(function(indexOptgroupOption, option) {
                        var option = $(option);
                        var optionClasses = option.attr('class');

                        $('<span>', {
                            class: self.settings.classes.select.option + ((optionClasses !== undefined) ? ' ' + optionClasses : '') + ((option.attr('disabled') !== undefined) ? ' ' + self.settings.classes.states.disabled : ''),
                            'data-value': option.val(),
                            html: option.html()
                        }).appendTo(selectOptionGroup);
                    });

                    self.getWrapperOptions().append(selectOptionGroup);
                });
            }

            // First option
            self.getOptions().first().addClass(self.settings.classes.states.first);
        },

        /**
         * Execute l'initialisation des wrapper et appel les différents handler
         */
        loadHandler: function() {
            this.initElementsState();

            // Start events
            this.eventsHandler();
            this.resetHandler();

            // User callback
            if (this.settings.onLoad !== undefined) {
                this.settings.onLoad.call({
                    CustomForm: this
                });
            }
        },

        /**
         * [initElementsState description]
         * @return {[type]} [description]
         */
        initElementsState: function() {
            var self = this;
            var defaultValue = self.getInput().attr('data-default-value');            

            if (self.getInput().is(':disabled')) {
                this.getWrapper().addClass(this.settings.classes.states.disabled);
                this.getInput().removeAttr('tabindex');
                self.getWrapperLabel().removeAttr('tabindex');
            }

            if (defaultValue === undefined) {
                var defaultValue = self.getSourceOptions().filter('[selected]');
                if (defaultValue.length === 0) {
                    defaultValue = self.getSourceOptions().first();
                }

                if (defaultValue.length > 1) {
                    var defaultValues = [];
                    $.each(defaultValue, function() {
                        defaultValues.push($(this).val());
                    });
                    
                    defaultValue = defaultValues.join(',');
                } else {
                    defaultValue = defaultValue.val();
                }
                self.getInput().attr('data-default-value', defaultValue);
            }
            
            self.getOptions().each(function() {
                var option = $(this);
                var optionValue = option.attr('data-value');
                
                if (defaultValue.indexOf(',') !== -1) {
                    $.each(defaultValue.split(','), function(i, defaultValue) {
                        if (optionValue === defaultValue) {
                            self.setOptions.call(self, option);
                        }
                    });
                } else if (optionValue === defaultValue) {
                    self.setOption.call(self, option);
                }
            });
        },

        /**
         * [eventsHandler description]
         * @return {[type]} [description]
         */
        eventsHandler: function() {
            var self = this;

            self.getWrapperLabel().on('click.open keyup.open', function(event) {
                if (self.getInput().is(':disabled')) {
                    return;
                }

                if (event.type === 'click') {
                    self.clickHandler.call(self, event);
                }

                if (event.type === 'keyup') {
                    self.keyupHandler.call(self, event);
                }
            });
        },

        /**
         * Initialise un event "reset" sur le sélecteur contexte
         */
        resetHandler: function() {
            var self = this;

            self.context.on('reset', function() {
                var form = $(this);
                
                self.getWrapper(form.find(self.support['select'])).removeClass(self.settings.classes.states.disabled);

                setTimeout(function() {
                    self.initElementsState();

                    // User callback
                    if (self.settings.onReset !== undefined) {
                        self.settings.onReset.call({
                            CustomForm: self,
                            form: form
                        });
                    }
                }, 0);
            });
        },

        /**
         * [preventHandler description]
         * @return {[type]}      [description]
         */
        preventHandler: function() {
            var self = this;

            self.getWrapperLabel().focus().one('click.close', function() {
                self.close.call(self);
            });

            self.getWrapperLabel().one('blur.close', function() {
                var close = true;
                if (self.element.isMultiple) {
                    self.getOptions().one('click.option', function() {
                        close = false;
                    });
                }
                
                setTimeout(function() {
                    if (close) {
                        self.close.call(self);
                    }
                }, 200);
            });

            $(window).one('keydown.open', function(event) {
                if (event.keyCode !== 9) {
                    event.preventDefault();
                }
            });

            return true;
        },

        /**
         * [close description]
         * @return {[type]} [description]
         */
        close: function() {
            this.getWrapper().removeClass(this.settings.classes.states.open);
            this.getWrapperLabel().off('click.close blur.close');
            this.getOptions().off('click.option');
            $(window).off('keydown.open');
        },

        /**
         * [clickHandler description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        clickHandler: function(event) {
            var self = this;
            var preventDefault = self.preventHandler.call(self);
            
            if (preventDefault) { 
                self.getWrapper().addClass(self.settings.classes.states.open);

                self.getOptions().on('click.option', function() {
                    if (self.element.isMultiple) {
                        self.setOptions.call(self, $(this));
                    } else {
                        self.setOption.call(self, $(this));
                    }
                });
            }

            // Trigger click
            self.getInput().triggerHandler('click');
            
            // User callback
            if (self.settings.onClick !== undefined) {
                self.settings.onClick.call({
                    CustomForm: self,
                    wrapper: self.getWrapper(),
                    input: self.getInput(),
                    wrapperLabel: self.getWrapperLabel(),
                    options: self.getOptions()
                });
            }
        },

        /**
         * [keyupHandler description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        keyupHandler: function(event) {
            var self = this;
            var direction = (event.keyCode === 37 || event.keyCode === 38) ? 'up' : (event.keyCode === 39 || event.keyCode === 40) ? 'down' : undefined;
            var fastDirection = (event.keyCode === 35) ? 'last' : (event.keyCode === 36) ? 'first' : undefined;
            var isClose = (event.keyCode === 27 || event.keyCode === 13);
            var isLetter = (event.keyCode >= 48 && event.keyCode <= 105);

            if (isClose) {
                self.close.call(self);
                return;
            }

            if (direction !== undefined || fastDirection !== undefined) {
                self.preventHandler.call(self);
            }

            var option = null;
            var currentOptionIndex = null;
            var optionsLength = 0;
            self.getOptions().each(function(i, selector) {
                var option = $(selector);
                self.keyup.options[i] = option;

                if (option.hasClass(self.settings.classes.states.selected)) {
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

                    self.keyup.timeout = setTimeout(function() {
                        self.setOption.call(self, self.getOptionOnkeyup.call(self));
                    }, 250);
                }
            }
            self.setOption.call(self, option, {
                direction: direction
            });

            // Trigger keyup
            self.getInput().triggerHandler('keyup');
        },

        /**
         * [getOptionOnkeyup description]
         * @return {[type]} [description]
         */
        getOptionOnkeyup: function() {
            var searchString = this.keyup.search.join('', this.keyup.search);
            var out = null;
            
            var seachResults = [];
            $.each(this.getOptions(), function(i, option) {
                var option = $(option);
                seachResults.push(option.html().toLowerCase().indexOf(searchString));
            });

            var searchIndexResult = [];
            $.each(seachResults, function(seachIndex, searchStringIndex) {
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
         * [setOption description]
         */
        setOption: function(option, settings) {
            if (settings === undefined) {
                var settings = {};
            }

            if (option !== null && option !== undefined) {
                if (option.hasClass(this.settings.classes.states.disabled) && settings.direction !== undefined) {
                    option = option[(settings.direction === 'up') ? 'prev' : 'next']();
                    this.setOption.call(this, option, {
                        direction: settings.direction
                    });
                    return;
                }

                if (option.length && !option.hasClass(this.settings.classes.states.disabled)) {
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
                    this.getOptions().removeClass(this.settings.classes.states.selected);
                    option.addClass(this.settings.classes.states.selected);

                    // Trigger change
                    this.getInput().triggerHandler('change');

                    // User callback
                    if (this.settings.onChange !== undefined) {
                        this.settings.onChange.call({
                            CustomForm: this,
                            wrapper: this.getWrapper(),
                            input: this.getInput(),
                            wrapperLabel: this.getWrapperLabel(),
                            option: option
                        });
                    }
                }
            }
        },

        /**
         * [setOptions description]
         * @param {[type]} option [description]
         */
        setOptions: function(option) {
            var self = this;
            var optionsValues = [];
            var optionsNames = [];

            // Si l'option est déjà sélectionnée on reconstruit la sélection, sinon on ajoute l'option
            if (option.hasClass(self.settings.classes.states.selected)) {
                self.element.multipleOptions = [];
                option.removeClass(self.settings.classes.states.selected);
                self.getOptions().filter('.' + self.settings.classes.states.selected).each(function() {
                    self.element.multipleOptions.push($(this));
                });

                if (self.element.multipleOptions.length === 0) {
                    setTimeout(function() {
                        self.setOption.call(self, self.getOptions().filter('.' + self.settings.classes.states.first));
                    }, 0);
                }
            } else {
                self.element.multipleOptions.push(option);
            }

            // Reset
            self.getInput().empty();
            self.getOptions().removeClass(self.settings.classes.states.selected);

            // Add
            $.each(self.element.multipleOptions, function(i, option) {
                var option = $(option);

                if (option !== null && option !== undefined && !option.hasClass(self.settings.classes.states.disabled)) {
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
                    option.addClass(self.settings.classes.states.selected);
                }
            });

            // Label
            self.getWrapperLabel().attr('data-value', optionsValues.join(',')).html(optionsNames.join(', '));

            // Trigger change
            self.getInput().triggerHandler('change');

            // User callback
            if (self.settings.onChange !== undefined) {
                self.settings.onChange.call({
                    CustomForm: this,
                    wrapper: self.getWrapper(),
                    input: self.getInput(),
                    wrapperLabel: self.getWrapperLabel(),
                    options: self.element.multipleOptions
                });
            }
        },

        /**
         * [getInput description]
         * @return {[type]} [description]
         */
        getInput: function() {
            return this.element.input;
        },

        /**
         * [getWrapper description]
         * @return {[type]} [description]
         */
        getWrapper: function(children) {
            if (children !== undefined) {
                return children.closest('.' + this.settings.classes.prefix);
            } else {
                return this.element.wrapper;
            }
        },

        /**
         * [wrapperInput description]
         * @return {[type]} [description]
         */
        getWrapperInput: function() {
            return this.element.wrapperInput;
        },
        getWrapperLabel: function() {
            return this.element.wrapperLabel;
        },
        getWrapperOptions: function() {
            return this.element.wrapperOptions;
        },
        getOptions: function() {
            return this.getWrapperOptions().find('.' + this.settings.classes.select.option);
        },

        /**
         * [getSourceOptions description]
         * @return {[type]} [description]
         */
        getSourceOptions: function() {
            return this.element.source.options;
        },
        getSourceOptgroups: function() {
            return this.element.source.optgroups;
        }
    };
})(jQuery);