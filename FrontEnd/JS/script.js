// ------------- Constante & Variable --------------

const url = 'http://localhost:5678/api/';

let gallery = [];
let galleryFilter = [];
let categories = [];
const elemGallery = document.querySelector(".gallery");
const filtres = document.getElementById('filtres');
const conteneurGalleryModal = document.querySelector('.bloc-project-modal');
const SecondConteneurGalleryModal = document.querySelector('.bloc-project-modal-two');

const isConnected = localStorage.getItem('isConnected') == 'true' ? true : false;


login.addEventListener('click', () => {

    // window.open('tonurl','_blank')
    localStorage.removeItem('token')
    localStorage.setItem('isConnected', false)
    window.location.href = '../pages/login.html';
})

// ------------- Affichage des projets --------------

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

function displayGallery(pgallery, elm) {

    elm.innerHTML = '';
    for (let i = 0; i < pgallery.length; i++) {
        let fig = document.createElement('figure');
        let img = document.createElement('img');
        img.src = pgallery[i].imageUrl;
        fig.appendChild(img)

        if (elm.classList[0] != "bloc-project-modal") {
            let caption = document.createElement('figcaption');
            caption.textContent = pgallery[i].title;
            fig.appendChild(caption)
        } else {
            const binbackground = document.createElement('button');
            binbackground.classList.add('project-modal');
            const bin = document.createElement('i');
            bin.classList.add('fa-solid');
            bin.classList.add('fa-trash-can');
            bin.classList.add('fa-sm');


            binbackground.addEventListener('click', () => {
                // TODO faire la suppression côté serveur puis domHTML

            })

            binbackground.appendChild(bin)
            fig.appendChild(binbackground)
        }

        elm.appendChild(fig);
    }
}

function displayBin() {
    for (let i = 0; i < gallery.length; i++) {
        const binbackground = document.createElement('button');
        const bin = document.createElement('i');
        binbackground.classList.add('.project-modal');
        bin.classList.add('fa-solid');
        bin.classList.add('fa-trash-can');
        bin.classList.add('fa-sm');

        img.appendChild(binbackground);
        binbackground.appendChild(bin);
    }
}

// ------------- Affichage des catégories --------------

// if (!isConnected) {
fetch(url + "categories", {
    method: "GET"
}).then((result) => {
    return result.json()
}).then(data => {
    categories = data;
    if (filtres != null && filtres != undefined) {
        displayCategories()
    }

})
// }

function displayCategories() {
    let btn = document.createElement('button')
    btn.textContent = 'Tous'
    btn.setAttribute('data-id', 0);
    btn.addEventListener('click', (e) => {
        sortProjects(e)
    });

    filtres.appendChild(btn)
    for (let i = 0; i < categories.length; i++) {
        btn = document.createElement('button');
        btn.textContent = categories[i].name;
        btn.setAttribute('data-id', categories[i].id);
        btn.addEventListener('click', (e) => {
            sortProjects(e)
        });
        filtres.appendChild(btn)
    }
}

const sortProjects = (e) => {
    galleryFilter = gallery.filter(item => item.categoryId == e.target.getAttribute('data-id'));
    if (galleryFilter.length == 0) {
        displayGallery(gallery, elemGallery);
    } else {
        displayGallery(galleryFilter, elemGallery);
    }
}


// ---------------- Ouverture / Fermeture de la modal ------------------

const openModal = document.querySelector('.goModify');
const closeModal = document.querySelector('.modal');
const crossModal = document.getElementById('crossModal')


