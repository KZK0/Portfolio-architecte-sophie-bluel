// ==============================================================================
// ------------- Constante & Variable --------------
// ==============================================================================

const url = 'http://localhost:5678/api/';
const token = localStorage.getItem("token");

let gallery = [];
let galleryFilter = [];
let categories = [];
const elemGallery = document.querySelector(".gallery");
const filtres = document.getElementById('filtres');
const BlocModal = document.querySelector('.bloc-modal');
const conteneurGalleryModal = document.querySelector('.bloc-project-modal');

const isConnected = localStorage.getItem('isConnected') == 'true' ? true : false;


login.addEventListener('click', () => {

    // window.open('tonurl','_blank')
    localStorage.removeItem('token');
    localStorage.setItem('isConnected', false);
    window.location.href = '../pages/login.html';
})

const ScrollViewProject = document.getElementById('ViewProject');
ScrollViewProject.addEventListener('click', () => {
    window.location.href = '#portfolio';
})

const ScrollViewContact = document.getElementById('ViewContact');
ScrollViewContact.addEventListener('click', () => {
    window.location.href = '#contact';
})


// ==============================================================================
// ------------- Affichage des projets --------------
// ==============================================================================

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
            bin.setAttribute('data-id', pgallery[i].id)

            binbackground.addEventListener('click', async (e) => {
                // TODO faire la suppression côté serveur puis domHTML
                let idGallerie = e.target.getAttribute('data-id');

                await fetch(url + "works/" + idGallerie, {
                    method: "DELETE",
                    headers: {
                        'Accept': '*/*',
                        Authorization: "Bearer " + token
                    }

                }).then((result) => {
                    // console.log("mon element supprimé", data)
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
                })
            })

            binbackground.appendChild(bin)
            fig.appendChild(binbackground)
        }

        elm.appendChild(fig);
    }
}


// ==============================================================================
// ------------- Affichage des catégories --------------
// ==============================================================================

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

// ==============================================================================
// ---------------- Ouverture / Fermeture de la modal ------------------
// ==============================================================================

const openModal = document.querySelector('.goModify');
const IconOpenModal = document.querySelector('.ModifyIcon');
const closeModal = document.querySelector('.modal');
const navModal = document.getElementById('NavModal');
const crossModal = document.getElementById('Xmark');


