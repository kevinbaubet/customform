## Sélects

Ce support permet de personnaliser les sélects classiques et multiples.

Nom du support : **select**
Nom du fichier : **customform-select.js**
Nom de la classe : **$.CustomFormSelect**


### Initialisation

    var customForm = $('form').customForm([options]);

    customForm.setSupport('select', [options]);


### Options

| Option                                   | Type     | Valeur par défaut                 | Description                                                      |
|------------------------------------------|----------|-----------------------------------|------------------------------------------------------------------|
| classes                                  | object   | Voir ci-dessous                   | Objet pour les options ci-dessous                                |
| &nbsp;&nbsp;&nbsp;&nbsp;label            | string   | '{prefix}-selectLabel'            | Classe pour le nom de l'option sélectionné                       |
| &nbsp;&nbsp;&nbsp;&nbsp;options          | string   | '{prefix}-selectOptions'          | Classe autour des options                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;option           | string   | '{prefix}-selectOption'           | Classe autour d'une option                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;optionGroup      | string   | '{prefix}-selectOptionGroup'      | Classe autour d'un groupoption                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;optionGroupLabel | string   | '{prefix}-selectOptionGroupLabel' | Classe autour du nom du groupoption                              |
| &nbsp;&nbsp;&nbsp;&nbsp;first            | string   | 'is-first'                        | Classe pour la 1ère option                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;selected         | string   | 'is-selected'                     | Classe quand une option est sélectionnée                         |
| &nbsp;&nbsp;&nbsp;&nbsp;multiple         | string   | 'is-multiple'                     | Classe si le select est de type multiple                         |
| &nbsp;&nbsp;&nbsp;&nbsp;open             | string   | 'is-open'                         | Classe quand la liste des options est ouverte                    |
| multipleOptionsSeparator                 | string   | ', '                              | Séparateur entre les options affichées dans le label             |
| beforeLoad                               | function | undefined                         | Callback au début du chargement                                  |
| beforeWrap                               | function | undefined                         | Callback avant l'ajout des wrappers dans le DOM                  |
| afterEventsHandler                       | function | undefined                         | Callback après la déclaration des événements                     |
| onComplete                               | function | undefined                         | Callback à la fin du chargement                                  |
| onClick                                  | function | undefined                         | Callback au click sur le select pour ouvrir la liste des options |
| onChange                                 | function | undefined                         | Callback au changement d'option                                  |
| onReset                                  | function | undefined                         | Callback au reset du formulaire                                  |


### API

#### Callback vs Instance

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
                var option = select.loadOption(event.currentTarget);

                option.disable();
            });
        }

#### reset()

Initialise l'état des éléments par défaut

#### close()

Fermeture des options

#### closeSiblings()

Fermeture des autres selects

#### setLabel()

Modifie le label du select custom

* @param *{string|object[]}* **name**
* @param *{string|object[]=undefined}* **value**

#### loadOption()

Gestion d'une option

* @param *{object|string}* **option**

        var option = customFormSelect.loadOption(option);
        
        option.select();

##### select()

Sélectionne une option

* @param *{object=undefined}* **settings** Paramètres optionnels

##### remove()

Enlève l'option si elle est sélectionnée

##### disable()

Désactive une option

##### isSelected()

Détermine si l'option est sélectionnée

##### isFirst()

Détermine si l'option est la première

##### isLast()

Détermine si l'option est la dernière

##### isDisabled()

Détermine si l'option est désactivée

##### getName()

Retourne le nom de l'option au format HTML

##### getValue()

Retourne la valeur de l'option

#### removeOptions()

Enlève la sélection des options définies

* @param *{string|object=undefined}* **options** Sélecteur ou liste des options
* @param *{boolean=undefined}*       **disable** Désactive l'option en même temps

#### isMultiple()

Détermine si le select est multiple

* @return *{boolean}*

#### getSiblings()

Retourne tous les autres selects du contexte actuel

* @return *{object}*

#### getElements()

Retourne tous les éléments de customform

* @return *{object}*

#### getContext()

Retourne le contexte de customform (form)

* @return *{object}*

#### getInput()

Retourne l'élément select

* @return *{object}*

#### getInputType()

Retourne le type de l'élément

* @return *{string}*

#### getWrapper()

Retourne le wrapper générique global (.customform)

* @param {object=undefined} **children** Permet de récupérer le wrapper à partir d'un enfant
* @return *{object}*

#### getWrapperInput()

Retourne le wrapper générique de l'élément select (.customform-input)

* @return *{object}*

#### getWrapperLabel()

Retourne le wrapper du label (.customform-selectLabel)

* @return *{object}*

#### getWrapperOptions()

Retourne le wrapper des options (.customform-selectOptions)

* @return *{object}*

#### getOptions()

Retourne toutes les options ou en partie

* @param *{object}* **filter** Sélecteur de filtre pour les options à retourner
* @return *{object}*

#### getSourceOptions()

Retourne les options sur le select initial

* @return *{object}*

#### getSourceOptgroups()

Retourne les optgroups sur le select initial

* @return *{object}*

#### getCurrentValue()

Retourne la valeur courante

* @return *{string|object}*

#### getDefaultValue()

Retourne la valeur par défaut

* @return *{string|object}*