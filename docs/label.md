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
| beforeLoad                      | function | undefined          | Callback au début du chargement                                |
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