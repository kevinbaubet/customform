# Documentation CustomForm

Ce script permet de personnaliser les éléments d'un formulaire. Éléments supportés : checkbox, radio, select et file (il est possible d'ajouter d'autres éléments).

* Compatibilité : IE10+
* Dépendance : jQuery

## Initialisation

    var CustomForm = $('context').customForm([options]);

## Options

| Option                           | Type     | Valeur par défaut | Description                                               |
|----------------------------------|----------|-------------------|-----------------------------------------------------------|
| classes                          | object   | Voir ci-dessous   | Objet pour les options ci-dessous                         |
| &nbsp;&nbsp;&nbsp;&nbsp;prefix   | string   | 'customform'      | Préfix de classe                                          |
| &nbsp;&nbsp;&nbsp;&nbsp;input    | string   | '{prefix}-input'  | Classe autour de l'input                                  |
| &nbsp;&nbsp;&nbsp;&nbsp;disabled | string   | 'is-disabled'     | Classe quand l'input est désactivé                        |
| tabindexStart                    | integer  | 0                 | Valeur de l'attribut tabindex au chargement de CustomForm |
| onSupportLoad                    | function | undefined         | Callback au début du chargement du support                |
| onSupportComplete                | function | undefined         | Callback à la fin du chargement du support                |

## Méthodes

| Méthode             | Arguments                                                                                                       | Description                                                        |
|---------------------|-----------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| setOptions          | **support** *string* Nom du support, **options** *object* Options utilisateur à passer au support               | Enregistre les options pour un support                             |
| setSupports         | -                                                                                                               | Définition de tous les supports présent dans $.CustomForm.supports |
| setSupport          | **support** *string* Nom du support, **[options]** *object* Options utilisateur à passer au support             | Définition d'un support                                            |
| getSupportClassName | **support** *string* Nom du support                                                                             | Récupère le nom de la classe JS correspondant à l'argument         |
| getInstance         | **instances** *object* Retour de setSupport() ou liste des instances, **input** *jQuery object* Élément input   | Récupère l'instance via l'élément input                            |
| getInstanceName     | **input** *jQuery object* Élément input                                                                         | Récupère le nom formaté d'une instance via l'élément input         |


## Supports

Un *support* correspond à un type d'input à personnaliser (checkbox, radio, select, etc). Chaque support est une classe JS à part.

### Initialiser un support

Une fois CustomForm initialisé :

    CustomForm.setSupport('name', [options]);

Lors de l'initialisation d'un support, CustomForm va éxecuter une classe JS qui correspondra à **$.CustomFormName**. "Name" étant le nom du support.

### Instances

La classe JS est instanciée pour chaque sélecteur du support dans le contexte. Pour faire des manipulations sur les supports, il faut récupérer les instances :

    var CustomFormSelects = CustomForm.setSupport('name', [options]);

Il est possible ensuite de manipuler l'instance en fonction de l'attribut **name** du sélecteur ou via la méthode **getInstance**.

    var instance = CustomForm.getInstance(CustomFormSelects, $('#input'));


---
---


## Checkboxs & Radios

Ce support est spécial car il regroupe 2 supports : checkbox et radio. Pour ces 2 supports, c'est la classe JS $.CustomFormCheck qui est initialisée.

### Initialisation

    CustomForm.setSupport('checkbox', [options]);
    CustomForm.setSupport('radio', [options]);

### Options

| Option                          | Type     | Valeur par défaut | Description                                     |
|---------------------------------|----------|-------------------|-------------------------------------------------|
| classes                         | object   | Voir ci-dessous   | Objet pour les options ci-dessous               |
| &nbsp;&nbsp;&nbsp;&nbsp;checked | string   | 'is-checked'      | Classe quand l'input est coché                  |
| onLoad                          | function | undefined         | Callback au début du chargement                 |
| beforeWrap                      | function | undefined         | Callback avant l'ajout des wrappers dans le DOM |
| afterEventsHandler              | function | undefined         | Callback après la déclaration des événements    |
| onComplete                      | function | undefined         | Callback à la fin du chargement                 |
| onClick                         | function | undefined         | Callback au click sur l'input                   |
| onReset                         | function | undefined         | Callback au reset du formulaire                 |

### Méthodes

| Méthode           | Arguments                                                | Description                                                                 |
|-------------------|----------------------------------------------------------|-----------------------------------------------------------------------------|
| initElementsState | -                                                        | Initialise l'état des éléments                                              |
| getContext        | -                                                        | Récupère l'élément de contexte                                              |
| getInput          | -                                                        | Récupère l'élément input                                                    |
| getInputType      | -                                                        | Récupère le type de l'élément input (radio, checkbox)                       |
| getWrapper        | **[children]** *jQuery object* Élément enfant du wrapper | Récupère l'élément wrapper créé par CustomForm                              |
| getInputsRadio    | -                                                        | Récupère tous les éléments radios du contexte ayant le même attribut "name" |
| setOption         | -                                                        | Sélectionne une option                                                      |
| removeOption      | -                                                        | Enlève la sélection de l'option                                             |
| disableOption     | -                                                        | Désactive une option                                                        |



---
---


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
| onLoad                                   | function | undefined                         | Callback au début du chargement                                  |
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
| setOption          | **option** *jQuery object* Option à sélectionner                                                                           | Sélectionne une option unique                                                    |
| setOptions         | **option** *jQuery object* Option à sélectionner                                                                           | Sélectionne une option multiple                                                  |
| removeOptions      | **options** *string/jQuery object* Sélecteur ou liste des options, **disable** *boolean* Désactiver l'option en même temps | Enlève la sélection des options définies                                         |
| disableOption      | **option** *jQuery object* Option à désactiver                                                                             | Désactive une option                                                             |
| close              | -                                                                                                                          | Ferme l'affichage des options                                                    |
| closeSiblings      | -                                                                                                                          | Ferme l'affichage des options des autres sélects du contexte                     |


