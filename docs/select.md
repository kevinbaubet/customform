# Sélects

Ce support permet de personnaliser les sélects classiques et multiples.

* Nom du support : **select**
* Nom du fichier : **customform-select.js**
* Nom de la classe : **$.CustomFormSelect**


## Initialisation

    var customForm = $('form').customForm([options]);

    customForm.setSupport('select', [options]);


## Options

| Option                                   | Type     | Valeur par défaut                    | Description                                                      |
|------------------------------------------|----------|--------------------------------------|------------------------------------------------------------------|
| classes                                  | object   | Voir ci-dessous                      | Objet pour les options ci-dessous                                |
| &nbsp;&nbsp;&nbsp;&nbsp;label            | string   | '{prefix}-select-label'              | Classe pour le wrapper de l'option sélectionné                   |
| &nbsp;&nbsp;&nbsp;&nbsp;toggle           | string   | '{prefix}-select-toggle'             | Classe pour le nom de l'option sélectionné                       |
| &nbsp;&nbsp;&nbsp;&nbsp;content          | string   | '{prefix}-select-content'            | Classe pour le wrapper du contenu déroulant                      |
| &nbsp;&nbsp;&nbsp;&nbsp;options          | string   | '{prefix}-select-options'            | Classe autour des options                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;option           | string   | '{prefix}-select-option'             | Classe autour d'une option                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;optionGroup      | string   | '{prefix}-select-option-group'       | Classe autour d'un groupoption                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;optionGroupLabel | string   | '{prefix}-select-option-group-label' | Classe autour du nom du groupoption                              |
| &nbsp;&nbsp;&nbsp;&nbsp;first            | string   | 'is-first'                           | Classe pour la 1ère option                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;selected         | string   | 'is-selected'                        | Classe quand une option est sélectionnée                         |
| &nbsp;&nbsp;&nbsp;&nbsp;focused          | string   | 'is-focused'                         | Classe quand une option est pre-sélectionnée en mode multiple    |
| &nbsp;&nbsp;&nbsp;&nbsp;multiple         | string   | 'is-multiple'                        | Classe si le select est de type multiple                         |
| &nbsp;&nbsp;&nbsp;&nbsp;open             | string   | 'is-open'                            | Classe quand la liste des options est ouverte                    |
| multipleOptionsSeparator                 | string   | ', '                                 | Séparateur entre les options affichées dans le label             |
| beforeLoad                               | function | undefined                            | Callback au début du chargement                                  |
| beforeWrap                               | function | undefined                            | Callback avant l'ajout des wrappers dans le DOM                  |
| afterEventsHandler                       | function | undefined                            | Callback après la déclaration des événements                     |
| onComplete                               | function | undefined                            | Callback à la fin du chargement                                  |
| onClick                                  | function | undefined                            | Callback au click sur le select pour ouvrir la liste des options |
| onChange                                 | function | undefined                            | Callback au changement d'option                                  |
| onReset                                  | function | undefined                            | Callback au reset du formulaire                                  |


## API

