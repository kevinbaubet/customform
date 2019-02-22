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


### Méthodes