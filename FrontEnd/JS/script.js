// ==============================================================================
// ------------- Constante & Variable --------------
// ==============================================================================

const url = 'http://localhost:5678/api/';
// Définition de l'URL de base pour les requêtes API
const token = localStorage.getItem("token");
// Récupération du jeton d'authentification depuis le stockage local du navigateur

let gallery = [];
let galleryFilter = [];
// Initialisation de deux tableaux pour stocker la galerie complète et la galerie filtrée

let categories = [];
// Initialisation d'un tableau pour stocker les catégories

const elemGallery = document.querySelector(".gallery");
// Sélection de l'élément HTML représentant la galerie
const filtres = document.getElementById('filtres');
// Sélection de l'élément HTML représentant les filtres
const BlocModal = document.querySelector('.bloc-modal');
// Sélection de l'élément HTML représentant le bloc modal
const conteneurGalleryModal = document.querySelector('.bloc-project-modal');
// Sélection de l'élément HTML représentant le conteneur de la galerie dans le modal

const isConnected = localStorage.getItem('isConnected') == 'true' ? true : false;
// Vérification de l'état de connexion en se basant sur la valeur stockée dans le stockage local


login.addEventListener('click', () => {
    // Ajout d'un écouteur d'événement au clic sur l'élément avec l'ID 'login'

    // window.open('tonurl','_blank')
    // Commentaire optionnel : Ouverture d'une nouvelle fenêtre avec une URL spécifique

    localStorage.removeItem('token');
    // Suppression du jeton d'authentification du stockage local
    localStorage.setItem('isConnected', false);
    // Mise à jour de l'état de connexion dans le stockage local à 'false'
    window.location.href = '../pages/login.html';
    // Redirection vers la page de connexion (login.html)
})

const ScrollViewProject = document.getElementById('ViewProject');
// Sélection de l'élément avec l'ID 'ViewProject'
ScrollViewProject.addEventListener('click', () => {
    // Ajout d'un écouteur d'événement au clic sur l'élément 'ScrollViewProject'
    window.location.href = '#portfolio';
    // Défilement vers la section avec l'ID 'portfolio' sur la même page
})

const ScrollViewContact = document.getElementById('ViewContact');
// Sélection de l'élément avec l'ID 'ViewContact'
ScrollViewContact.addEventListener('click', () => {
    // Ajout d'un écouteur d'événement au clic sur l'élément 'ScrollViewContact'
    window.location.href = '#contact';
    // Défilement vers la section avec l'ID 'contact' sur la même page
})


// ==============================================================================
// ------------- Affichage des projets --------------
// ==============================================================================

fetch(url + "works", {
    method: "GET"
    // Utilisation de l'API Fetch pour effectuer une requête GET vers l'endpoint 'works' du serveur
}).then((result) => {
    return result.json()
    // Conversion de la réponse en format JSON
}).then(data => {
    gallery = data;
    galleryFilter = data;
    // Attribution des données de la galerie à deux tableaux : 'gallery' et 'galleryFilter'
    if (isConnected) {
        // Vérification de l'état de connexion de l'utilisateur
        displayGallery(gallery, elemGallery)
        displayGallery(gallery, conteneurGalleryModal)
        // Affichage de la galerie dans les éléments HTML correspondants (elemGallery et conteneurGalleryModal)
    } else {
        displayGallery(gallery, elemGallery)
        // Affichage de la galerie uniquement dans l'élément HTML 'elemGallery' en cas de non-connexion
    }
})

