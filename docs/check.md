## Checkboxs & Radios

Ce support permet de personnaliser 2 types d'input : checkbox et radio.

Nom des supports :

* **checkbox**
* **radio**


### Initialisation

    var customForm = $('form').customForm([options]);
    
    customForm.setSupport('checkbox', [options]);
    customForm.setSupport('radio', [options]);
    
    // or
    
    customForm.setSupports(['checkbox', 'radio']);


### Options

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


### API

#### Callback vs Instance

Pour utiliser l'api, il y a 2 solutions :

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

#### reset()

Initialise l'état des éléments (coché, désactivé, etc) par défaut

#### select()

Sélectionne une option

#### remove()

Enlève la sélection d'une checkbox

* @param *{boolean=false}* **disable** Désactive la checkbox en même temps

#### disable()

Désactive l'input

#### isChecked()

Détermine si l'input est cochée

* @return *{boolean}*

#### isDisabled()

Détermine si l'input est désactivée

* @return *{boolean}*

#### getElements()

Retourne tous les éléments de customform

* @return *{object}*

#### getContext()

Retourne le contexte de customform (<form>)

* @return *{object}*

#### getInput()

Retourne l'élément <input>

* @return *{object}*

#### getInputType()

Retourne le type de l'élément <input>

* @return *{string}*

#### getWrapper()

Retourne le wrapper générique global (.customform)

* @param {object=undefined} **children** Permet de récupérer le wrapper à partir d'un enfant
* @return *{object}*

#### getWrapperInput()

Retourne le wrapper générique de l'élément <input> (.customform-input)

* @return *{object}*

#### getInputsRadio()

Retourne tous les <inputs> de type radio

* @return *{object}*