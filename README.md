# Documentation CustomForm

Ce script permet de personnaliser les éléments d'un formulaire. Éléments supportés : checkbox, radio, select et file (il est possible d'ajouter d'autres éléments).

* Compatibilité : IE10+
* Dépendance : jQuery

## Initialisation

    var customForm = $('context').customForm([options]);

## Options

| Option                           | Type     | Valeur par défaut | Description                                               |
|----------------------------------|----------|-------------------|-----------------------------------------------------------|
| classes                          | object   | Voir ci-dessous   | Objet pour les options ci-dessous                         |
| &nbsp;&nbsp;&nbsp;&nbsp;prefix   | string   | 'customform'      | Préfix de classe                                          |
| &nbsp;&nbsp;&nbsp;&nbsp;input    | string   | '{prefix}-input'  | Classe autour de l'input                                  |
| &nbsp;&nbsp;&nbsp;&nbsp;disabled | string   | 'is-disabled'     | Classe quand l'input est désactivé                        |
| tabindexStart                    | integer  | 0                 | Valeur de l'attribut tabindex au chargement de CustomForm |
| supportBeforeLoad                | function | undefined         | Callback au début du chargement du support                |
| supportComplete                  | function | undefined         | Callback à la fin du chargement du support                |

## Méthodes

| Méthode             | Arguments                                                                                                       | Description                                                                               |
|---------------------|-----------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| setOptions          | **support** *string* Nom du support, **options** *object* Options utilisateur à passer au support               | Enregistre les options pour un support                                                    |
| setSupports         | **types** *array* Liste des types de support à exécuter (optionnel)                                             | Définition de tous les supports présent dans $.CustomForm.supports ou passés en paramètre |
| setSupport          | **support** *string* Nom du support, **[options]** *object* Options utilisateur à passer au support             | Définition d'un support                                                                   |
| getSupportClassName | **support** *string* Nom du support                                                                             | Récupère le nom de la classe JS correspondant à l'argument                                |
| getInstance         | **instances** *object* Retour de setSupport() ou liste des instances, **input** *jQuery object* Élément input   | Récupère l'instance via l'élément input                                                   |
| getInstanceName     | **input** *jQuery object* Élément input                                                                         | Récupère le nom formaté d'une instance via l'élément input                                |


## Supports

Un *support* correspond à un type d'input à personnaliser (checkbox, radio, select, etc). Chaque support est une classe JS à part.

### Initialiser un support

Une fois CustomForm initialisé :

    customForm.setSupport('name', [options]);

Lors de l'initialisation d'un support, CustomForm va éxecuter une classe JS qui correspondra à **$.CustomFormName**. "Name" étant le nom du support.

### Instances

La classe JS est instanciée pour chaque sélecteur du support dans le contexte. Pour faire des manipulations sur les supports, il faut récupérer les instances :

    var selects = customForm.setSupport('name', [options]);

Il est possible ensuite de manipuler l'instance en fonction de l'attribut **name** du sélecteur ou via la méthode **getInstance**.

    var instance = customForm.getInstance(selects, $('#input'));


## Supports présents dans CustomForm

* [Checkboxs & Radios](docs/check.md)
* [Sélects](docs/select.md)
* [File](docs/file.md)


## Autre support ?

Il est possible d'ajouter autant de support que vous voulez.

Il faut d'abord ajouter un sélecteur à la liste des supports :

    $.CustomForm.supports.name = 'input[type="name"]';
    
    ou
    
    $('form').customForm([options], {
        name: 'input[type="name"]'
    });
    

Puis créer la classe JS associée :

    $.CustomFormName(customForm, options) {
        this.init();
    };
    
    $.CustomFormName.prototype = {
        /**
         * Initialisation
         */
        init: function() {
            console.log('in the support "name"');
        }
    };