if (isConnected) {

    crossModal.addEventListener('click', () => {
        closeModale();
    })

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



    // ==============================================================================
    // ---------------- Ajouter un projet / Supprimer un projet ------------------
    // ==============================================================================


    const addProject = document.createElement('button');
    addProject.textContent = 'Ajouter une photo';
    addProject.id = 'addProject';
    const ContenerTitleModal = document.querySelector('.Title-project-modal');
    const ValidButton = document.querySelector('.bottom-bloc-modal');
    ValidButton.appendChild(addProject);

    const TitleModal = document.createElement('h3');
    TitleModal.textContent = 'Galerie Photo';
    ContenerTitleModal.appendChild(TitleModal)

    addProject.addEventListener('click', (event) => {
        ContenerTitleModal.innerHTML = '';
        conteneurGalleryModal.innerHTML = '';
        ValidButton.innerHTML = '';
        // ValidButton.appendChild(addProject);
        // Permet de vider le contenu de la modal au clique pour faire la seconde page 

        const listContenerTitleModal = [...document.querySelectorAll('.Title-project-modal')];
        listContenerTitleModal.forEach((elm)=>{
            elm.remove()
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
        AddPicture.addEventListener('change', (data) => {
            AddPicture.style.display = 'none';
            UnderButtonText.style.display = 'none';
            labelInput.style.display = 'none';
            imgDiv.classList.replace('conteneurImg', 'conteneurImgScnd');
            let reader = new FileReader()
            reader.onload = (e) => {
                imgModal.src = e.target.result;
            }
            imgUpload = data.target.files[0];
            reader.readAsDataURL(data.target.files[0])
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

        const LabelTitleModal = document.createElement('label');
        LabelTitleModal.textContent = 'Titre';
        LabelTitleModal.setAttribute('name', 'TitreModal');

        LabelTitleModal.classList.add('LabelModal');

        const InputModal = document.createElement('input');
        InputModal.setAttribute('type', 'text');
        InputModal.setAttribute('for', 'TitreModal');
        InputModal.setAttribute('id', 'TitreModal');
        InputModal.setAttribute('maxlength', '25');
        InputModal.classList.add('inputModal');

        InputModal.addEventListener('input', (e) => {

            if (e.target.value.length > 0) {
                ProjectButton.classList.replace('ValidateButton', 'ValidateButtonTwo');
                ProjectButton.disabled = false;
            } else {
                ProjectButton.classList.replace('ValidateButtonTwo', 'ValidateButton');
                ProjectButton.disabled = true;
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
        SelectCategorieModal.setAttribute('id', 'Selection');

        for (let i = 0; i < categories.length; i++) {
            CategorieModal = document.createElement('option');
            CategorieModal.textContent = categories[i].name;
            CategorieModal.setAttribute('data-id', categories[i].id);
            CategorieModal.setAttribute('for', 'Selection');
            SelectCategorieModal.appendChild(CategorieModal)
        }

        const ProjectButton = document.createElement('button');
        ValidButton.classList.replace('bottom-bloc-modal', 'bottom-bloc-modal-two');
        ProjectButton.textContent = 'Valider';
        ProjectButton.classList.add('ValidateButton');

        ProjectButton.addEventListener('click', async () => {
            // TODO faire l'ajout' côté serveur puis domHTML
            const formulaire = new FormData();
            formulaire.append('id', 0);
            formulaire.append('image', imgUpload);
            formulaire.append('title', document.getElementById('TitreModal').value);
            formulaire.append('category', document.getElementById('Selection').options[document.getElementById('Selection').selectedIndex].getAttribute('data-id'));



            await fetch(url + "works", {
                method: "POST",
                body: formulaire,
                headers: {
                    'Accept': 'application/json',
                    Authorization: "Bearer " + token
                }

            }).then(async (result) => {

                return result.json()
            }).then(data => {

                gallery.push(data)
                conteneurGalleryModal.classList.replace('bloc-project-modal-two', 'bloc-project-modal');
                ValidButton.classList.replace('bottom-bloc-modal-two', 'bottom-bloc-modal');
                ValidButton.innerHTML = '';
                ContenerTitleModal.innerHTML = '';
                console.log(ContenerTitleModal);


                const sectTitle = document.createElement('div');
                sectTitle.classList.add("Title-project-modal");


                const TitleModalb = document.createElement('h3');
                TitleModalb.textContent = 'Galerie Photo';
                sectTitle.appendChild(TitleModalb)


                arrow.style.display = 'none';


                ContenerTitleModal.appendChild(TitleModal)
                ValidButton.appendChild(addProject);


                displayGallery(gallery, conteneurGalleryModal);
                const blcModal = document.querySelector('.bloc-modal');
                blcModal.insertBefore(sectTitle,blcModal.children[1])
                console.log("mes données", gallery)
                displayGallery(gallery, elemGallery)


                closeModale()
            })
        })

        // ------------------------------------------------------------------------------------

        conteneurGalleryModal.appendChild(ContenerTitleModal)
        ContenerTitleModal.appendChild(TitleModal)
        conteneurGalleryModal.appendChild(imgDiv)
        conteneurGalleryModal.appendChild(TitreProjet)
        imgDiv.appendChild(imgModal)
        imgDiv.appendChild(labelInput)
        imgDiv.appendChild(AddPicture)
        imgDiv.appendChild(UnderButtonText)
        TitreProjet.appendChild(LabelTitleModal)
        TitreProjet.appendChild(InputModal)
        TitreProjet.appendChild(LabelSelectCategorie)
        TitreProjet.appendChild(SelectCategorieModal)
        ValidButton.appendChild(ProjectButton)

        //TODO : ici ajouter la fleche de retour, ne pas oublier de mettre l'event sur la fleche
        const contenerArrow = document.querySelector('#NavModal');
        const arrow = document.createElement('i');
        arrow.classList.add('fa-solid')
        arrow.classList.add('fa-arrow-left')
        arrow.classList.add('fa-xl')
        contenerArrow.appendChild(arrow)

        arrow.addEventListener('click', () => {
            conteneurGalleryModal.classList.replace('bloc-project-modal-two', 'bloc-project-modal');
            ValidButton.classList.replace('bottom-bloc-modal-two', 'bottom-bloc-modal');
            ValidButton.innerHTML = '';
            ContenerTitleModal.innerHTML = '';
            console.log(ContenerTitleModal);

          
            const sectTitle = document.createElement('div');
            sectTitle.classList.add("Title-project-modal");


            const TitleModalb = document.createElement('h3');
            TitleModalb.textContent = 'Galerie Photo';
            sectTitle.appendChild(TitleModalb)
            

            arrow.style.display = 'none';
                 
         
            ContenerTitleModal.appendChild(TitleModal)
            ValidButton.appendChild(addProject);
           

            displayGallery(gallery, conteneurGalleryModal);
            const blcModal = document.querySelector('.bloc-modal');
            blcModal.insertBefore(sectTitle,blcModal.children[1])
             
        })

    })

}