if (isConnected) {

    // crossModal.addEventListener('click', () => {
    //     closeModale();
    // })
    openModal.addEventListener('click', () => {
        document.querySelector('.modal').style.display = 'flex';
    })

    closeModal.addEventListener('click', (event) => {
        if (event.target == closeModal)
            closeModale();
    })

    function closeModale() {
        document.querySelector('.modal').style.display = 'none';
    }

    // ---------------- Ajouter un projet / Supprimer un projet ------------------

    const addProject = document.getElementById('addProject');
    const TitleModal = document.querySelector('.Title-project-modal');
    const ValidButton = document.querySelector('.bottom-bloc-modal');

    addProject.addEventListener('click', (event) => {
        TitleModal.innerHTML = '';
        conteneurGalleryModal.innerHTML = '';
        ValidButton.innerHTML = '';
        // Permet de vider le contenu de la modal au clique pour faire la seconde page 

        conteneurGalleryModal.classList.replace('bloc-project-modal', 'bloc-project-modal-two');
        // Changement de class au clique d'ajout photo 

        TitleModal.textContent = 'Ajout photo';
        // Création du Titre de la modal

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('conteneurImg');
        // Création du conteneur de l'image

        const img = document.createElement('img');
        img.src = '../assets/icons/add Picture.svg'
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
        // AddPicture.textContent = '+ Ajouter photo';
        AddPicture.classList.add('AddPicModal');
        AddPicture.classList.add('picModalIn');
        // Création du bouton permettant d'ajouter une photo
        AddPicture.addEventListener('change', (data) => {
            AddPicture.style.display = 'none';
            UnderButtonText.style.display = 'none';
            imgDiv.classList.replace('conteneurImg', 'conteneurImgScnd');
            let reader = new FileReader()
            reader.onload = (e) => {
                img.src = e.target.result;
            }

            reader.readAsDataURL(data.target.files[0])
        })

        AddPicture.addEventListener('mouseenter', () => {
            img.classList.add('picModalIn');
            AddPicture.classList.add('picModalIn');
        })
        AddPicture.addEventListener('mouseout', () => {
            img.classList.remove('picModalIn');
            AddPicture.classList.remove('picModalIn');
        })
        // Effet hover d'opacity sur le bouton et l'image

        const UnderButtonText = document.createElement('p');
        UnderButtonText.textContent = 'JPG, PNG: 4mo max';
        UnderButtonText.classList.add('UnderButton');
        // Création du paragraphe sous le bouton d'ajout de photo

        // ------------------ Formulaire ajout projet modal ----------------------- 

        const TitreProjet = document.createElement('form');
        TitreProjet.classList.add('formModal');

        const LabelTitleModal = document.createElement('label');
        LabelTitleModal.textContent = 'Titre';
        LabelTitleModal.setAttribute('name', 'TitreModal');
        LabelTitleModal.classList.add('LabelModal');

        const InputModal = document.createElement('input');
        InputModal.setAttribute('type', 'text');
        InputModal.setAttribute('for', 'TitreModal');
        InputModal.setAttribute('maxlength', '25');
        InputModal.classList.add('inputModal');

        InputModal.addEventListener('input', (e) => {

            if (e.target.value.length > 0) {
                ProjectButton.classList.replace('ValidateButton', 'ValidateButtonTwo');
            } else {
                ProjectButton.classList.replace('ValidateButtonTwo', 'ValidateButton');
            }
        })

        const LabelSelectCategorie = document.createElement('label');
        LabelSelectCategorie.textContent = 'Catégorie';
        LabelSelectCategorie.setAttribute('name', 'LabelCategorie');
        LabelSelectCategorie.classList.add('LabelModal');

        const SelectCategorieModal = document.createElement('select');
        SelectCategorieModal.setAttribute('for', 'LabelCategorie');
        SelectCategorieModal.setAttribute('name', 'Selection');
        SelectCategorieModal.classList.add('inputModal');

        for (let i = 0; i < categories.length; i++) {
            CategorieModal = document.createElement('option');
            CategorieModal.textContent = categories[i].name;
            CategorieModal.setAttribute('data-id', categories[i].id);
            CategorieModal.setAttribute('for', 'Selection');
            SelectCategorieModal.appendChild(CategorieModal)
        }


        // ----------------------------------------------------------------------------- 
        const ProjectButton = document.createElement('button');
        ProjectButton.textContent = 'Valider';
        ProjectButton.classList.add('ValidateButton');

        conteneurGalleryModal.appendChild(TitleModal)
        conteneurGalleryModal.appendChild(imgDiv)
        conteneurGalleryModal.appendChild(TitreProjet)
        imgDiv.appendChild(img)
        imgDiv.appendChild(labelInput)
        imgDiv.appendChild(AddPicture)
        imgDiv.appendChild(UnderButtonText)
        TitreProjet.appendChild(LabelTitleModal)
        TitreProjet.appendChild(InputModal)
        TitreProjet.appendChild(LabelSelectCategorie)
        TitreProjet.appendChild(SelectCategorieModal)
        ValidButton.appendChild(ProjectButton)

        //TODO : ici ajouter la fleche de retour, ne pas oublier de mettre l'event sur la fleche
        const contenerArrow = document.querySelector('#crossModal');
        const arrow = document.createElement('i');
        arrow.classList.add('fa-solid')
        arrow.classList.add('fa-arrow-left')
        arrow.classList.add('fa-xl')
        contenerArrow.appendChild(arrow)

        arrow.addEventListener('click', () => {
            conteneurGalleryModal.classList.replace('bloc-project-modal-two', 'bloc-project-modal');
            contenerArrow.innerHTML = '';

            displayGallery(gallery, conteneurGalleryModal)
        })

    })
}