---
---


## File

Ce support permet de personnaliser les input de type file.

### Initialisation

    CustomForm.setSupport('file', [options]);

### Options

| Option                        | Type     | Valeur par défaut               | Description                                               |
|-------------------------------|----------|---------------------------------|-----------------------------------------------------------|
| labelText                     | string   | 'Parcourir...'                  | Texte du bouton "parcourir"                               |
| emptyText                     | string   | 'Aucun fichier sélectionné.'    | Texte quand aucun fichier n'est sélectionné               |
| multipleText                  | string   | '{count} fichiers sélectionnés' | Texte quand plusieurs fichiers sont sélectionnés          |
| classes                       | object   | Voir ci-dessous                 | Objet pour les options ci-dessous                         |
| &nbsp;&nbsp;&nbsp;&nbsp;label | string   | '{prefix}-label'                | Classe pour le bouton "Parcourir..."                      |
| &nbsp;&nbsp;&nbsp;&nbsp;file  | string   | '{prefix}-file'                 | Classe pour le nom du fichier sélectionné                 |
| &nbsp;&nbsp;&nbsp;&nbsp;open  | string   | 'is-open'                       | Classe quand la fenêtre de choix des fichiers est ouverte |
| onLoad                        | function | undefined                       | Callback au début du chargement                           |
| beforeWrap                    | function | undefined                       | Callback avant l'ajout des wrappers dans le DOM           |
| afterEventsHandler            | function | undefined                       | Callback après la déclaration des événements              |
| onComplete                    | function | undefined                       | Callback à la fin du chargement                           |
| onClick                       | function | undefined                       | Callback au click sur le label pour choisir un fichier    |
| onChange                      | function | undefined                       | Callback au choix du fichier                              |
| onReset                       | function | undefined                       | Callback au reset du formulaire                           |

### Méthodes

| Méthode             | Arguments                                                | Description                                              |
|---------------------|----------------------------------------------------------|----------------------------------------------------------|
| initElementsState   | -                                                        | Initialise l'état des éléments                           |
| getContext          | -                                                        | Récupère l'élément de contexte                           |
| getInput            | -                                                        | Récupère l'élément input                                 |
| getInputType        | -                                                        | Récupère le type de l'élément input                      |
| getWrapper          | **[children]** *jQuery object* Élément enfant du wrapper | Récupère l'élément wrapper créé par CustomForm           |
| getWrapperLabel     | -                                                        | Récupère l'élément wrapper du bouton                     |
| getWrapperFile      | -                                                        | Récupère l'élément wrapper du nom du fichier sélectionné |
| setWrapperFileValue | **input** *object* Input type file                       | Met à jour la valeur du fichier sélectionné              |


---
---


## Autre support ?

Il est possible d'ajouter autant de support que vous voulez.

Il faut d'abord ajouter un sélecteur à la liste des supports :

    $.CustomForm.supports.name = 'input[type="name"]';

Puis créer la classe JS associée :

    $.CustomFormName(CustomForm, options) {
        // A l'initialisation de la classe, on éxecute la méthode load()
        this.load();
    };
    
    $.CustomFormName.prototype = {
        /**
         * Initialisation
         */
        load: function() {

        }
    };


---
---


## Labels

CustomFormLabel n'est pas un support mais une classe à part entière. Ce script permet d'ajouter un état au focus sur les éléments d'un formulaire.

### Initialisation

    $('context').customFormLabel([options], [support]);


### Options

| Option                          | Type     | Valeur par défaut  | Description                                                    |
|---------------------------------|----------|--------------------|----------------------------------------------------------------|
| wrapper                         | string   | '.form-item'       | Sélecteur parent (pas forcément direct) des éléments supportés |
| classes                         | object   | Voir ci-dessous    | Objet pour les options ci-dessous                              |
| &nbsp;&nbsp;&nbsp;&nbsp;label   | string   | 'customform-label' | Classe appliquée sur le wrapper                                |
| &nbsp;&nbsp;&nbsp;&nbsp;focused | string   | 'is-focused'       | Classe d'état quand l'élément est actif                        |
| &nbsp;&nbsp;&nbsp;&nbsp;filled  | object   | 'is-filled'        | Classe d'état quand l'élément est rempli                       |
| onLoad                          | function | undefined          | Callback au début du chargement                                |
| afterEventsHandler              | function | undefined          | Callback après la déclaration des événements                   |
| onComplete                      | function | undefined          | Callback à la fin du chargement                                |
| onFocus                         | function | undefined          | Callback au focus d'un élément                                 |
| onBlur                          | function | undefined          | Callback au blur d'un élément                                  |

### Supports

Il est possible d'ajouter des supports à la liste par défaut :

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

### Méthodes

| Méthode           | Arguments                               | Description                                                                               |
|-------------------|-----------------------------------------|-------------------------------------------------------------------------------------------|
| initElementsState | -                                       | Initialise l'état des éléments                                                            |
| getContext        | -                                       | Récupère l'élément de contexte                                                            |
| getWrapper        | **input** *jQuery object* Élément input | Récupère l'élément wrapper                                                                |
| getInputs         | -                                       | Récupère tous les éléments présent dans $.CustomFormLabel.support par rapport au contexte |