function displayGallery(pgallery, elm) {
    // Définition de la fonction displayGallery qui affiche la galerie dans un élément HTML spécifique

    elm.innerHTML = '';
    // Nettoie le contenu actuel de l'élément HTML
    for (let i = 0; i < pgallery.length; i++) {
        // Parcours des éléments de la galerie
        let fig = document.createElement('figure');
        // Création d'un élément 'figure' pour chaque élément de la galerie
        let img = document.createElement('img');
        // Création d'un élément 'img' avec la source de l'image définie par l'URL dans la galerie
        img.src = pgallery[i].imageUrl;
        fig.appendChild(img)

        if (elm.classList[0] != "bloc-project-modal") {
            // Vérification de la classe de l'élément pour déterminer s'il s'agit d'un affichage modal ou non
            let caption = document.createElement('figcaption');
            caption.textContent = pgallery[i].title;
            fig.appendChild(caption)
            // Si ce n'est pas un affichage modal, ajoute un élément 'figcaption' avec le titre de l'image
        } else {
            const binbackground = document.createElement('button');
            binbackground.classList.add('project-modal');
            const bin = document.createElement('i');
            bin.classList.add('fa-solid');
            bin.classList.add('fa-trash-can');
            bin.classList.add('fa-sm');
            bin.setAttribute('data-id', pgallery[i].id)
            // Si c'est un affichage modal, ajoute un bouton de suppression avec une icône de corbeille

            binbackground.addEventListener('click', async (e) => {
                // Ajout d'un écouteur d'événement pour la suppression d'une image côté serveur et dans le DOM HTML
                let idGallerie = e.target.getAttribute('data-id');

                await fetch(url + "works/" + idGallerie, {
                    method: "DELETE",
                    // Requête DELETE pour supprimer l'image côté serveur
                    headers: {
                        'Accept': '*/*',
                        Authorization: "Bearer " + token
                    }

                }).then((result) => {
                    fetch(url + "works", {
                        method: "GET"
                    }).then((result) => {
                        return result.json()
                    }).then(data => {
                        gallery = data;
                        galleryFilter = data;
                        if (isConnected) {
                            displayGallery(gallery, elemGallery)
                            displayGallery(gallery, conteneurGalleryModal)
                        } else {
                            displayGallery(gallery, elemGallery)
                        }
                    })
                    // Après suppression, actualisation de la galerie et réaffichage
                })
            })

            binbackground.appendChild(bin)
            fig.appendChild(binbackground)
            // Ajout des éléments créés à la 'figure'
        }

        elm.appendChild(fig);
        // Ajout de la 'figure' à l'élément HTML spécifié
    }
}


// ==============================================================================
// ------------- Affichage des catégories --------------
// ==============================================================================

fetch(url + "categories", {
    method: "GET"
    // Utilisation de l'API Fetch pour effectuer une requête GET vers l'endpoint 'categories' du serveur
}).then((result) => {
    return result.json()
    // Conversion de la réponse en format JSON
}).then(data => {
    categories = data;
    // Attribution des données des catégories au tableau 'categories'
    if (filtres != null && filtres != undefined) {
        // Vérification de l'existence de l'élément 'filtres' avant d'appeler la fonction displayCategories
        displayCategories()
        // Affichage des catégories
    }

})


