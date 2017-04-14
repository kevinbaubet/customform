# Documentation CustomForm

Ce script permet de personnaliser les éléments d'un formulaire. Éléments supportés : checkbox, radio, select et file (il est possible d'ajouter d'autres éléments).

* Compatibilité : IE10+
* Dépendance : jQuery

## Initialisation

    var CustomForm = $('context').customForm([options]);

## Options

| Option                                                   | Type     | Valeur par défaut | Description                                               |
|----------------------------------------------------------|----------|-------------------|-----------------------------------------------------------|
| classes                                                  | object   | Voir ci-dessous   | Objet pour les options ci-dessous                         |
| &nbsp;&nbsp;&nbsp;&nbsp;prefix                           | string   | 'customform'      | Préfix de classe                                          |
| &nbsp;&nbsp;&nbsp;&nbsp;input                            | string   | '{prefix}-input'  | Classe autour de l'input                                  |
| &nbsp;&nbsp;&nbsp;&nbsp;states                           | object   | Voir ci-dessous   | Objet pour les options ci-dessous                         |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disabled | string   | 'is-disabled'     | Classe quand l'input est désactivé                        |
| tabindexStart                                            | integer  | 0                 | Valeur de l'attribut tabindex au chargement de CustomForm |
| onSupportLoad                                            | function | undefined         | Callback au début du chargement du support                |
| onSupportComplete                                        | function | undefined         | Callback à la fin du chargement du support                |

## Méthodes

| Méthode             | Arguments                                                                                          | Description                                                        |
|---------------------|----------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| setSupport          | **support** *string* Nom du support, **[options]** *object* Options utilisateur à passer au support | Définition d'un support                                            |
| setSupports         | -                                                                                                  | Définition de tous les supports présent dans $.CustomForm.supports |
| setOptions          | **support** *string* Nom du support, **options** *object* Options utilisateur à passer au support   | Enregistre les options pour un support                             |
| getSupportClassName | **support** *string* Nom du support                                                                | Récupère le nom de la classe JS correspondant à l'argument         |

## Supports

Un *support* correspond à un type d'input à personnaliser (checkbox, radio, select, etc). Chaque support est une classe JS à part.

### Initialiser un support

Une fois CustomForm initialisé :

    CustomForm.setSupport('name', [options]);

Lors de l'initialisation d'un support, CustomForm va éxecuter une classe JS qui correspondra à **$.CustomFormName**. "Name" étant le nom du support.

#### Instances

La classe JS est instanciée pour chaque sélecteur du support dans le contexte. Pour faire des manipulations sur les supports, il faut récupérer les instances :

    var instances = CustomForm.setSupport('name', [options]);

Il est possible ensuite de manipuler l'instance en fonction de l'attribut **name** du sélecteur.


### Checkboxs & Radios

Ce support est spécial car il regroupe 2 supports : checkbox et radio. Pour ces 2 supports, c'est la classe JS $.CustomFormCheck qui est initialisée.

#### Initialisation

    CustomForm.setSupport('checkbox', [options]);
    CustomForm.setSupport('radio', [options]);

#### Options

| Option                                                  | Type     | Valeur par défaut | Description                                     |
|---------------------------------------------------------|----------|-------------------|-------------------------------------------------|
| classes                                                 | object   | Voir ci-dessous   | Objet pour les options ci-dessous               |
| &nbsp;&nbsp;&nbsp;&nbsp;states                          | object   | Voir ci-dessous   | Objet pour l'option ci-dessous                  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;checked | string   | 'is-checked'      | Classe quand l'input est coché                  |
| onLoad                                                  | function | undefined         | Callback au début du chargement                 |
| beforeWrap                                              | function | undefined         | Callback avant l'ajout des wrappers dans le DOM |
| afterEventsHandler                                      | function | undefined         | Callback après la déclaration des événements    |
| onComplete                                              | function | undefined         | Callback à la fin du chargement                 |
| onClick                                                 | function | undefined         | Callback au click sur l'input                   |
| onReset                                                 | function | undefined         | Callback au reset du formulaire                 |

