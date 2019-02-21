## Sélects

Ce support permet de personnaliser les selects, multiple ou non.

### Initialisation

    CustomForm.setSupport('select', [options]);

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

| Méthode            | Arguments                                                                                                                  | Description                                                                      |
|--------------------|----------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| initElementsState  | -                                                                                                                          | Défini l'état des éléments à l'initialisation                                    |
| getContext         | -                                                                                                                          | Récupère l'élément de contexte                                                   |
| getInput           | -                                                                                                                          | Récupère l'élément input                                                         |
| getWrapper         | **[children]** *jQuery object* Élément enfant du wrapper                                                                   | Récupère l'élément wrapper créé par CustomForm                                   |
| getWrapperInput    | -                                                                                                                          | Récupère l'élément wrapper de l'input select                                     |
| getWrapperLabel    | -                                                                                                                          | Récupère l'élément wrapper du label, correspond à l'option actuellement affichée |
| getWrapperOptions  | -                                                                                                                          | Récupère l'élément wrapper de toutes les options                                 |
| getOptions         | **[filter]** *string* Sélecteur pour filtrer le résultat                                                                   | Récupère toutes les options créées par CustomForm                                |
| getSourceOptions   | -                                                                                                                          | Récupère tous les options du select d'origine                                    |
| getSourceOptgroups | -                                                                                                                          | Récupère tous les groupes d'options du select d'origine                          |
| getValue           | -                                                                                                                          | Récupère la valeur actuellement sélectionnée                                     |
| getDefaultValue    | -                                                                                                                          | Récupère la valeur sélectionnée par défaut                                       |
| getOptionValue     | **option** *jQuery object* Option pour en récupérer sa valeur                                                              | Récupère la valeur d'une option                                                  |
| setLabel           | **value** *mixed* Titre du select custom                                                                                   | Modifie le label du select custom                                                |
| setOption          | **option** *jQuery object* Option à sélectionner                                                                           | Sélectionne une option                                                           |
| removeOptions      | **options** *string/jQuery object* Sélecteur ou liste des options, **disable** *boolean* Désactiver l'option en même temps | Enlève la sélection des options définies                                         |
| disableOption      | **option** *jQuery object* Option à désactiver                                                                             | Désactive une option                                                             |
| close              | -                                                                                                                          | Ferme l'affichage des options                                                    |
| closeSiblings      | -                                                                                                                          | Ferme l'affichage des options des autres sélects du contexte                     |