## Sélects

Ce support permet de personnaliser les sélects classiques et multiples.


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


### Méthodes
                                                                                                                      
todo