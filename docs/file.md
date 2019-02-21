## File

Ce support permet de personnaliser les input de type file.

### Initialisation

    CustomForm.setSupport('file', [options]);

### Options

| Option                        | Type     | Valeur par défaut               | Description                                               |
|-------------------------------|----------|---------------------------------|-----------------------------------------------------------|
| labelText                     | string   | 'Browse...'                     | Texte du bouton "parcourir"                               |
| emptyText                     | string   | 'No file selected.'             | Texte quand aucun fichier n'est sélectionné               |
| multipleText                  | string   | '{count} files selected.'       | Texte quand plusieurs fichiers sont sélectionnés          |
| classes                       | object   | Voir ci-dessous                 | Objet pour les options ci-dessous                         |
| &nbsp;&nbsp;&nbsp;&nbsp;label | string   | '{prefix}-label'                | Classe pour le bouton "Parcourir..."                      |
| &nbsp;&nbsp;&nbsp;&nbsp;file  | string   | '{prefix}-file'                 | Classe pour le nom du fichier sélectionné                 |
| &nbsp;&nbsp;&nbsp;&nbsp;open  | string   | 'is-open'                       | Classe quand la fenêtre de choix des fichiers est ouverte |
| beforeLoad                    | function | undefined                       | Callback au début du chargement                           |
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