function displayCategories() {
    // Définition de la fonction displayCategories
    let btn = document.createElement('button')
    // Création d'un bouton 'Tous'
    btn.textContent = 'Tous'
    // Définition du texte du bouton à 'Tous'
    btn.setAttribute('data-id', 0);
    // Attribution d'un attribut 'data-id' au bouton avec une valeur de 0
    btn.addEventListener('click', (e) => {
        sortProjects(e)
        // Ajout d'un écouteur d'événement au clic sur le bouton 'Tous', appelant la fonction sortProjects
    });
    btn.addEventListener('click', (e) => {
        // Ajout d'un écouteur d'événement au clic sur le bouton de catégorie, appelant la fonction sortProjects
        for (let i = 0; i < categories.length; i++) {
            let btnColorZero = document.querySelector('[data-id="' + 0 + '"]');
            if (btnColorZero != null) {
                btnColorZero.style.background = 'transparent';
                btnColorZero.style.color = '#1D6154';
            }
            let btnColor = document.querySelector('[data-id="' + categories[i].id + '"]');
            if (btnColor != null) {
                btnColor.style.background = 'transparent';
                btnColor.style.color = '#1D6154';
            }
        }
        btn.style.background = '#1D6154';
        btn.style.color = '#FFFFFF';
        // Changement du style du bouton pour indiquer la sélection visuelle

        sortProjects(e)
        // Appel de la fonction sortProjects
    });

    btn.style.background = '#1D6154';
    btn.style.color = '#FFFFFF';

    filtres.appendChild(btn)
    // Ajout du bouton 'Tous' à l'élément avec l'ID 'filtres'
    for (let i = 0; i < categories.length; i++) {
        // Boucle sur les catégories pour créer des boutons pour chaque catégorie
        let btn = document.createElement('button');
        // Création d'un nouveau bouton
        btn.textContent = categories[i].name;
        // Définition du texte du bouton avec le nom de la catégorie
        btn.setAttribute('data-id', categories[i].id);
        // Attribution d'un attribut 'data-id' au bouton avec l'ID de la catégorie


        btn.addEventListener('click', (e) => {
            // Ajout d'un écouteur d'événement au clic sur le bouton de catégorie, appelant la fonction sortProjects
            for (let i = 0; i < categories.length; i++) {
                let btnColorZero = document.querySelector('[data-id="' + 0 + '"]');
                if (btnColorZero != null) {
                    btnColorZero.style.background = 'transparent';
                    btnColorZero.style.color = '#1D6154';
                }
                let btnColor = document.querySelector('[data-id="' + categories[i].id + '"]');
                if (btnColor != null) {
                    btnColor.style.background = 'transparent';
                    btnColor.style.color = '#1D6154';
                }
            }
            btn.style.background = '#1D6154';
            btn.style.color = '#FFFFFF';
            // Changement du style du bouton pour indiquer la sélection visuelle

            sortProjects(e)
            // Appel de la fonction sortProjects
        });

        filtres.appendChild(btn)
        // Ajout du bouton de catégorie à l'élément avec l'ID 'filtres'
    }
}

const sortProjects = (e) => {
    // Définition de la fonction sortProjects
    galleryFilter = gallery.filter(item => item.categoryId == e.target.getAttribute('data-id'));
    // Filtrage de la galerie en fonction de la catégorie sélectionnée (à partir de l'attribut 'data-id' du bouton cliqué)
    if (galleryFilter.length == 0) {
        // Vérification si le filtre a produit un résultat vide
        displayGallery(gallery, elemGallery);
        // Si le filtre est vide, affiche la galerie complète
    } else {
        displayGallery(galleryFilter, elemGallery);
        // Si le filtre a produit des résultats, affiche la galerie filtrée
    }
}

// ==============================================================================
// ---------------- Ouverture / Fermeture de la modal ------------------
// ==============================================================================

const openModal = document.querySelector('.goModify');
// Sélection de l'élément avec la classe 'goModify' utilisé pour ouvrir le modal

const IconOpenModal = document.querySelector('.ModifyIcon');
// Sélection de l'icône utilisée pour ouvrir le modal

const closeModal = document.querySelector('.modal');
// Sélection de l'élément avec la classe 'modal' représentant la fenêtre modale

const navModal = document.getElementById('NavModal');
// Sélection de l'élément avec l'ID 'NavModal' représentant la barre de navigation dans le modal

const crossModal = document.getElementById('Xmark');
// Sélection de l'élément avec l'ID 'Xmark' représentant la croix pour fermer le modal


