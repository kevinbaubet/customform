/**
 * CustomForm
 * 
 * Permet de personnaliser les éléments d'un formulaire
 *
 * @param jQuery object context -> Élément de contexte <form>
 * @param object        options -> Options utilisateur
 * @param object        support -> Support de la personnalisation : {type: 'selecteur'}
 *
 * @version 3.0 (20/05/2016)
 */
(function($) {
    'use strict';

    /**
     * Support
     * @type {Object}
     */
    $.CustomFormSupport = {
        checkbox: 'input:checkbox',
        radio: 'input:radio',
        select: 'select'
    };

    /**
     * Config par défaut
     * @type {Object}
     */
    $.CustomFormDefaults = {
        classes             : {
            prefix: 'customform',
            input : 'customform-input',
            states: {}
        },
        tabindexStart: 0,
        beforeWrap   : undefined,
        onLoad       : undefined,
        onClick      : undefined,
        onChange     : undefined,
        onReset      : undefined
    };

    /**
     * Fonction utilisateur
     * @param  object options -> Options utilisateur
     * @param  object support -> Support de la personnalisation : {type: 'selecteur'}
     */
    $.fn.customForm = function(options, support) {
        var customForm = {};
        customForm.contexts = $(this);

        // Config
        $.extend((customForm.settings = {}), $.CustomFormDefaults, options);

        // Support
        $.extend((customForm.support = {}), $.CustomFormSupport, support);

        // Instances
        customForm.contexts.each(function() {
            var context = $(this);

            $.each(customForm.support, function(type, selector) {
                if (selector !== null) {
                    customForm.inputType = type;

                    $(selector, context).each(function() {
                        var element = $(this);

                        if (type === 'checkbox' || type === 'radio') {
                            if ($.CustomFormCheck !== undefined) {
                                new $.CustomFormCheck(customForm, context, element);
                            }
                        } else if (type === 'select') {
                            if ($.CustomFormSelect !== undefined) {
                                new $.CustomFormSelect(customForm, context, element);
                            }
                        }
                    });
                }
            });
        });
    };
})(jQuery);