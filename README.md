# Documentation CustomForm

Ce script permet de personnaliser les éléments d'un formulaire. Éléments supportés : checkbox, radio et select.

Compatibilité IE : 10+


## Initialisation

    $('context').customForm([options], [support]);


## Paramètres

### Options _object_

* **classes** _object_
Nom des classes

    Défaut :
    {
        prefix: 'customform',
        input : 'customform-input',
        states: {}
    }

    Check :
    {
        states: {
            checked : 'is-checked',
            disabled: 'is-disabled'
        }
    }

    Select :
    {
        select: {
            label           : {prefix}-selectLabel',
            options         : {prefix}-selectOptions',
            option          : {prefix}-selectOption',
            optionGroup     : {prefix}-selectOptionGroup',
            optionGroupLabel: {prefix}-selectOptionGroupLabel'
        },
        states: {
            first   : 'is-first',
            selected: 'is-selected',
            focused : 'is-focused',
            multiple: 'is-multiple',
            open    : 'is-open'
        }
    }

* **tabindexStart** _integer_
Index de départ pour l'attribut _tabindex_
    Défaut : 0

### Support _object_

Éléments supportés par CustomForm

* **checkbox** _object_

Objet jQuery pour les inputs de type checkbox
    Défaut : $('input:checkbox', $(this))

* **radio** _object_

Objet jQuery pour les inputs de type radio
    Défaut : $('input:radio', $(this))

* **select** _object_

Objet jQuery pour les selects
    Défaut : $('select', $(this))


## Callbacks

* **beforeWrap** _function_
Ajouter un traitement avant l'ajout des wrappers

    Défaut : undefined

    $('form').customForm({
        beforeWrap: function() {
            // this = {CustomForm, wrapper, wrapperInput}
            
            this.wrapper.addClass('my-custom-class');
        }
    });

* **onLoad** _function_
Ajouter un traitement une fois que CustomForm est fini de charger
    Défaut : undefined

    $('form').customForm({
        onLoad: function() {
            // this = {CustomForm}
        }
    });

* **onClick** _function_
Ajouter un traitement au click sur l'input/label (onclick, keyup)
    Défaut : undefined

    $('form').customForm({
        onClick: function() {
            // Si checkbox/radio : this = {CustomForm, wrapper, input, type, checked}
            // Si select : this = {CustomForm, wrapper, input, wrapperLabel, options}
        }
    });


* **onChange** _function_
Ajouter un traitement au changement de valeur sur un select
    Défaut : undefined

    $('form').customForm({
        onChange: function() {
            // this = {CustomForm, wrapper, input, wrapperLabel, option, options}
        }
    });

* **onReset** _function_
Ajouter un traitement au reset du form
    Défaut : undefined

    $('form').customForm({
        onReset: function() {
            // this = {CustomForm, form}
        }
    });