### Sélects

Ce support permet de personnaliser les selects, multiple ou non.

#### Initialisation

    CustomForm.setSupport('select', [options]);

#### Options

| Option                                                           | Type     | Valeur par défaut                 | Description                                                      |
|------------------------------------------------------------------|----------|-----------------------------------|------------------------------------------------------------------|
| classes                                                          | object   | Voir ci-dessous                   | Objet pour les options ci-dessous                                |
| &nbsp;&nbsp;&nbsp;&nbsp;select                                   | object   | Voir ci-dessous                   | Objet pour les options ci-dessous                                |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;label            | string   | '{prefix}-selectLabel'            | Classe pour le nom de l'option sélectionné                       |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;options          | string   | '{prefix}-selectOptions'          | Classe autour des options                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;option           | string   | '{prefix}-selectOption'           | Classe autour d'une option                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;optionGroup      | string   | '{prefix}-selectOptionGroup'      | Classe autour d'un groupoption                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;optionGroupLabel | string   | '{prefix}-selectOptionGroupLabel' | Classe autour du nom du groupoption                              |
| &nbsp;&nbsp;&nbsp;&nbsp;states                                   | object   | Voir ci-dessous                   | Objet pour les options ci-dessous                                |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first            | string   | 'is-first'                        | Classe quand l'input est coché                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;selected         | string   | 'is-selected'                     | Classe quand une option est sélectionnée                         |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;multiple         | string   | 'is-multiple'                     | Classe si le select est de type multiple                         |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;open             | string   | 'is-open'                         | Classe quand la liste des options est ouverte                    |
| onLoad                                                           | function | undefined                         | Callback au début du chargement                                  |
| beforeWrap                                                       | function | undefined                         | Callback avant l'ajout des wrappers dans le DOM                  |
| afterEventsHandler                                               | function | undefined                         | Callback après la déclaration des événements                     |
| onComplete                                                       | function | undefined                         | Callback à la fin du chargement                                  |
| onClick                                                          | function | undefined                         | Callback au click sur le select pour ouvrir la liste des options |
| onChange                                                         | function | undefined                         | Callback au changement d'option                                  |
| onReset                                                          | function | undefined                         | Callback au reset du formulaire                                  |

### File

Ce support permet de personnaliser les input de type file.

#### Initialisation

    CustomForm.setSupport('file', [options]);

#### Options

| Option                                               | Type     | Valeur par défaut | Description                                               |
|------------------------------------------------------|----------|-------------------|-----------------------------------------------------------|
| classes                                              | object   | Voir ci-dessous   | Objet pour les options ci-dessous                         |
| &nbsp;&nbsp;&nbsp;&nbsp;label                        | string   | '{prefix}-label'  | Classe pour le bouton "Parcourir..."                      |
| &nbsp;&nbsp;&nbsp;&nbsp;file                         | string   | '{prefix}-file'   | Classe pour le nom du fichier sélectionné                 |
| &nbsp;&nbsp;&nbsp;&nbsp;states                       | object   | Voir ci-dessous   | Objet pour l'option ci-dessous                            |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;open | string   | 'is-open'         | Classe quand la fenêtre de choix des fichiers est ouverte |
| onLoad                                               | function | undefined         | Callback au début du chargement                           |
| beforeWrap                                           | function | undefined         | Callback avant l'ajout des wrappers dans le DOM           |
| afterEventsHandler                                   | function | undefined         | Callback après la déclaration des événements              |
| onComplete                                           | function | undefined         | Callback à la fin du chargement                           |
| onClick                                              | function | undefined         | Callback au click sur le label pour choisir un fichier    |
| onChange                                             | function | undefined         | Callback au choix du fichier                              |
| onReset                                              | function | undefined         | Callback au reset du formulaire                           |

### Autre ?

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
         * Initilisation
         */
        load: function() {

        }
    };