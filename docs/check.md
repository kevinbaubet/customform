# Checkboxs & Radios

Ce support permet de personnaliser 2 types d'input : checkbox et radio.

* Nom des supports : **checkbox**, **radio**
* Nom du fichier : **customform-check.js**
* Nom de la classe : **$.CustomFormCheck**


## Initialisation

    var customForm = $('form').customForm([options]);
    
    customForm.setSupport('checkbox', [options]);
    customForm.setSupport('radio', [options]);
    
    // or
    
    customForm.setSupports(['checkbox', 'radio']);


## Options

| Option                          | Type     | Valeur par défaut | Description                                     |
|---------------------------------|----------|-------------------|-------------------------------------------------|
| classes                         | object   | Voir ci-dessous   | Objet pour les options ci-dessous               |
| &nbsp;&nbsp;&nbsp;&nbsp;checked | string   | 'is-checked'      | Classe quand l'input est coché                  |
| beforeLoad                      | function | undefined         | Callback au début du chargement                 |
| beforeWrap                      | function | undefined         | Callback avant l'ajout des wrappers dans le DOM |
| afterEventsHandler              | function | undefined         | Callback après la déclaration des événements    |
| onComplete                      | function | undefined         | Callback à la fin du chargement                 |
| onClick                         | function | undefined         | Callback au click sur l'input                   |
| onReset                         | function | undefined         | Callback au reset du formulaire                 |


## API

[Hérite de l'API des supports CustomForm.](../README.md#api-supports)

### Callback vs Instance

Pour utiliser l'API, il y a 2 solutions :

* **Callback** : Utiliser les options de type "function" ci-dessus. Cela va fonctionner pour tous les inputs présents dans le *form*.

        var customForm = $('form').customForm();
        
        customForm.setSupport('checkbox', {
            onClick: function () {
                this.customFormCheck.disable();
            }
        });
    
* **Instance** : Utiliser une instance précise.

        var customForm = $('form').customForm();
        var checkboxes = customForm.setSupport('checkbox');
        var checkbox = customForm.getInstance(checkboxes, $('#checkbox1-1'));
        
        if (checkbox instanceof $.CustomFormCheck) {
            checkbox.getInput().on('click', function () {
                checkbox.disable();
            });
        }

### reset()

Initialise l'état des éléments par défaut

### select()

Sélectionne une option

### unselect()

Enlève la sélection d'une checkbox

* @param *{boolean=false}* **disable** Désactive la checkbox en même temps

### disable()

Désactive l'input

### isChecked()

Détermine si l'input est cochée

* @return *{boolean}*

### getInputsRadio()

Retourne tous les inputs de type radio

* @return *{object}*