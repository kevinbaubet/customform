## Créer un support

Il est possible d'ajouter autant de support que vous voulez.

Il faut d'abord ajouter un sélecteur à la liste des supports :

    $.CustomForm.supports.name = 'input[type="name"]';
    
    // or
    
    $('form').customForm([options], {
        name: 'input[type="name"]'
    });
    

Puis créer la classe JS associée :

    $.CustomFormName(customForm, options) {
        this.customForm = customForm;
        $.extend($.CustomFormName.prototype, $.CustomForm.prototype);
    
        if (this.prepareUserOptions()) {
            this.init();
        }
        
        return this;
    };
    
    $.CustomFormName.prototype = {
        /**
         * Initialisation
         */
        init: function() {
            console.log('in the support "name"');
            
            return this;
        }
    };