if (isConnected) {
    // Vérification de l'état de connexion de l'utilisateur

    crossModal.addEventListener('click', () => {
        // Ajout d'un écouteur d'événement au clic sur l'élément avec l'ID 'Xmark' pour fermer le modal
        closeModale();
    })

    openModal.addEventListener('click', () => {
        // Ajout d'un écouteur d'événement au clic sur l'élément avec la classe 'goModify' pour ouvrir le modal
        document.querySelector('.modal').style.display = 'flex';
        // Affichage du modal en définissant sa propriété de style 'display' à 'flex'
    })

    closeModal.addEventListener('click', (event) => {
        // Ajout d'un écouteur d'événement au clic sur l'élément avec la classe 'modal' pour fermer le modal
        if (event.target == closeModal)
            // Vérification si l'événement a été déclenché par l'élément 'modal' lui-même (et non ses enfants)
            closeModale();
        // Appel de la fonction pour fermer le modal
    })

    function closeModale() {
        // Définition de la fonction pour fermer le modal
        document.querySelector('.modal').style.display = 'none';
        // Masquage du modal en définissant sa propriété de style 'display' à 'none'
    }



    // ==============================================================================
    // ---------------- Ajouter un projet / Supprimer un projet ------------------
    // ==============================================================================


    const addProject = document.createElement('button');
    addProject.textContent = 'Ajouter une photo';
    addProject.id = 'addProject';
    // Création d'un bouton pour ajouter un projet

    const ContenerTitleModal = document.querySelector('.Title-project-modal');
    // Sélection de l'élément avec la classe 'Title-project-modal' dans le modal pour ajouter le bouton d'ajout de projet
    const ValidButton = document.querySelector('.bottom-bloc-modal');
    // Sélection de l'élément avec la classe 'bottom-bloc-modal' contenant les boutons de validation dans le modal
    ValidButton.appendChild(addProject);
    // Ajout du bouton d'ajout de projet au bloc de boutons de validation dans le modal

    const TitleModal = document.createElement('h3');
    TitleModal.textContent = 'Galerie Photo';
    // Création d'un élément de titre 'h3' pour le modal
    ContenerTitleModal.appendChild(TitleModal)
    // Ajout du titre au conteneur de titre dans le modal

    addProject.addEventListener('click', (event) => {
        ContenerTitleModal.innerHTML = '';
        conteneurGalleryModal.innerHTML = '';
        ValidButton.innerHTML = '';
        // Permet de vider le contenu de la modal au clique pour faire la seconde page 

        const listContenerTitleModal = [...document.querySelectorAll('.Title-project-modal')];
        // Sélection de tous les éléments avec la classe 'Title-project-modal' et conversion en un tableau avec spread operator
        listContenerTitleModal.forEach((elm) => {
            // Parcours de chaque élément dans le tableau
            elm.remove()
            // Suppression de chaque élément du DOM
        })

        conteneurGalleryModal.classList.replace('bloc-project-modal', 'bloc-project-modal-two');
        // Changement de class au clique d'ajout photo 

        TitleModal.textContent = 'Ajout photo';
        // Création du Titre de la modal

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('conteneurImg');
        // Création du conteneur de l'image

        const imgModal = document.createElement('img');
        imgModal.src = '../assets/icons/add Picture.svg'
        // Création de l'image à l'intérieur du conteneur

        const labelInput = document.createElement('label')
        labelInput.setAttribute('for', 'AddPicModal');
        labelInput.textContent = '+ Ajouter photo';
        labelInput.classList.add('AddPicModal');

        const AddPicture = document.createElement('input');
        AddPicture.type = 'file';
        AddPicture.setAttribute('name', 'AddPicModal');
        AddPicture.id = 'AddPicModal';
        AddPicture.style.display = 'none'
        // Création du bouton permettant d'ajouter une photo

        let imgUpload = null;
        // Initialisation d'une variable pour stocker l'image téléchargée
        AddPicture.addEventListener('change', (data) => {
            // Ajout d'un écouteur d'événement au changement de l'input de type fichier avec l'ID 'AddPicture'
            AddPicture.style.display = 'none';
            UnderButtonText.style.display = 'none';
            labelInput.style.display = 'none';
            // Masquage de l'input de type fichier et des éléments associés une fois une image téléchargée

            imgDiv.classList.replace('conteneurImg', 'conteneurImgScnd');
            // Modification de la classe de l'élément avec l'ID 'imgDiv' pour ajuster le style
            let reader = new FileReader()
            // Création d'un objet FileReader pour lire le contenu de l'image
            reader.onload = (e) => {
                // Ajout d'un gestionnaire d'événement au chargement de l'image
                imgModal.src = e.target.result;
                // Attribution de la source de l'image modal à l'URL de l'image chargée
            }
            imgUpload = data.target.files[0];
            // Stockage de la première image du tableau de fichiers sélectionnés dans la variable imgUpload
            reader.readAsDataURL(data.target.files[0])
            // Lecture du contenu de l'image en tant que URL de données
        })

        const UnderButtonText = document.createElement('p');
        UnderButtonText.textContent = 'JPG, PNG: 4mo max';
        UnderButtonText.classList.add('UnderButton');
        // Création du paragraphe sous le bouton d'ajout de photo

        // ==============================================================================
        // ------------------ Formulaire ajout projet modal ----------------------- 
        // ==============================================================================

        const TitreProjet = document.createElement('form');
        TitreProjet.classList.add('formModal');
        // Création d'un formulaire pour le titre du projet

        const LabelTitleModal = document.createElement('label');
        LabelTitleModal.textContent = 'Titre';
        LabelTitleModal.setAttribute('name', 'TitreModal');
        LabelTitleModal.classList.add('LabelModal');
        // Création d'une étiquette (label) pour le champ de titre dans le formulaire

        const InputModal = document.createElement('input');
        InputModal.setAttribute('type', 'text');
        InputModal.setAttribute('for', 'TitreModal');
        InputModal.setAttribute('id', 'TitreModal');
        InputModal.setAttribute('maxlength', '25');
        InputModal.classList.add('inputModal');
        // Création d'un champ de saisie (input) de type texte pour le titre dans le formulaire

        InputModal.addEventListener('input', (e) => {
            // Ajout d'un écouteur d'événement à l'entrée du champ de saisie pour ajuster le style du bouton de validation

            if (e.target.value.length > 0) {
                // Vérification si le champ de saisie contient du texte
                ProjectButton.classList.replace('ValidateButton', 'ValidateButtonTwo');
                // Si du texte est présent, ajuste la classe du bouton de validation pour activer le style 'ValidateButtonTwo'
            } else {
                ProjectButton.classList.replace('ValidateButtonTwo', 'ValidateButton');
                // Si le champ de saisie est vide, ajuste la classe du bouton de validation pour revenir au style 'ValidateButton'
            }
        })

        const LabelSelectCategorie = document.createElement('label');
        LabelSelectCategorie.textContent = 'Catégorie';
        LabelSelectCategorie.setAttribute('name', 'LabelCategorie');
        LabelSelectCategorie.classList.add('LabelModal');
        // Création d'une étiquette (label) pour la sélection de catégorie dans le formulaire

        const SelectCategorieModal = document.createElement('select');
        SelectCategorieModal.setAttribute('for', 'LabelCategorie');
        SelectCategorieModal.setAttribute('name', 'Selection');
        SelectCategorieModal.classList.add('inputModal');
        SelectCategorieModal.setAttribute('id', 'Selection');
        // Création d'un élément de sélection (select) pour choisir une catégorie dans le formulaire

        for (let i = 0; i < categories.length; i++) {
            // Remplissage de la liste déroulante avec les options de catégories disponibles
            CategorieModal = document.createElement('option');
            CategorieModal.textContent = categories[i].name;
            CategorieModal.setAttribute('data-id', categories[i].id);
            CategorieModal.setAttribute('for', 'Selection');
            // Création d'une option pour chaque catégorie

            SelectCategorieModal.appendChild(CategorieModal)
            // Ajout de l'option à la liste déroulante
        }

        const errorLabel = document.createElement('label');
        errorLabel.id = 'errorLabel';
        // Création d'une étiquette pour afficher d'éventuels messages d'erreur

        const ProjectButton = document.createElement('button');
        ValidButton.classList.replace('bottom-bloc-modal', 'bottom-bloc-modal-two');
        ProjectButton.textContent = 'Valider';
        ProjectButton.classList.add('ValidateButton');
        // Création d'un bouton de validation de projet

        ProjectButton.addEventListener('click', async () => {
            // Ajout d'un écouteur d'événement au clic sur le bouton de validation
            errorLabel.innerText = '';
            // Effacement des messages d'erreur précédents

            const formulaire = new FormData();
            // Création d'un objet FormData pour faciliter l'envoi des données au serveur
            formulaire.append('id', 0);
            formulaire.append('image', imgUpload);
            formulaire.append('title', document.getElementById('TitreModal').value);
            formulaire.append('category', document.getElementById('Selection').options[document.getElementById('Selection').selectedIndex].getAttribute('data-id'));
            // Ajout des données du formulaire à l'objet FormData


            if (imgUpload == null || document.getElementById('TitreModal').value == null || document.getElementById('Selection').options[document.getElementById('Selection').selectedIndex].getAttribute('data-id') == null) {
                // Vérification si l'une des données du formulaire est manquante
                errorLabel.innerText = 'Tous les champs ne sont pas remplis';
                // Affichage d'un message d'erreur si l'une des données est manquante
            } else {
                await fetch(url + "works", {
                    method: "POST",
                    body: formulaire,
                    headers: {
                        'Accept': 'application/json',
                        Authorization: "Bearer " + token
                    }
                    // Envoi des données au serveur via une requête POST

                }).then(async (result) => {
                    return result.json()
                    // Traitement de la réponse JSON
                }).then(data => {
                    gallery.push(data)
                    // Ajout des données de la nouvelle image à la galerie
                    conteneurGalleryModal.classList.replace('bloc-project-modal-two', 'bloc-project-modal');
                    ValidButton.classList.replace('bottom-bloc-modal-two', 'bottom-bloc-modal');
                    ValidButton.innerHTML = '';
                    ContenerTitleModal.innerHTML = '';
                    // Rétablissement du style du modal et des éléments associés

                    console.log(ContenerTitleModal);


                    const sectTitle = document.createElement('div');
                    sectTitle.classList.add("Title-project-modal");
                    // Création d'un nouveau conteneur de titre pour le modal

                    const TitleModalb = document.createElement('h3');
                    TitleModalb.textContent = 'Galerie Photo';
                    sectTitle.appendChild(TitleModalb)
                    // Création d'un titre pour le modal

                    arrow.style.display = 'none';
                    // Masquage de la flèche de navigation

                    ContenerTitleModal.appendChild(TitleModal)
                    ValidButton.appendChild(addProject);
                    // Ajout des éléments créés au DOM


                    displayGallery(gallery, conteneurGalleryModal);
                    // Affichage de la galerie dans le modal en utilisant la fonction displayGallery
                    const blcModal = document.querySelector('.bloc-modal');
                    // Sélection de l'élément avec la classe 'bloc-modal' dans le DOM
                    blcModal.insertBefore(sectTitle, blcModal.children[1])
                    // Insertion du nouveau conteneur de titre (sectTitle) juste avant le deuxième enfant de blcModal

                    console.log("mes données", gallery)
                    // Affichage de la galerie mise à jour
                    displayGallery(gallery, elemGallery)
                    // Mise à jour de l'affichage de la galerie principale

                    closeModale()
                    // Fermeture du modal

                })
            }
        })

        // ------------------------------------------------------------------------------------

        conteneurGalleryModal.appendChild(ContenerTitleModal)
        // Ajoute l'élément ContenerTitleModal en tant qu'enfant de conteneurGalleryModal
        ContenerTitleModal.appendChild(TitleModal)
        // Ajoute l'élément TitleModal en tant qu'enfant de ContenerTitleModal
        conteneurGalleryModal.appendChild(imgDiv)
        // Ajoute l'élément imgDiv en tant qu'enfant de conteneurGalleryModal
        conteneurGalleryModal.appendChild(TitreProjet)
        // Ajoute l'élément TitreProjet en tant qu'enfant de conteneurGalleryModal
        imgDiv.appendChild(imgModal)
        // Ajoute l'élément imgModal en tant qu'enfant de imgDiv
        imgDiv.appendChild(labelInput)
        // Ajoute l'élément labelInput en tant qu'enfant de imgDiv
        imgDiv.appendChild(AddPicture)
        // Ajoute l'élément AddPicture en tant qu'enfant de imgDiv
        imgDiv.appendChild(UnderButtonText)
        // Ajoute l'élément UnderButtonText en tant qu'enfant de imgDiv
        TitreProjet.appendChild(LabelTitleModal)
        // Ajoute l'élément LabelTitleModal en tant qu'enfant de TitreProjet
        TitreProjet.appendChild(InputModal)
        // Ajoute l'élément InputModal en tant qu'enfant de TitreProjet
        TitreProjet.appendChild(LabelSelectCategorie)
        // Ajoute l'élément LabelSelectCategorie en tant qu'enfant de TitreProjet
        TitreProjet.appendChild(SelectCategorieModal)
        // Ajoute l'élément SelectCategorieModal en tant qu'enfant de TitreProjet
        ValidButton.appendChild(errorLabel)
        // Ajoute l'élément errorLabel en tant qu'enfant de ValidButton
        ValidButton.appendChild(ProjectButton)
        // Ajoute l'élément ProjectButton en tant qu'enfant de ValidButton


        const contenerArrow = document.querySelector('#NavModal');
        // Sélectionne l'élément avec l'identifiant 'NavModal' dans le DOM
        const arrow = document.createElement('i');
        // Crée un nouvel élément de type 'i' (icône) dans le DOM
        arrow.classList.add('fa-solid')
        arrow.classList.add('fa-arrow-left')
        arrow.classList.add('fa-xl')
        // Ajoute les classes CSS 'fa-solid', 'fa-arrow-left', et 'fa-xl' à l'élément 'arrow'

        contenerArrow.appendChild(arrow)
        // Ajoute l'élément 'arrow' en tant qu'enfant de 'contenerArrow'

        arrow.addEventListener('click', () => {
            // Ajoute un écouteur d'événements sur l'élément 'arrow' pour gérer le clic
            conteneurGalleryModal.classList.replace('bloc-project-modal-two', 'bloc-project-modal');
            // Remplace la classe CSS 'bloc-project-modal-two' par 'bloc-project-modal' sur 'conteneurGalleryModal'
            ValidButton.classList.replace('bottom-bloc-modal-two', 'bottom-bloc-modal');
            // Remplace la classe CSS 'bottom-bloc-modal-two' par 'bottom-bloc-modal' sur 'ValidButton'
            ValidButton.innerHTML = '';
            // Efface le contenu de 'ValidButton'
            ContenerTitleModal.innerHTML = '';
            // Efface le contenu de 'ContenerTitleModal'

            console.log(ContenerTitleModal);


            const sectTitle = document.createElement('div');
            sectTitle.classList.add("Title-project-modal");
            // Crée un nouvel élément 'sectTitle' de type 'div'


            const TitleModalb = document.createElement('h3');
            TitleModalb.textContent = 'Galerie Photo';
            // Crée un nouvel élément 'TitleModalb' de type 'h3' avec le texte 'Galerie Photo'

            sectTitle.appendChild(TitleModalb)
            // Ajoute 'TitleModalb' en tant qu'enfant de 'sectTitle'

            arrow.style.display = 'none';
            // Masque l'élément 'arrow' en le rendant invisible

            ContenerTitleModal.appendChild(TitleModal)
            // Ajoute 'TitleModal' en tant qu'enfant de 'ContenerTitleModal'
            ValidButton.appendChild(addProject);
            // Ajoute 'addProject' en tant qu'enfant de 'ValidButton'


            displayGallery(gallery, conteneurGalleryModal);
            // Appelle la fonction 'displayGallery' avec les paramètres 'gallery' et 'conteneurGalleryModal'
            const blcModal = document.querySelector('.bloc-modal');
            // Sélectionne l'élément avec la classe 'bloc-modal' dans le DOM
            blcModal.insertBefore(sectTitle, blcModal.children[1])
            // Insère 'sectTitle' avant le deuxième enfant de 'blcModal'

        })

    })

}