/**
 * CustomForm - Label
 *
 * Ajoute un état sur les labels quand on focus les inputs
 */
(function($) {
    'use strict';

    $.CustomFormLabel = function(context, options, support) {
        this.context = context;
        this.elements = {};

        // Support
        $.extend((this.support = []), $.CustomFormLabel.support, support);
        this.elements.inputs = $(this.support.join(','), this.context);

        // Config
        $.extend((this.settings = {}), $.CustomFormLabel.defaults, options);

        // Init
        this.init();
        this.eventsHandler();
    };

    $.CustomFormLabel.support = [
        'input[type="text"]',
        'input[type="password"]',
        'input[type="number"]',
        'input[type="date"]',
        'input[type="month"]',
        'input[type="week"]',
        'input[type="time"]',
        'input[type="datetime"]',
        'input[type="datetime-local"]',
        'input[type="email"]',
        'input[type="search"]',
        'input[type="tel"]',
        'input[type="url"]',
        'textarea'
    ];
    $.CustomFormLabel.defaults = {
        wrapper   : '.form-item',
        classes   : {
            prefix  : 'customform',
            label   : 'customform-label',
            selected: 'is-selected',
            focused : 'is-focused'
        },
        onLoad    : undefined,
        onClick   : undefined,
        onBlur    : undefined
    };

    $.CustomFormLabel.prototype = {
        init: function() {
            var self = this;

            self.elements.inputs.each(function() {
                var input = $(this);
                var wrapper = self.getWrapper(input);
                
                wrapper.addClass(self.settings.classes.label);
                
                if (input.val().length > 0) {
                    wrapper.addClass(self.settings.classes.focused);
                }
            });

            // User callback
            if (self.settings.onLoad !== undefined) {
                self.settings.onLoad.call({
                    CustomFormLabel: self,
                    context: self.context,
                    inputs: self.elements.inputs
                });
            }
        },
        eventsHandler: function() {
            var self = this;
            
            self.elements.inputs.on({
                'click keyup': function(event) {
                    var input = $(this);
                    var wrapper = self.getWrapper(input);

                    wrapper.addClass(self.settings.classes.focused + ' ' + self.settings.classes.selected);
                    
                    // User callback
                    if (self.settings.onClick !== undefined) {
                        self.settings.onClick.call({
                            CustomFormLabel: self,
                            event: event,
                            wrapper: wrapper,
                            input: input
                        });
                    }
                },
                blur: function(event) {
                    var input = $(this);
                    var wrapper = self.getWrapper(input);

                    if (input.val().length > 0) {
                        wrapper.removeClass(self.settings.classes.selected);
                    } else {
                        wrapper.removeClass(self.settings.classes.focused + ' ' + self.settings.classes.selected);
                    }

                    // User callback
                    if (self.settings.onBlur !== undefined) {
                        self.settings.onBlur.call({
                            CustomFormLabel: self,
                            event: event,
                            wrapper: wrapper,
                            input: input
                        });
                    }
                }
            });
        },
        /**
         * Récupère le wrapper parent depuis un élément enfant
         * @param  jQuery object children
         * @return l'objet jQuery wrapper global
         */
        getWrapper: function(input) {
            return input.closest(this.settings.wrapper);
        }
    };
    
    $.fn.customFormLabel = function(options, support) {
        return new $.CustomFormLabel($(this), options, support);
    };
})(jQuery);