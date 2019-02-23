## File

Ce support permet de personnaliser les inputs de type file.

Nom du support : **file**


### Initialisation

    var customForm = $('form').customForm([options]);

    customForm.setSupport('file', [options]);


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


### API

#### Callback vs Instance

Pour utiliser l'api, il y a 2 solutions :

* **Callback** : Utiliser les options de type "function" ci-dessus. Cela va fonctionner pour tous les inputs présents dans le *form*.

        var customForm = $('form').customForm();
        
        customForm.setSupport('file', {
            onChange: function () {
                var selectedFiles = this.customFormFile.getSelectedFiles();
                console.log(selectedFiles);
            }
        });
    
* **Instance** : Utiliser une instance précise.

        var customForm = $('form').customForm();
        var files = customForm.setSupport('file');
        var file = customForm.getInstance(files, $('#file-1'));
        
        if (file instanceof $.CustomFormFile) {
            file.getInput().on('change', function () {
                var selectedFiles = file.getSelectedFiles();
                console.log(selectedFiles);
            });
        }

#### reset()

Initialise l'état des éléments par défaut

#### select()

Affiche les fichiers sélectionnés

#### getSelectedFiles()

Retourne la liste des fichiers sélectionnés

* @return *{FileList|Array}*

#### getValue()

Retourne la valeur de l'input

* @return *{null|string}*

#### setLabel()

Modifie le label du fichier sélectionné

* @param *{string}* **name**

#### isEmpty()

Détermine si la valeur de l'input est vide

* @return *{boolean}*

#### isDisabled()

Détermine si l'input est désactivée

* @return *{boolean}*

#### getElements()

Retourne tous les éléments de customform

* @return *{object}*

#### getContext()

Retourne le contexte de customform (form)

* @return *{object}*

#### getInput()

Retourne l'élément <input>

* @return *{object}*

#### getInputType()

Retourne le type de l'élément input

* @return *{string}*

#### getWrapper()

Retourne le wrapper générique global (.customform)

* @param {object=undefined} **children** Permet de récupérer le wrapper à partir d'un enfant
* @return *{object}*

#### getWrapperInput()

Retourne le wrapper générique de l'élément input (.customform-input)

* @return *{object}*

#### getWrapperLabel()

Retourne le wrapper du label

* @return *{object}*

#### getWrapperFile()

Retourne le wrapper du fichier

* @return *{object}*