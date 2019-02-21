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
| beforeLoad                      | function | undefined         | Callback au début du chargement                 |
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