[Hérite de l'API des supports CustomForm.](../README.md#api-supports)

### Callback vs Instance

Pour utiliser l'API, il y a 2 solutions :

* **Callback** : Utiliser les options de type "function" ci-dessus. Cela va fonctionner pour tous les selects présents dans le *form*.

        var customForm = $('form').customForm();
        
        customForm.setSupport('select', {
            onChange: function () {
                this.option.disable();
            }
        });
    
* **Instance** : Utiliser une instance précise.

        var customForm = $('form').customForm();
        var selects = customForm.setSupport('select');
        var select = customForm.getInstance(selects, $('#select1-1'));
        
        if (select instanceof $.CustomFormSelect) {
            select.getOptions().on('click', function (event) {
                select.onReady(function () {
                    var option = select.loadOption(event.currentTarget);
    
                    option.disable();
                });
            });
        }
        
Pour les exemples ci-dessous, **customFormSelect** sera equivalent à l'instance d'un select initialisé avec CustomForm.

### reset()

Initialise l'état des éléments par défaut

### close()

Fermeture des options

### closeSiblings()

Fermeture des autres selects

### setLabel()

Modifie le label du select custom

* @param *{string|object[]}* **name**

        // Change current label
        customFormSelect.setLabel('2 selected options');
        
        // Multiple names
        var names = ['Option 1, 'Option 2'];
        customFormSelect.setLabel(names);

### isMultiple()

Détermine si le select est multiple

* @return *{boolean}*

### isOpen()

Détermine si le select est ouvert

* @return *{boolean}*

### getSiblings()

Retourne tous les autres selects du contexte actuel

* @return *{object}*

### getWrapperLabel()

Retourne le wrapper du label

* @return *{object}*

### getToggleBtn()

Retourne le bouton toggle

* @return *{object}*

### getDefaultInput()

Retourne l'input contenant la valeur par défaut

* @return *{object}*

### getCurrentValue()

Retourne la valeur courante

* @return *{string|object}*

### getDefaultValue()

Retourne la valeur par défaut

* @return *{string|object}*

### getWrapperOptions()

Retourne le wrapper des options (.customform-selectOptions)

* @return *{object}*

### getOptions()

Retourne toutes les options ou en partie

* @param *{object=undefined}* **filter** Sélecteur de filtre pour les options à retourner
* @return *{object}*

        var all = customFormSelect.getOptions();
        var first = customFormSelect.getOptions('.is-first');
        var selected = customFormSelect.getOptions('.is-selected');

### selectOptions()

Sélectionne les options définies

* @param *{string|object=undefined}* **options** Sélecteur ou liste des options

        customFormSelect.selectOptions(options);
        // or
        customFormSelect.selectOptions(':not(.is-disabled)');

### unselectOptions()

Enlève la sélection des options définies

* @param *{string|object=undefined}* **options** Sélecteur ou liste des options

        // Remove selection on current disabled options
        var options = customFormSelect.getOptions('.is-disabled');
        
        customFormSelect.unselectOptions(options);
        // or
        customFormSelect.unselectOptions('.is-disabled');
        
* @param *{boolean=undefined}*       **disable** Désactive l'option en même temps
        
        // Remove selection + disable option  
        var option = customFormSelect.getOptions('.is-first');
       
        customFormSelect.unselectOptions(option, true);
        // or
        customFormSelect.unselectOptions('.is-first', true);

### getOptionFromValue()

Retourne une option à partir de sa valeur

* @param *{string|number}* **value**

* @return *{object}*

### getSourceOptions()

Retourne les options sur le select initial

* @return *{object}*

### getSourceOptgroups()

Retourne les optgroups sur le select initial

* @return *{object}*

### loadOption()

Gestion d'une option

* @param *{object|string}* **option**

        var option = customFormSelect.loadOption(option); // js object
        var option = customFormSelect.loadOption($('option')); // jQuery object
        var option = customFormSelect.loadOption('.is-first'); // jQuery selector
        
        option.select();
        option.disable();


#### Méthodes d'une option

#### getOption()

Retourne l'argument option

* @return *{object}*

#### getInput()

Retourne l'input de l'option

* @return *{object}*

#### getLabel()

Retourne le label de l'option

* @return *{object}*

#### select()

Sélectionne une option

* @param *{object=undefined}* **settings** Paramètres optionnels

        // Select current option
        option.select();
        
        // Select previous option
        option.select({
            context: 'auto-move',
            direction: 'up'
        });
        
        // Select with custom context
        option.select({
            context: 'my-custom-context'
        });

#### unselect()

Enlève la sélection de l'option

#### focus()

Presélectionne une option pour le mode multiple

* @param *{object=undefined}* **settings** Paramètres optionnels

#### disable()

Désactive une option

#### isSelected()

Détermine si l'option est sélectionnée

* @return *{boolean}*

#### isFirst()

Détermine si l'option est la première

* @return *{boolean}*

#### isLast()

Détermine si l'option est la dernière

* @return *{boolean}*

#### isDisabled()

Détermine si l'option est désactivée

* @return *{boolean}*

#### getName()

Retourne le nom de l'option au format HTML

* @return *{string}*

#### setName()

Défini le nom de l'option

* @param *{string|html}* **name**

#### getValue()

Retourne la valeur de l'option

* @return *{null|string}*

#### setValue()

Défini la valeur de l'option

* @param *{string|number}* **value**